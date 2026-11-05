import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TabHeader } from '@/components/TabHeader';
import { Bar, Chip, Chips, Row, SectionTitle, useTabBarSpace } from '@/components/ui';
import { mcqsOf, SUBJECTS } from '@/data/bank';
import { TEXTBOOKS } from '@/data/boards';
import { GUIDES } from '@/data/guides';
import type { Level } from '@/data/types';
import { openOfficial } from '@/lib/links';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const LEVELS: { key: Level | 'all'; label: string }[] = [
  { key: 'matric', label: 'Matric' },
  { key: 'inter', label: 'Inter / FSc' },
  { key: 'test', label: 'Entry & Job Tests' },
  { key: 'all', label: 'All' },
];

export default function Study() {
  const c = useTheme();
  const space = useTabBarSpace();
  const params = useLocalSearchParams<{ level?: string }>();
  const saved = useApp((s) => s.level);
  const [level, setLevel] = useState<Level | 'all'>((params.level as Level) ?? (saved === 'graduate' ? 'test' : saved) ?? 'all');
  useEffect(() => { if (params.level) setLevel(params.level as Level); }, [params.level]);
  const seen = useApp((s) => s.seen);

  const subjects = SUBJECTS.map((s) => {
    const pool = level === 'all' ? mcqsOf(s.key) : mcqsOf(s.key, undefined, level);
    return { s, total: pool.length, done: pool.filter((m) => seen[m.id]).length };
  }).filter((x) => x.total > 0);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="Study" ur="تیاری" sub="Subject-wise & topic-wise MCQs with explanations" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: space }}>
        <Chips>{LEVELS.map((l) => <Chip key={l.key} label={l.label} active={level === l.key} onPress={() => setLevel(l.key)} />)}</Chips>

        <SectionTitle title="Subjects" />
        {subjects.map(({ s, total, done }) => (
          <Row key={s.key} icon={s.icon as any} colors={s.colors} title={s.title} ur={s.ur}
            sub={`${total} MCQs • ${done} solved`}
            onPress={() => router.push({ pathname: '/subject/[key]', params: { key: s.key, level: level === 'all' ? '' : level } })}
            right={<View style={{ width: 54, alignItems: 'flex-end', gap: 4 }}>
              <Text style={{ color: c.sub, fontFamily: font.semi, fontSize: 12 }}>{Math.round((done / total) * 100)}%</Text>
              <View style={{ width: 54 }}><Bar value={done / total} color={s.colors[0]} /></View>
            </View>} />
        ))}

        <SectionTitle title="Practice your way" />
        <Row icon="tune-variant" colors={['#4338CA', '#818CF8']} title="Custom Test" sub="Pick subjects, number of MCQs and time" onPress={() => router.push('/custom')} />

        <SectionTitle title="Notes & formula sheets" />
        {GUIDES.filter((g) => ['physics', 'chemistry', 'maths', 'biology'].includes(g.id)).map((g) => (
          <Row key={g.id} icon={g.icon as any} colors={g.colors} title={g.title} ur={g.ur} onPress={() => router.push(`/guide/${g.id}`)} />
        ))}

        <SectionTitle title="Official textbooks (free PDF)" />
        {TEXTBOOKS.map((t) => <Row key={t.url} icon="book-education-outline" title={t.label} sub="Opens the official website" onPress={() => openOfficial(t.url)} />)}
      </ScrollView>
    </View>
  );
}
