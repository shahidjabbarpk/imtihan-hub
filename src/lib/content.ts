import { installRemote } from '@/data/bank';
import { applyTestOverrides } from '@/data/tests';
import { CONTENT_URL } from './config';
import { type RemoteContent, useApp } from './store';

/** Applies the last downloaded content (called after the store loads, so it also works offline). */
export function applyStoredContent() {
  const r = useApp.getState().remote;
  if (!r) return;
  installRemote(r.mcqs as any, r.ur);
  applyTestOverrides(r.tests);
}

/**
 * Downloads data/content.json: new MCQs, past papers, Urdu translations and test-pattern changes.
 * The file is updated from the admin panel (docs/admin.html) and by the weekly content bot, so the
 * app keeps growing without a new release. Returns how many new MCQs arrived.
 */
export async function refreshContent(): Promise<number> {
  try {
    const r = await fetch(`${CONTENT_URL}?t=${Math.floor(Date.now() / 3_600_000)}`);
    if (!r.ok) return 0;
    const j = (await r.json()) as Partial<RemoteContent>;
    const content: RemoteContent = {
      updatedAt: typeof j.updatedAt === 'string' ? j.updatedAt : new Date().toISOString(),
      mcqs: Array.isArray(j.mcqs) ? j.mcqs.slice(0, 20000) : [],
      papers: Array.isArray(j.papers) ? j.papers.filter((p) => p && typeof p.id === 'string' && typeof p.title === 'string').slice(0, 3000) : [],
      ur: j.ur && typeof j.ur === 'object' ? j.ur : {},
      tests: j.tests && typeof j.tests === 'object' ? j.tests : {},
    };
    const added = installRemote(content.mcqs as any, content.ur);
    applyTestOverrides(content.tests);
    useApp.getState().set({ remote: content, remoteAt: new Date().toISOString() });
    return added;
  } catch {
    return 0; // offline: keep the last copy
  }
}
