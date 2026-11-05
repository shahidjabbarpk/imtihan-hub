import { BIO } from './mcq-bio';
import { CHEM } from './mcq-chem';
import { EXPL } from './expl';
import { COMP, GK, IQ, ISL, PAK, SCI, URDU } from './mcq-general';
import { LEGACY } from './mcq-legacy';
import { ENG, MATH } from './mcq-math-eng';
import { PHY } from './mcq-phy';
import type { Level, Mcq, Subject, Topic } from './types';

const norm = (q: string, ans: string) => `${q.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()}|${ans.toLowerCase()}`;
// the older mixed banks overlap a little with the topic banks: keep only questions not asked elsewhere
const TOPIC_KEYS = new Set([BIO, CHEM, PHY, MATH, ENG, COMP, PAK, ISL, GK, SCI, IQ, URDU].flat().flatMap((t) => t.qs.map((q) => norm(q[0], String(q[q[5] + 1])))));
const mixed = (key: string, title = 'Mixed Practice'): Topic[] => {
  const qs = (LEGACY[key] ?? []).filter((q) => !TOPIC_KEYS.has(norm(q[0], String(q[q[5] + 1]))));
  return qs.length ? [{ id: 'mixed', title, level: ['matric', 'test'], qs }] : [];
};

export const SUBJECTS: Subject[] = [
  { key: 'bio', title: 'Biology', ur: 'حیاتیات', icon: 'dna', colors: ['#047857', '#34D399'], topics: BIO },
  { key: 'chem', title: 'Chemistry', ur: 'کیمیا', icon: 'flask-outline', colors: ['#B45309', '#F59E0B'], topics: CHEM },
  { key: 'phy', title: 'Physics', ur: 'طبیعیات', icon: 'atom', colors: ['#1D4ED8', '#60A5FA'], topics: PHY },
  { key: 'math', title: 'Mathematics', ur: 'ریاضی', icon: 'calculator-variant-outline', colors: ['#7C3AED', '#C084FC'], topics: [...MATH, ...mixed('math', 'Quantitative Mix')] },
  { key: 'eng', title: 'English', ur: 'انگریزی', icon: 'alphabetical-variant', colors: ['#BE123C', '#FB7185'], topics: [...ENG, ...mixed('eng', 'English Mix')] },
  { key: 'comp', title: 'Computer Science', ur: 'کمپیوٹر', icon: 'laptop', colors: ['#4338CA', '#818CF8'], topics: [...COMP, ...mixed('comp', 'Computer Mix')] },
  { key: 'pak', title: 'Pakistan Studies', ur: 'مطالعہ پاکستان', icon: 'flag-variant-outline', colors: ['#065F46', '#10B981'], topics: [...PAK, ...mixed('pak', 'Pak Studies Mix')] },
  { key: 'isl', title: 'Islamiat', ur: 'اسلامیات', icon: 'mosque', colors: ['#0E7490', '#22D3EE'], topics: [...ISL, ...mixed('isl', 'Islamiat Mix')] },
  { key: 'gk', title: 'General Knowledge', ur: 'جنرل نالج', icon: 'earth', colors: ['#0369A1', '#38BDF8'], topics: [...GK, ...mixed('gk', 'GK Mix')] },
  { key: 'sci', title: 'Everyday Science', ur: 'روزمرہ سائنس', icon: 'lightbulb-on-outline', colors: ['#A16207', '#FACC15'], topics: SCI },
  { key: 'iq', title: 'IQ & Reasoning', ur: 'ذہانت', icon: 'head-cog-outline', colors: ['#9D174D', '#F472B6'], topics: IQ },
  { key: 'urdu', title: 'Urdu', ur: 'اردو', icon: 'feather', colors: ['#374151', '#9CA3AF'], topics: URDU },
];

export const subjectByKey = (k: string) => SUBJECTS.find((s) => s.key === k);

function toMcq(sub: string, t: Topic, i: number): Mcq {
  const [q, a, b, c, d, ans, e] = t.qs[i]!;
  const id = `${sub}.${t.id}.${i}`;
  return { id, sub, topic: t.id, q, o: [a, b, c, d], a: ans, e: e ?? EXPL[id] };
}

/** Every MCQ in the app, flattened once. */
export const ALL: Mcq[] = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.qs.map((_, i) => toMcq(s.key, t, i))));
const BY_ID = new Map(ALL.map((m) => [m.id, m]));
export const mcqById = (id: string) => BY_ID.get(id);

