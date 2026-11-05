// Weekly content bot for data/content.json (runs on GitHub Actions, see .github/workflows/content.yml).
//
//  1. New MCQs: an AI model writes a few fresh MCQs for the next topics in rotation; a second,
//     different model answers each one blind and only questions where both agree are kept.
//     Duplicates of anything already in the app are dropped.
//  2. Urdu: translates the next batch of MCQs into Urdu, so the in-quiz "اردو" button covers more
//     questions every week.
//  3. Model papers: three new full model papers a week (medical / engineering / general) built from
//     the whole bank - these need no AI and always run.
//
// AI uses NVIDIA NIM (env NVIDIA_API_KEY, a GitHub secret). Without the key, steps 1-2 are skipped.
// Run locally:  node scripts/auto/grow.mjs   (Node 23.6+ runs the app's .ts data files directly)
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

const SRC = new URL('../../src/', import.meta.url);
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith('@/')) spec = new URL(spec.slice(2), SRC).href;
    if ((spec.startsWith('.') || spec.startsWith('file:')) && !/\.\w+$/.test(spec)) {
      const base = new URL(spec, ctx.parentURL);
      for (const ext of ['.ts', '.tsx']) if (existsSync(fileURLToPath(base) + ext)) return next(base.href + ext, ctx);
    }
    return next(spec, ctx);
  },
});
const { SUBJECTS, ALL } = await import(new URL('data/bank.ts', SRC).href);

const OUT = new URL('../../data/content.json', import.meta.url);
const KEY = process.env.NVIDIA_API_KEY ?? '';
const MODELS = (process.env.NIM_MODELS ?? 'google/gemma-4-31b-it,mistralai/mistral-large-4-1t-a52b,deepseek-ai/deepseek-v4.1-flash,z-ai/glm-5.3-flash')
  .split(',').map((m) => m.trim()).filter(Boolean);
const TOPICS_PER_RUN = Number(process.env.TOPICS_PER_RUN ?? 8);
const PER_TOPIC = Number(process.env.PER_TOPIC ?? 5);
const URDU_PER_RUN = Number(process.env.URDU_PER_RUN ?? 60);
const DEADLINE = Date.now() + Number(process.env.MAX_MINUTES ?? 40) * 60_000;

const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const hasUrdu = (s) => /[؀-ۿ]/.test(s);
const week = (() => {
  const d = new Date(Date.now() + 5 * 3600_000);
  const day = (d.getUTCDay() + 6) % 7;
  const thu = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 3));
  const n = Math.floor((thu.getTime() - Date.UTC(thu.getUTCFullYear(), 0, 1)) / 86_400_000 / 7) + 1;
  return { id: `${thu.getUTCFullYear()}-W${String(n).padStart(2, '0')}`, n, year: thu.getUTCFullYear() };
})();

const content = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
content.mcqs ??= [];
content.papers ??= [];
content.ur ??= {};
content.tests ??= {};
const stats = { mcqs: 0, rejected: 0, urdu: 0, papers: 0 };

// ---------------------------------------------------------------- AI helper
async function chat(model, prompt, maxTokens = 3000) {
  const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, temperature: 0.4, messages: [{ role: 'user', content: prompt }] }),
    signal: AbortSignal.timeout(maxTokens > 2000 ? 150_000 : 60_000),
  });
  if (!r.ok) throw new Error(`${model}: HTTP ${r.status}`);
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error(`${model}: empty reply`);
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

const dead = new Set();
/** Tries the models in order (skipping `not` and ones that failed twice); returns { model, data }. */
async function askJson(prompt, { not, maxTokens } = {}) {
  for (const model of MODELS) {
    if (model === not || dead.has(model) || Date.now() > DEADLINE) continue;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const text = await chat(model, prompt, maxTokens);
        const start = text.search(/[[{]/);
        const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
        if (start < 0 || end < start) throw new Error('no JSON');
        return { model, data: JSON.parse(text.slice(start, end + 1)) };
      } catch (e) {
        console.warn('  ', String(e).slice(0, 160));
      }
    }
    dead.add(model);
  }
  return null;
}

// ---------------------------------------------------------------- 1. new MCQs
const known = new Set([...ALL.map((m) => norm(m.q)), ...content.mcqs.map((m) => norm(m.q))]);
const LEVEL_TEXT = { matric: 'Matric (class 9-10)', inter: 'Intermediate / FSc (class 11-12)', test: 'entry and job tests' };

