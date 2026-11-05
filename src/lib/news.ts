import { NEWS_URL } from './config';
import { type NewsItem, useApp } from './store';

/**
 * Fetches the live notice feed ({ items: NewsItem[] }) - result dates, roll number slips out,
 * admissions open. Silently keeps the last copy if offline.
 */
export async function refreshNews(): Promise<void> {
  try {
    const r = await fetch(`${NEWS_URL}?t=${Math.floor(Date.now() / 600_000)}`);
    if (!r.ok) return;
    const j = (await r.json()) as { items?: NewsItem[] };
    if (!Array.isArray(j.items)) return;
    const items = j.items.filter((i) => i && typeof i.title === 'string' && typeof i.id === 'string').slice(0, 100);
    useApp.getState().set({ news: items, newsAt: new Date().toISOString() });
  } catch {
    /* offline */
  }
}
