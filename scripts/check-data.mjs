// Sanity checks for the bundled data: `npm run check-data` (Node 23+ runs the .ts files directly).
// Catches broken MCQ tuples, wrong answer indexes, duplicate options/questions and bad links.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = new URL('../src/', import.meta.url);
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith('@/')) spec = new URL(spec.slice(2), SRC).href;
    if ((spec.startsWith('.') || spec.startsWith('file:')) && !/\.\w+$/.test(spec)) {
      const base = new URL(spec, ctx.parentURL);
      for (const ext of ['.ts', '.tsx']) {
        if (existsSync(fileURLToPath(base) + ext)) return next(base.href + ext, ctx);
      }
    }
    return next(spec, ctx);
  },
});

const { SUBJECTS, ALL } = await import(new URL('../src/data/bank.ts', import.meta.url).href);
const problems = [];
const seenQ = new Map();
for (const s of SUBJECTS) {
  const ids = new Set();
  for (const t of s.topics) {
    if (ids.has(t.id)) problems.push(`${s.key}: duplicate topic id ${t.id}`);
    ids.add(t.id);
    t.qs.forEach((q, i) => {
      const where = `${s.key}.${t.id}.${i}`;
      if (q.length < 6 || q.length > 7) problems.push(`${where}: tuple length ${q.length}`);
      if (![0, 1, 2, 3].includes(q[5])) problems.push(`${where}: bad answer index ${q[5]}`);
      const opts = q.slice(1, 5);
      if (new Set(opts.map((o) => String(o).trim().toLowerCase())).size !== 4) problems.push(`${where}: duplicate options`);
      if (opts.some((o) => typeof o !== 'string' || !o.trim())) problems.push(`${where}: empty option`);
      const key = String(q[0]).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + '|' + String(q[q[5] + 1]).toLowerCase();
      if (seenQ.has(key)) problems.push(`${where}: same question as ${seenQ.get(key)} -> "${q[0]}"`);
      else seenQ.set(key, where);
    });
  }
}

const per = Object.fromEntries(SUBJECTS.map((s) => [s.key, ALL.filter((m) => m.sub === s.key).length]));
console.log('MCQs per subject:', per, 'total', ALL.length);

// links in the directory data
const dirs = ['boards', 'tests', 'universities', 'scholarships'];
let links = 0;
for (const d of dirs) {
  const p = new URL(`../src/data/${d}.ts`, import.meta.url);
  if (!existsSync(p)) continue;
  const mod = await import(p.href);
  for (const v of Object.values(mod)) {
    JSON.stringify(v, (_k, x) => {
      if (typeof x === 'string' && x.startsWith('http')) {
        links++;
        if (!/^https:\/\/[\w.-]+\.[a-z]{2,}(\/|$)/i.test(x)) problems.push(`${d}: odd url ${x}`);
      }
      return x;
    });
  }
}
console.log('links checked:', links);

if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n` + problems.join('\n'));
  process.exitCode = 1;
} else console.log('OK - no problems');
void pathToFileURL;