async function newMcqs() {
  const pairs = SUBJECTS.filter((s) => s.key !== 'urdu')
    .flatMap((s) => s.topics.filter((t) => t.id !== 'mixed' && t.id !== 'updates').map((t) => ({ s, t })));
  const start = (week.n * TOPICS_PER_RUN + week.year) % pairs.length;
  const pick = Array.from({ length: Math.min(TOPICS_PER_RUN, pairs.length) }, (_, i) => pairs[(start + i) % pairs.length]);

  for (const { s, t } of pick) {
    if (Date.now() > DEADLINE) break;
    console.log(`MCQs: ${s.title} / ${t.title}`);
    const existing = ALL.filter((m) => m.sub === s.key && m.topic === t.id).map((m) => `- ${m.q}`).slice(0, 45).join('\n');
    const prompt = `You write exam MCQs for Pakistani students (${t.level.map((l) => LEVEL_TEXT[l]).join(', ')}).
Subject: ${s.title}. Topic: ${t.title}.
Write ${PER_TOPIC} NEW multiple-choice questions in the style of Pakistani board exams and entry tests (MDCAT, ECAT, NET, PPSC, CSS where relevant).
Rules: factual and unambiguous; exactly 4 options and exactly ONE correct; no "all/none of the above"; no facts that change over time (no current office holders, records or prices);
explanation of at most 30 words saying why the answer is right. Do NOT repeat these existing questions:
${existing}
Return ONLY a JSON array: [{"q":"question","o":["A","B","C","D"],"a":0,"e":"explanation"}]`;
    const gen = await askJson(prompt);
    if (!gen || !Array.isArray(gen.data)) continue;
    for (const c of gen.data.slice(0, PER_TOPIC + 2)) {
      if (Date.now() > DEADLINE) break;
      const ok = c && typeof c.q === 'string' && c.q.length > 8 && Array.isArray(c.o) && c.o.length === 4
        && c.o.every((o) => typeof o === 'string' && o.trim()) && new Set(c.o.map(norm)).size === 4 && [0, 1, 2, 3].includes(c.a)
        && !/all of the above|none of the above/i.test(c.o.join(' '));
      if (!ok || known.has(norm(c.q))) { stats.rejected++; continue; }
      // independent check by a different model, options in a new order
      const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      const v = await askJson(`Answer this multiple-choice question. Reply ONLY with JSON {"answer": <option number 1-4>, "sure": true or false}.
Question: ${c.q}
${order.map((i, k) => `${k + 1}. ${c.o[i]}`).join('\n')}`, { not: gen.model, maxTokens: 400 });
      const picked = v && Number(v.data?.answer) - 1;
      if (!v || v.data?.sure !== true || order[picked] !== c.a) { stats.rejected++; continue; }
      known.add(norm(c.q));
      content.mcqs.push({
        id: createHash('sha1').update(norm(c.q)).digest('hex').slice(0, 10),
        sub: s.key, topic: t.id, q: c.q.trim(), o: c.o.map((o) => o.trim()), a: c.a,
        e: typeof c.e === 'string' ? c.e.trim().slice(0, 300) : undefined, src: 'bot', added: new Date().toISOString().slice(0, 10),
      });
      stats.mcqs++;
    }
  }
}

