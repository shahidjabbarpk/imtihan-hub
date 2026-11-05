import { ALL, buildFromMix, mcqById, mcqsOf, seeded, shuffle, shuffleOptions, subjectByKey, SUBJECTS } from '@/data/bank';
import { testByKey } from '@/data/tests';
import type { Level, Mcq } from '@/data/types';
import { pkToday, useApp } from './store';

/** Route params of /quiz. Everything is a string because it comes from the URL. */
export interface QuizParams {
  mode?: 'practice' | 'mock' | 'daily' | 'bookmarks' | 'mistakes' | 'custom';
  sub?: string;
  topic?: string;
  level?: Level;
  test?: string;
  count?: string;
  minutes?: string;
  subs?: string;   // custom: comma-separated subject keys
  exam?: string;   // "1" = exam mode (answers revealed at the end only)
  full?: string;   // "1" = full-length paper (mock mode)
}

export interface Session {
  key: string;          // for best-score tracking
  title: string;
  colors: [string, string];
  kind: 'practice' | 'mock' | 'daily' | 'review';
  questions: Mcq[];
  seconds: number;      // 0 = untimed
  examMode: boolean;    // no instant feedback; answers can be changed; result at the end
}

const BLUE: [string, string] = ['#1D4ED8', '#60A5FA'];

export function buildSession(p: QuizParams): Session {
  const count = Math.max(5, Math.min(200, Number(p.count) || 15));
  const examMode = p.exam === '1';
  switch (p.mode) {
    case 'mock': {
      const t = testByKey(p.test ?? '');
      if (t) {
        const full = p.full === '1' && t.paper;
        return {
          key: full ? `full-${t.key}` : `mock-${t.key}`, title: full ? `${t.name} Full Paper` : `${t.name} Mock Test`, colors: t.colors, kind: 'mock',
          questions: shuffle(buildFromMix(full ? t.paper!.mix : t.mix)), seconds: (full ? t.paper!.minutes : t.minutes) * 60, examMode: true,
        };
      }
      break;
    }
    case 'daily': {
      // the same 10 questions for everyone on a given day, from every subject
      const today = pkToday();
      const rnd = seeded(Number(today.replace(/-/g, '')));
      const level = useApp.getState().level;
      const subs = level === 'graduate' ? ['eng', 'gk', 'pak', 'isl', 'math', 'sci', 'iq', 'comp'] : SUBJECTS.map((s) => s.key);
      const pool = ALL.filter((m) => subs.includes(m.sub));
      return {
        key: 'daily', title: 'Daily Quiz', colors: ['#B45309', '#F59E0B'], kind: 'daily',
        questions: shuffle(pool, rnd).slice(0, 10).map((m) => shuffleOptions(m, rnd)), seconds: 0, examMode: false,
      };
    }
    case 'bookmarks': {
      const ids = Object.keys(useApp.getState().bookmarks);
      return {
        key: 'bookmarks', title: 'Saved MCQs', colors: ['#BE123C', '#FB7185'], kind: 'review',
        questions: shuffle(ids.map(mcqById).filter(Boolean) as Mcq[]).slice(0, count).map((m) => shuffleOptions(m)), seconds: 0, examMode: false,
      };
    }
    case 'mistakes': {
      const w = useApp.getState().wrong;
      const ids = Object.keys(w).sort((a, b) => w[b]! - w[a]!);
      return {
        key: 'mistakes', title: 'My Mistakes', colors: ['#DC2626', '#F87171'], kind: 'review',
        questions: (ids.map(mcqById).filter(Boolean) as Mcq[]).slice(0, count).map((m) => shuffleOptions(m)), seconds: 0, examMode: false,
      };
    }
    case 'custom': {
      const subs = (p.subs ?? '').split(',').filter((k) => subjectByKey(k));
      const pool = ALL.filter((m) => subs.includes(m.sub));
      const minutes = Number(p.minutes) || 0;
      return {
        key: `custom-${subs.join('+')}`, title: 'Custom Test', colors: ['#4338CA', '#818CF8'], kind: 'mock',
        questions: shuffle(pool).slice(0, count).map((m) => shuffleOptions(m)), seconds: minutes * 60, examMode,
      };
    }
    default:
      break;
  }
  // practice: one subject, optionally one topic / level
  const sub = subjectByKey(p.sub ?? '') ?? SUBJECTS[0]!;
  const topic = sub.topics.find((t) => t.id === p.topic);
  // unseen questions first, so practice keeps moving through the bank
  const seen = useApp.getState().seen;
  const pool = mcqsOf(sub.key, topic?.id, topic ? undefined : p.level);
  const fresh = shuffle(pool.filter((m) => !seen[m.id]));
  const old = shuffle(pool.filter((m) => seen[m.id]));
  const minutes = Number(p.minutes) || 0;
  return {
    key: `practice-${sub.key}${topic ? '.' + topic.id : ''}`,
    title: topic ? topic.title : `${sub.title} Practice`,
    colors: sub.colors ?? BLUE, kind: 'practice',
    questions: [...fresh, ...old].slice(0, count).map((m) => shuffleOptions(m)),
    seconds: minutes * 60, examMode,
  };
}
