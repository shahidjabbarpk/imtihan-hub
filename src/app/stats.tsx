import { Text, View } from 'react-native';
import { Bar, Card, Empty, Screen, SectionTitle } from '@/components/ui';
import { countOf, SUBJECTS } from '@/data/bank';
import { liveStreak, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

export default function Stats() {
  const c = useTheme();
  const stats = useApp((s) => s.stats);
  const seen = useApp((s) => s.seen);
  const attempts = useApp((s) => s.attempts);
  const streak = liveStreak(useApp((s) => s.streak));
  const totalDone = Object.values(stats).reduce((a, b) => a + b.done, 0);
  const totalRight = Object.values(stats).reduce((a, b) => a + b.right, 0);
  const mins = Math.round(attempts.reduce((a, b) => a + b.seconds, 0) / 60);

  return (
    <Screen title="My Progress" subtitle="Practice history and accuracy">
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Big label="Answered" v={totalDone} />
        <Big label="Accuracy" v={totalDone ? `${Math.round((totalRight / totalDone) * 100)}%` : '--'} />
        <Big label="Streak" v={`${streak}🔥`} />
        <Big label="Minutes" v={mins} />
      </View>

      <SectionTitle title="By subject" />
      {SUBJECTS.map((s) => {
        const st = stats[s.key];
        const covered = Object.keys(seen).filter((id) => id.startsWith(s.key + '.')).length;
        const total = countOf(s.key);
        return (
          <Card key={s.key}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: c.text, fontFamily: font.semi }}>{s.title}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5 }}>
                {st?.done ? `${Math.round((st.right / st.done) * 100)}% correct` : 'not started'}
              </Text>
            </View>
            <View style={{ marginTop: 8 }}><Bar value={covered / total} color={s.colors[0]} /></View>
            <Text style={{ color: c.faint, fontFamily: font.regular, fontSize: 11.5, marginTop: 4 }}>{covered} of {total} MCQs covered</Text>
          </Card>
        );
      })}

      <SectionTitle title="Recent tests" />
      {attempts.length ? attempts.slice(0, 30).map((a) => (
        <Card key={a.at} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontFamily: font.semi }} numberOfLines={1}>{a.title}</Text>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{new Date(a.at).toLocaleString()} • {Math.round(a.seconds / 60)} min</Text>
          </View>
          <Text style={{ color: a.score / a.total >= 0.6 ? c.ok : c.danger, fontFamily: font.bold, fontSize: 16 }}>{a.score}/{a.total}</Text>
        </Card>
      )) : <Empty icon="chart-box-outline" title="No tests yet" hint="Finish a practice session or mock test and it will show here." />}
    </Screen>
  );
}

function Big({ label, v }: { label: string; v: number | string }) {
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}>
      <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 17 }}>{v}</Text>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 11 }}>{label}</Text>
    </View>
  );
}