// ---------------------------------------------------------------- 2. Urdu translations
async function urdu() {
  const ORDER = ['pak', 'isl', 'gk', 'sci', 'bio', 'chem', 'phy', 'math', 'comp', 'iq'];
  const remote = content.mcqs.map((m) => ({ id: `${m.sub}.${/^[a-z0-9-]{1,30}$/.test(m.topic ?? '') ? m.topic : 'updates'}.r${m.id}`, sub: m.sub, q: m.q, o: m.o, e: m.e }));
  const todo = [...ALL, ...remote]
    .filter((m) => ORDER.includes(m.sub) && !content.ur[m.id] && !hasUrdu(m.q))
    .sort((a, b) => ORDER.indexOf(a.sub) - ORDER.indexOf(b.sub))
    .slice(0, URDU_PER_RUN);
  for (let i = 0; i < todo.length; i += 5) {
    if (Date.now() > DEADLINE) break;
    const batch = todo.slice(i, i + 5);
    console.log(`Urdu: ${batch[0].id} … (${batch.length})`);
    const prompt = `Translate these multiple-choice questions into simple, correct Urdu as used in Pakistani textbooks (Urdu script).
Keep numbers, formulas, units, chemical symbols, scientific names and computer terms (like CPU, RAM) as they are. Keep the option order.
Return ONLY a JSON object mapping each id to [question, option1, option2, option3, option4, explanation] in Urdu.
${JSON.stringify(Object.fromEntries(batch.map((m) => [m.id, [m.q, ...m.o, m.e ?? '']])))}`;
    const res = await askJson(prompt, { maxTokens: 2500 });
    if (!res || typeof res.data !== 'object') continue;
    for (const m of batch) {
      const v = res.data[m.id];
      if (Array.isArray(v) && v.length >= 5 && v.slice(0, 5).every((x) => typeof x === 'string' && x.trim()) && hasUrdu(v[0])) {
        content.ur[m.id] = v.slice(0, 6).map((x) => String(x ?? '').trim());
        stats.urdu++;
      }
    }
  }
}

// ---------------------------------------------------------------- 3. weekly model papers
function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function modelPapers() {
  const TRACKS = [
    { key: 'medical', exam: 'MDCAT', title: 'MDCAT-style Model Paper', mix: { bio: 16, chem: 10, phy: 8, eng: 6 } },
    { key: 'engineering', exam: 'ECAT / NET', title: 'ECAT/NET-style Model Paper', mix: { math: 14, phy: 12, chem: 8, eng: 6 } },
    { key: 'general', exam: 'Jobs (PPSC/FPSC/NTS)', title: 'Job Test Model Paper', mix: { eng: 10, gk: 8, pak: 8, isl: 6, sci: 4, math: 2, iq: 2 } },
  ];
  const remote = content.mcqs.map((m) => ({ id: `${m.sub}.${/^[a-z0-9-]{1,30}$/.test(m.topic ?? '') ? m.topic : 'updates'}.r${m.id}`, sub: m.sub }));
  const pool = [...ALL.map((m) => ({ id: m.id, sub: m.sub })), ...remote];
  for (const t of TRACKS) {
    const id = `model-${week.id}-${t.key}`;
    if (content.papers.some((p) => p.id === id)) continue;
    const rnd = seeded([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11));
    const ids = Object.entries(t.mix).flatMap(([sub, n]) => {
      const list = pool.filter((m) => m.sub === sub);
      for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
      return list.slice(0, n).map((m) => m.id);
    });
    content.papers.push({ id, title: `${t.title} – Week ${week.n}, ${week.year}`, exam: t.exam, year: week.year, mcqs: ids, minutes: 40, src: 'bot' });
    stats.papers++;
  }
  // keep two years of bot papers; hand-added ones stay for ever
  const bot = content.papers.filter((p) => p.src === 'bot').sort((a, b) => b.id.localeCompare(a.id));
  const drop = new Set(bot.slice(312).map((p) => p.id));
  content.papers = content.papers.filter((p) => !drop.has(p.id));
}

// ---------------------------------------------------------------- run
if (KEY) {
  await newMcqs();
  await urdu();
} else {
  console.log('NVIDIA_API_KEY not set: skipping AI steps (new MCQs, Urdu).');
}
modelPapers();
content.updatedAt = new Date().toISOString();

// one item per line keeps git diffs small and the admin panel fast
const lines = (arr) => (arr.length ? `[\n${arr.map((x) => JSON.stringify(x)).join(',\n')}\n]` : '[]');
writeFileSync(OUT, `{"updatedAt":${JSON.stringify(content.updatedAt)},
"mcqs":${lines(content.mcqs)},
"papers":${lines(content.papers)},
"ur":{${Object.entries(content.ur).map(([k, v]) => `\n${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',')}${Object.keys(content.ur).length ? '\n' : ''}},
"tests":${JSON.stringify(content.tests)}
}
`);
writeFileSync(new URL('../../data/meta.json', import.meta.url), JSON.stringify({ week: week.id, ...stats }) + '\n');
console.log(`content.json: +${stats.mcqs} MCQs (${stats.rejected} rejected), +${stats.urdu} Urdu, +${stats.papers} model papers; totals ${content.mcqs.length} MCQs, ${Object.keys(content.ur).length} Urdu, ${content.papers.length} papers`);
