import { BIO } from './mcq-bio';
import { CHEM } from './mcq-chem';
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
  return { id: `${sub}.${t.id}.${i}`, sub, topic: t.id, q, o: [a, b, c, d], a: ans, e };
}

/** Every MCQ in the app, flattened once. */
export const ALL: Mcq[] = SUBJECTS.flatMap((s) => s.topics.flatMap((t) => t.qs.map((_, i) => toMcq(s.key, t, i))));
const BY_ID = new Map(ALL.map((m) => [m.id, m]));
export const mcqById = (id: string) => BY_ID.get(id);

export const mcqsOf = (sub: string, topic?: string, level?: Level) =>
  ALL.filter((m) => m.sub === sub && (!topic || m.topic === topic)
    && (!level || subjectByKey(sub)!.topics.find((t) => t.id === m.topic)!.level.includes(level)));

export const countOf = (sub: string) => ALL.filter((m) => m.sub === sub).length;

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
