import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Btn, Card, IconBadge, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { subjectByKey } from '@/data/bank';
import { GRAND } from '@/data/grand';
import { withAd } from '@/lib/ads';
import { useL } from '@/lib/i18n';
import { pkWeek, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

/** Days left until the Monday reset (Pakistan time). */
function daysLeft() {
  const d = new Date(Date.now() + 5 * 3600_000);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  return 7 - day;
}

export default function Grand() {
  const c = useTheme();
  const L = useL();
  const done = useApp((s) => s.grandDone);
  const best = useApp((s) => s.best);
  const wk = pkWeek();
  const left = daysLeft();

  return (
    <Screen title={L('Weekly Grand Test', 'ہفتہ وار گرینڈ ٹیسٹ')} subtitle={L(`New paper every Monday • ${left} day${left > 1 ? 's' : ''} left`, `ہر پیر نیا پرچہ • ${left} دن باقی`)}>
      <Note icon="trophy-outline" text={L('Everyone in a track gets the same 60-MCQ paper this week. Your first attempt is ranked on the leaderboard; later attempts are practice.',
        'اس ہفتے ہر طالب علم کو ایک جیسا 60 سوالوں کا پرچہ ملتا ہے۔ پہلی کوشش لیڈر بورڈ پر شمار ہوتی ہے، باقی صرف پریکٹس۔')} />
      {GRAND.map((g) => {
        const ranked = done === `${wk}-${g.key}`;
        const n = Object.values(g.mix).reduce((a, b) => a + b, 0);
        return (
          <Card key={g.key}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <IconBadge icon={g.icon as any} colors={g.colors} size={46} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 15 }}>{L(g.title, g.ur)}</Text>
                <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{g.for}</Text>
              </View>
            </View>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginTop: 8 }}>
              {n} MCQs • {g.minutes} min • {Object.entries(g.mix).map(([k, v]) => `${subjectByKey(k)?.title} ${v}`).join(', ')}
              {best[`grand-${g.key}`] != null ? ` • Best ${best[`grand-${g.key}`]}%` : ''}
            </Text>
            <Btn label={ranked ? L('Practise again (not ranked)', 'دوبارہ پریکٹس (رینک نہیں)') : L('Start ranked attempt', 'رینکڈ ٹیسٹ شروع کریں')}
              icon="timer-outline" color={g.colors[0]} kind={ranked ? 'soft' : 'solid'} style={{ marginTop: 12 }}
              onPress={() => withAd(() => router.push({ pathname: '/quiz', params: { mode: 'grand', track: g.key } }))} />
          </Card>
        );
      })}
      <SectionTitle title={L('Rankings', 'درجہ بندی')} />
      <Row icon="podium-gold" colors={['#B45309', '#F59E0B']} title={L('Leaderboard', 'لیڈر بورڈ')} sub={L('Weekly points and grand test toppers', 'ہفتہ وار پوائنٹس اور گرینڈ ٹیسٹ ٹاپرز')} onPress={() => router.push('/leaderboard')} />
    </Screen>
  );
}
