import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Bar, Btn, Card, Chip, Chips, Row, Screen, SectionTitle } from '@/components/ui';
import { mcqsOf, subjectByKey, topicCount } from '@/data/bank';
import type { Level } from '@/data/types';
import { withAd } from '@/lib/ads';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const COUNTS = [10, 20, 30, 50];
const LEVEL_LABEL: Record<Level, string> = { matric: 'Matric', inter: 'Inter', test: 'Tests' };

export default function SubjectScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ key: string; level?: string }>();
  const sub = subjectByKey(p.key) ?? subjectByKey('bio')!;
  const level = (p.level || undefined) as Level | undefined;
  const seen = useApp((s) => s.seen);
  const stats = useApp((s) => s.stats[sub.key]);
  const [count, setCount] = useState(20);
  const [exam, setExam] = useState(false);

  const topics = sub.topics.filter((t) => !level || t.level.includes(level));
  const start = (topic?: string) => withAd(() => router.push({
    pathname: '/quiz',
    params: { mode: 'practice', sub: sub.key, topic: topic ?? '', level: level ?? '', count: String(count), exam: exam ? '1' : '', minutes: exam ? String(Math.round(count * 1)) : '' },
  }));
  const acc = stats?.done ? Math.round((stats.right / stats.done) * 100) : null;

  return (
    <Screen title={sub.title} subtitle={`${mcqsOf(sub.key, undefined, level).length} MCQs${level ? ' • ' + LEVEL_LABEL[level] : ''}`} colors={sub.colors}>
      <Card>
        <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 15 }}>Quick practice</Text>
        <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginBottom: 10 }}>
          {acc != null ? `Your accuracy: ${acc}% from ${stats!.done} answers` : 'New questions come first, then the ones you have already seen.'}
        </Text>
        <Chips>{COUNTS.map((n) => <Chip key={n} label={`${n} MCQs`} active={count === n} onPress={() => setCount(n)} />)}</Chips>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontFamily: font.semi }}>Exam mode</Text>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>Timed, answers shown only at the end</Text>
          </View>
          <Switch value={exam} onValueChange={setExam} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
        </View>
        <Btn label="Start practice" icon="play" onPress={() => start()} color={sub.colors[0]} style={{ marginTop: 12 }} />
      </Card>

      <SectionTitle title="Topics" />
      {topics.map((t) => {
        const ids = mcqsOf(sub.key, t.id);
        const done = ids.filter((m) => seen[m.id]).length;
        return (
          <Row key={t.id} icon="format-list-checks" colors={sub.colors} title={t.title}
            sub={`${topicCount(sub.key, t.id)} MCQs • ${t.level.map((l) => LEVEL_LABEL[l]).join(', ')}`}
            onPress={() => start(t.id)}
            right={<View style={{ width: 46, gap: 4, alignItems: 'flex-end' }}>
              <Text style={{ color: c.sub, fontFamily: font.semi, fontSize: 11.5 }}>{done}/{ids.length}</Text>
              <View style={{ width: 46 }}><Bar value={ids.length ? done / ids.length : 0} color={sub.colors[0]} /></View>
            </View>} />
        );
      })}
    </Screen>
  );
}
