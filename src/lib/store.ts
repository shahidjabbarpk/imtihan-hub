import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Storage } from './kv';

export interface Attempt {
  at: number;           // timestamp
  title: string;        // "Biology – Cell Structure", "MDCAT Mock"...
  kind: 'practice' | 'mock' | 'daily' | 'review';
  score: number;
  total: number;
  seconds: number;
}

export interface Countdown { id: string; name: string; date: string } // date = YYYY-MM-DD

export interface NewsItem { id: string; title: string; body?: string; url?: string; date: string; tag?: string }

interface AppState {
  name: string;
  level: 'matric' | 'inter' | 'graduate' | null; // what the student is preparing for (onboarding)
  goal: string | null;                           // test key the student cares about (mdcat, ecat...)
  boardId: string | null;
  theme: 'light' | 'dark';
  onboarded: boolean;

  // progress
  stats: Record<string, { done: number; right: number }>; // per subject key
  seen: Record<string, 1>;                               // mcq ids answered at least once
  wrong: Record<string, number>;                         // mcq id -> time it was last answered wrong
  bookmarks: Record<string, number>;                     // mcq id -> time saved
  attempts: Attempt[];
  streak: { days: number; last: string | null };         // last = YYYY-MM-DD (Pakistan time)
  dailyDone: string | null;                              // date of the last finished daily quiz
  best: Record<string, number>;                          // quiz key -> best %

  // tools
  countdowns: Countdown[];
  reminder: { on: boolean; hour: number; minute: number };
  news: NewsItem[];
  newsAt: string | null;
  lastInterstitial: number;

  set: (p: Partial<AppState>) => void;
  /** Records one answered MCQ. */
  answer: (id: string, sub: string, right: boolean) => void;
  toggleBookmark: (id: string) => boolean;
  /** Saves a finished quiz and moves the daily streak on. */
  finish: (a: Attempt, key: string) => void;
}

/** Today's date in Pakistan (UTC+5) as YYYY-MM-DD, so streaks roll over at Pakistani midnight. */
export function pkToday(now = Date.now()): string {
  return new Date(now + 5 * 3600_000).toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      name: '',
      level: null,
      goal: null,
      boardId: null,
      theme: 'light',
      onboarded: false,
      stats: {},
      seen: {},
      wrong: {},
      bookmarks: {},
      attempts: [],
      streak: { days: 0, last: null },
      dailyDone: null,
      best: {},
      countdowns: [],
      reminder: { on: false, hour: 20, minute: 0 },
      news: [],
      newsAt: null,
      lastInterstitial: 0,

      set: (p) => set(p),

      answer: (id, sub, right) => {
        const s = get();
        const cur = s.stats[sub] ?? { done: 0, right: 0 };
        const wrong = { ...s.wrong };
        if (right) delete wrong[id];
        else wrong[id] = Date.now();
        set({
          stats: { ...s.stats, [sub]: { done: cur.done + 1, right: cur.right + (right ? 1 : 0) } },
          seen: s.seen[id] ? s.seen : { ...s.seen, [id]: 1 },
          wrong,
        });
      },

      toggleBookmark: (id) => {
        const b = { ...get().bookmarks };
        const on = !b[id];
        if (on) b[id] = Date.now();
        else delete b[id];
        set({ bookmarks: b });
        return on;
      },

      finish: (a, key) => {
        const s = get();
        const today = pkToday(a.at);
        let { days, last } = s.streak;
        if (last !== today) {
          days = last && dayDiff(last, today) === 1 ? days + 1 : 1;
          last = today;
        }
        const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
        set({
          attempts: [a, ...s.attempts].slice(0, 200),
          streak: { days, last },
          best: (s.best[key] ?? -1) < pct ? { ...s.best, [key]: pct } : s.best,
          dailyDone: a.kind === 'daily' ? today : s.dailyDone,
        });
      },
    }),
    {
      name: 'imtihan-hub',
      version: 1,
      storage: createJSONStorage(() => Storage),
      partialize: ({ set, answer, toggleBookmark, finish, ...rest }) => rest,
    },
  ),
);

/** Streak shown to the user: it breaks if yesterday was missed. */
export function liveStreak(s: { days: number; last: string | null }): number {
  if (!s.last) return 0;
  return dayDiff(s.last, pkToday()) <= 1 ? s.days : 0;
}

export function waitForHydration(): Promise<void> {
  if (useApp.persist.hasHydrated()) return Promise.resolve();
  return new Promise((resolve) => {
    const unsub = useApp.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}
