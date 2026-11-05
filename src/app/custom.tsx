import { router } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Screen, SectionTitle, Tap, IconBadge } from '@/components/ui';
import { countOf, SUBJECTS } from '@/data/bank';
import { withAd } from '@/lib/ads';
import { font, useTheme } from '@/lib/theme';

const COUNTS = [20, 50, 100, 180];
const TIMES = [0, 15, 30, 60, 120];

export default function Custom() {
  const c = useTheme();
  const [subs, setSubs] = useState<string[]>(['bio', 'chem', 'phy']);
  const [count, setCount] = useState(50);
  const [minutes, setMinutes] = useState(30);
  const [exam, setExam] = useState(true);
  const toggle = (k: string) => setSubs((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]));
  const pool = subs.reduce((n, k) => n + countOf(k), 0);

  return (
    <Screen title="Custom Test" subtitle="Build your own paper">
      <SectionTitle title="Subjects" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SUBJECTS.map((s) => {
          const on = subs.includes(s.key);
          return (
            <Tap key={s.key} onPress={() => toggle(s.key)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, paddingRight: 12, borderRadius: 14, borderWidth: 1.5, borderColor: on ? s.colors[0] : c.border, backgroundColor: on ? s.colors[0] + '14' : c.card }}>
              <IconBadge icon={s.icon as any} colors={s.colors} size={30} />
              <Text style={{ color: c.text, fontFamily: on ? font.semi : font.regular, fontSize: 13 }}>{s.title}</Text>
            </Tap>
          );
        })}
      </View>
      <SectionTitle title="Number of MCQs" />
      <Chips>{COUNTS.map((n) => <Chip key={n} label={String(n)} active={count === n} onPress={() => setCount(n)} />)}</Chips>
      <SectionTitle title="Time limit" />
      <Chips>{TIMES.map((m) => <Chip key={m} label={m ? `${m} min` : 'No limit'} active={minutes === m} onPress={() => setMinutes(m)} />)}</Chips>
      <Card style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text, fontFamily: font.semi }}>Exam mode</Text>
          <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>Answers revealed only after you submit</Text>
        </View>
        <Switch value={exam} onValueChange={setExam} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
      </Card>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginBottom: 10 }}>
        {subs.length ? `${pool} MCQs available in the chosen subjects${pool < count ? ` – the test will have ${pool}` : ''}.` : 'Choose at least one subject.'}
      </Text>
      <Btn label="Start test" icon="play" disabled={!subs.length}
        onPress={() => withAd(() => router.push({ pathname: '/quiz', params: { mode: 'custom', subs: subs.join(','), count: String(count), minutes: String(minutes), exam: exam ? '1' : '' } }))} />
    </Screen>
  );
}
