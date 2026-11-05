import { useMemo } from 'react';
import { subjectByKey } from '@/data/bank';
import { useApp } from './store';

/** Topics with enough answers to judge, worst first. */
export function useTopicReport(min = 5) {
  const tstats = useApp((s) => s.tstats);
  return useMemo(() => Object.entries(tstats)
    .filter(([, v]) => v.done >= min)
    .map(([k, v]) => {
      const [sub, topic] = k.split('.') as [string, string];
      const s = subjectByKey(sub);
      const t = s?.topics.find((x) => x.id === topic);
      return { key: k, sub, topic, subject: s, title: t?.title ?? topic, done: v.done, pct: Math.round((v.right / v.done) * 100) };
    })
    .filter((x) => x.subject)
    .sort((a, b) => a.pct - b.pct || b.done - a.done), [tstats, min]);
}