export const mcqsOf = (sub: string, topic?: string, level?: Level) =>
  ALL.filter((m) => m.sub === sub && (!topic || m.topic === topic)
    && (!level || subjectByKey(sub)!.topics.find((t) => t.id === m.topic)!.level.includes(level)));

export const countOf = (sub: string) => ALL.filter((m) => m.sub === sub).length;
export const topicCount = (sub: string, topic: string) => ALL.filter((m) => m.sub === sub && m.topic === topic).length;

// ---------------------------------------------------------------- online content
// New MCQs from the content feed (added from the admin panel or by the weekly content bot) are
// appended here at start-up and after each refresh. Their ids are "<sub>.<topic>.r<id>", so they
// never collide with the bundled ones and stay stable for bookmarks and mistakes.

const UR = new Map<string, string[]>();
const installed = new Set<string>();

export interface RemoteMcqIn { id: string; sub: string; topic?: string; topicTitle?: string; level?: Level[]; q: string; o: string[]; a: number; e?: string; year?: number }

const okMcq = (m: RemoteMcqIn) =>
  m && typeof m.id === 'string' && /^[\w-]{1,40}$/.test(m.id) && !!subjectByKey(m.sub) && typeof m.q === 'string' && m.q.trim().length > 3
  && Array.isArray(m.o) && m.o.length === 4 && m.o.every((x) => typeof x === 'string' && x.trim()) && [0, 1, 2, 3].includes(m.a);

/** Adds online MCQs (idempotent) and Urdu translations; returns how many new MCQs were added. */
export function installRemote(mcqs: RemoteMcqIn[], ur: Record<string, string[]> = {}): number {
  let added = 0;
  for (const m of mcqs ?? []) {
    if (!okMcq(m)) continue;
    const sub = subjectByKey(m.sub)!;
    const topicId = /^[a-z0-9-]{1,30}$/.test(m.topic ?? '') ? m.topic! : 'updates';
    const id = `${m.sub}.${topicId}.r${m.id}`;
    if (installed.has(id)) continue;
    if (!sub.topics.some((t) => t.id === topicId)) {
      sub.topics.push({ id: topicId, title: m.topicTitle || (topicId === 'updates' ? 'New & Updated MCQs' : topicId), level: m.level?.length ? m.level : ['matric', 'inter', 'test'], qs: [] });
    }
    const mcq: Mcq = { id, sub: m.sub, topic: topicId, q: m.q.trim(), o: m.o.map((x) => x.trim()), a: m.a, e: m.e?.trim() || undefined };
    ALL.push(mcq);
    BY_ID.set(id, mcq);
    installed.add(id);
    added++;
  }
  for (const [id, v] of Object.entries(ur ?? {})) {
    if (Array.isArray(v) && v.length >= 5 && v.every((x) => typeof x === 'string')) UR.set(id, v);
  }
  return added;
}

/** Urdu version of an MCQ if the content feed has one: options follow the MCQ's (shuffled) order. */
export function urduOf(m: Mcq): { q: string; o: string[]; e?: string } | null {
  const v = UR.get(m.id);
  const base = BY_ID.get(m.id);
  if (!v || !base) return null;
  const o = m.o.map((opt) => v[1 + base.o.indexOf(opt)] ?? opt);
  return { q: v[0]!, o, e: v[5] };
}
export const hasUrdu = () => UR.size > 0;

export function shuffle<T>(a: T[], rnd: () => number = Math.random): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [x[i], x[j]] = [x[j]!, x[i]!];
  }
  return x;
}

/** Options shuffled, answer index moved with them. */
export function shuffleOptions(m: Mcq, rnd: () => number = Math.random): Mcq {
  const order = shuffle([0, 1, 2, 3], rnd);
  return { ...m, o: order.map((i) => m.o[i]!), a: order.indexOf(m.a) };
}

/** Deterministic random for a seed (same daily quiz for everyone on a given day). */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Builds a paper from a mix like { bio: 20, chem: 10 } - topics spread out, options shuffled. */
export function buildFromMix(mix: Record<string, number>, rnd: () => number = Math.random): Mcq[] {
  const out: Mcq[] = [];
  for (const [sub, n] of Object.entries(mix)) {
    out.push(...shuffle(ALL.filter((m) => m.sub === sub), rnd).slice(0, n));
  }
  return out.map((m) => shuffleOptions(m, rnd));
}
