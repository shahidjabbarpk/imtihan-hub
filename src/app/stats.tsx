import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Bar, Btn, Card, Empty, Note, Screen, SectionTitle } from '@/components/ui';
import { countOf, SUBJECTS } from '@/data/bank';
import { withAd } from '@/lib/ads';
import { useL } from '@/lib/i18n';
import { useTopicReport } from '@/lib/report';
import { liveStreak, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

export default function Stats() {
  const c = useTheme();
  const L = useL();
  const stats = useApp((s) => s.stats);
  const seen = useApp((s) => s.seen);
  const attempts = useApp((s) => s.attempts);
  const streak = liveStreak(useApp((s) => s.streak));
  const totalDone = Object.values(stats).reduce((a, b) => a + b.done, 0);
  const totalRight = Object.values(stats).reduce((a, b) => a + b.right, 0);
  const mins = Math.round(attempts.reduce((a, b) => a + b.seconds, 0) / 60);
  const report = useTopicReport();
  const weak = report.filter((x) => x.pct < 60).slice(0, 6);
  const strong = [...report].filter((x) => x.pct >= 80).sort((a, b) => b.pct - a.pct).slice(0, 4);
  const trend = attempts.slice(0, 12).reverse();

  const practise = (sub: string, topic: string) =>
    withAd(() => router.push({ pathname: '/quiz', params: { mode: 'practice', sub, topic, count: '15' } }));

  return (
    <Screen title={L('My Progress', 'میری کارکردگی')} subtitle={L('Strengths, weak areas and history', 'مضبوط اور کمزور حصے، ریکارڈ')}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Big label={L('Answered', 'حل شدہ')} v={totalDone} />
        <Big label={L('Accuracy', 'درستگی')} v={totalDone ? `${Math.round((totalRight / totalDone) * 100)}%` : '--'} />
        <Big label={L('Streak', 'تسلسل')} v={`${streak}🔥`} />
        <Big label={L('Minutes', 'منٹ')} v={mins} />
      </View>

      <SectionTitle title={L('Weak areas – practise these', 'کمزور حصے – ان کی پریکٹس کریں')} />
      {weak.length ? weak.map((w) => (
        <Card key={w.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontFamily: font.semi }} numberOfLines={1}>{w.title}</Text>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{w.subject!.title} • {w.pct}% {L('correct of', 'درست، کل')} {w.done}</Text>
            <View style={{ marginTop: 6 }}><Bar value={w.pct / 100} color={c.danger} /></View>
          </View>
          <Btn label={L('Practise', 'پریکٹس')} icon="play" style={{ paddingHorizontal: 14 }} onPress={() => practise(w.sub, w.topic)} />
        </Card>
      )) : (
        <Note text={L('Answer at least 5 MCQs in a topic and your weak topics will show here.', 'کسی ٹاپک کے کم از کم 5 سوال حل کریں، پھر کمزور ٹاپک یہاں نظر آئیں گے۔')} />
      )}

      {strong.length > 0 && (
        <>
          <SectionTitle title={L('Strong areas', 'مضبوط حصے')} />
          {strong.map((w) => (
            <Card key={w.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, color: c.text, fontFamily: font.semi }} numberOfLines={1}>{w.title} <Text style={{ color: c.sub, fontFamily: font.regular }}>• {w.subject!.title}</Text></Text>
              <Text style={{ color: c.ok, fontFamily: font.bold }}>{w.pct}%</Text>
            </Card>
          ))}
        </>
      )}

      {trend.length > 1 && (
        <>
          <SectionTitle title={L('Last tests', 'آخری ٹیسٹ')} />
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 6 }}>
              {trend.map((a) => {
                const pct = a.total ? a.score / a.total : 0;
                return (
                  <View key={a.at} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <Text style={{ color: c.sub, fontSize: 9.5, fontFamily: font.regular }}>{Math.round(pct * 100)}</Text>
                    <View style={{ width: '70%', height: `${Math.max(4, pct * 85)}%`, borderRadius: 5, backgroundColor: pct >= 0.6 ? c.ok : pct >= 0.4 ? c.warn : c.danger }} />
                  </View>
                );
              })}
            </View>
            <Text style={{ color: c.faint, fontFamily: font.regular, fontSize: 11, marginTop: 6, textAlign: 'center' }}>{L('Score % of your last tests (oldest → newest)', 'آخری ٹیسٹوں کا فیصد (پرانا سے نیا)')}</Text>
          </Card>
        </>
      )}

      <SectionTitle title={L('By subject', 'مضمون وار')} />
      {SUBJECTS.map((s) => {
        const st = stats[s.key];
        const covered = Object.keys(seen).filter((id) => id.startsWith(s.key + '.')).length;
        const total = countOf(s.key);
        return (
          <Card key={s.key}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: c.text, fontFamily: font.semi }}>{s.title}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5 }}>
                {st?.done ? `${Math.round((st.right / st.done) * 100)}% ${L('correct', 'درست')}` : L('not started', 'شروع نہیں کیا')}
              </Text>
            </View>
            <View style={{ marginTop: 8 }}><Bar value={covered / total} color={s.colors[0]} /></View>
            <Text style={{ color: c.faint, fontFamily: font.regular, fontSize: 11.5, marginTop: 4 }}>{covered} / {total} {L('MCQs covered', 'سوال مکمل')}</Text>
          </Card>
        );
      })}

      <SectionTitle title={L('Recent tests', 'حالیہ ٹیسٹ')} />
      {attempts.length ? attempts.slice(0, 30).map((a) => (
        <Card key={a.at} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontFamily: font.semi }} numberOfLines={1}>{a.title}</Text>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{new Date(a.at).toLocaleString()} • {Math.round(a.seconds / 60)} min</Text>
          </View>
          <Text style={{ color: a.score / a.total >= 0.6 ? c.ok : c.danger, fontFamily: font.bold, fontSize: 16 }}>{a.score}/{a.total}</Text>
        </Card>
      )) : <Empty icon="chart-box-outline" title={L('No tests yet', 'ابھی کوئی ٹیسٹ نہیں')} hint={L('Finish a practice session or mock test and it will show here.', 'کوئی پریکٹس یا موک ٹیسٹ مکمل کریں، یہاں نظر آئے گا۔')} />}
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
