import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Card, Note, Row, Screen } from '@/components/ui';
import { CALENDAR } from '@/data/guides';
import { font, useTheme } from '@/lib/theme';

export default function Calendar() {
  const c = useTheme();
  return (
    <Screen title="Yearly Exam Calendar" subtitle="When things usually happen in Pakistan">
      <Note text="These are the usual months. Exact dates are announced by each board and testing body – check the official site or Latest Updates." />
      {CALENDAR.map((m) => (
        <Card key={m.months}>
          <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 15, marginBottom: 6 }}>{m.months}</Text>
          {m.items.map((t) => (
            <View key={t} style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
              <Text style={{ color: c.accent, fontFamily: font.bold }}>•</Text>
              <Text style={{ flex: 1, color: c.text, fontFamily: font.regular, fontSize: 13.5, lineHeight: 20 }}>{t}</Text>
            </View>
          ))}
        </Card>
      ))}
      <Row icon="timer-sand" colors={['#BE123C', '#FB7185']} title="Add your exam date" sub="Countdown on Home + reminders 7 days and 1 day before" onPress={() => router.push('/tools/countdown')} />
    </Screen>
  );
}
