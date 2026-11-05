import { signInAnonymously } from '@firebase/auth';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { fb } from './firebase';
import { pkWeek, useApp } from './store';

export type Track = 'medical' | 'engineering' | 'general';
export interface LbRow { uid: string; name: string; value: number; extra: number; me: boolean }

async function uid(): Promise<string> {
  const { auth } = fb();
  await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser.uid;
  return (await signInAnonymously(auth)).user.uid;
}

let syncing: Promise<void> | null = null;
/** Pushes this week's points (correct answers) - only when the student joined the leaderboard. */
export function syncPoints(): Promise<void> {
  const s = useApp.getState();
  if (!s.lbOn || s.lbName.trim().length < 2) return Promise.resolve();
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      const me = await uid();
      const wk = pkWeek();
      const w = s.week.id === wk ? s.week : { points: 0, tests: 0 };
      await setDoc(doc(fb().db, 'imtihan_points', wk, 'u', me), {
        name: s.lbName.trim().slice(0, 30), points: Math.min(5000, w.points), tests: Math.min(500, w.tests), at: serverTimestamp(),
      });
    } catch { /* offline: next quiz retries */ } finally { syncing = null; }
  })();
  return syncing;
}

/** First attempt of this week's grand test counts; later attempts are practice. */
export async function submitGrand(track: Track, score: number, total: number, seconds: number): Promise<boolean> {
  const s = useApp.getState();
  const wk = pkWeek();
  const key = `${wk}-${track}`;
  if (s.grandDone === key) return false;
  s.set({ grandDone: key });
  if (!s.lbOn || s.lbName.trim().length < 2) return false;
  try {
    const me = await uid();
    await setDoc(doc(fb().db, 'imtihan_grand', key, 'u', me), {
      name: s.lbName.trim().slice(0, 30), score, total, seconds: Math.min(20000, Math.round(seconds)), at: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

async function myUid(): Promise<string | null> {
  try { const { auth } = fb(); await auth.authStateReady(); return auth.currentUser?.uid ?? null; } catch { return null; }
}

export async function topPoints(week = pkWeek()): Promise<LbRow[]> {
  const me = await myUid();
  const snap = await getDocs(query(collection(fb().db, 'imtihan_points', week, 'u'), orderBy('points', 'desc'), limit(50)));
  return snap.docs.map((d) => ({ uid: d.id, name: String(d.get('name') ?? ''), value: Number(d.get('points') ?? 0), extra: Number(d.get('tests') ?? 0), me: d.id === me }));
}

export async function topGrand(track: Track, week = pkWeek()): Promise<LbRow[]> {
  const me = await myUid();
  const snap = await getDocs(query(collection(fb().db, 'imtihan_grand', `${week}-${track}`, 'u'), orderBy('score', 'desc'), limit(100)));
  return snap.docs
    .map((d) => ({ uid: d.id, name: String(d.get('name') ?? ''), value: Number(d.get('score') ?? 0), extra: Number(d.get('seconds') ?? 0), me: d.id === me }))
    .sort((a, b) => b.value - a.value || a.extra - b.extra) // ties: faster first
    .slice(0, 50);
}
