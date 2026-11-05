import { useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Empty, Field, Icon, Note, Screen, SectionTitle, Tap } from '@/components/ui';
import { cancelCountdown, NOTIFY_SUPPORTED, scheduleCountdown } from '@/lib/notify';
import { pkToday, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const QUICK = ['Matric Exam', 'Inter Exam', 'MDCAT', 'ECAT', 'NUST NET', 'CSS', 'PPSC Test', 'NTS Test'];

export default function Countdown() {
  const c = useTheme();
  const list = useApp((s) => s.countdowns);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const today = pkToday();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && date >= today;

  const add = () => {
    if (!name.trim() || !valid) return;
    const cd = { id: String(Date.now()), name: name.trim(), date };
    useApp.getState().set({ countdowns: [...list, cd] });
    scheduleCountdown(cd).catch(() => {});
    setName('');
    setDate('');
  };
  const remove = (id: string) => {
    useApp.getState().set({ countdowns: list.filter((x) => x.id !== id) });
    cancelCountdown(id).catch(() => {});
  };
  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Screen title="Exam Countdown" subtitle="Days left + reminders">
      <Card>
        <Field label="Exam name" value={name} onChangeText={setName} placeholder="e.g. MDCAT" />
        <Chips>{QUICK.map((q) => <Chip key={q} label={q} active={name === q} onPress={() => setName(q)} />)}</Chips>
        <View style={{ height: 12 }} />
        <Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder={today} autoCapitalize="none" maxLength={10} />
        {!!date && !valid && <Text style={{ color: c.danger, fontFamily: font.regular, fontSize: 12, marginTop: -6, marginBottom: 8 }}>Enter a future date like {today}</Text>}
        <Btn label="Add countdown" icon="plus" onPress={add} disabled={!name.trim() || !valid} />
      </Card>
      {NOTIFY_SUPPORTED && <Note text="You'll get a reminder 7 days before, 1 day before and on the morning of the exam." />}
      <SectionTitle title="My exams" />
      {sorted.length ? sorted.map((x) => {
        const d = Math.round((Date.parse(x.date) - Date.parse(today)) / 86_400_000);
        return (
          <Card key={x.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: d < 0 ? 0.5 : 1 }}>
            <View style={{ width: 64, alignItems: 'center' }}>
              <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 26 }}>{d < 0 ? '✓' : d}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 11 }}>{d < 0 ? 'done' : d === 1 ? 'day left' : 'days left'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.text, fontFamily: font.semi, fontSize: 15 }}>{x.name}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5 }}>{x.date}</Text>
            </View>
            <Tap onPress={() => remove(x.id)} hitSlop={10} accessibilityLabel="Delete"><Icon name="trash-can-outline" size={22} color={c.faint} /></Tap>
          </Card>
        );
      }) : <Empty icon="timer-sand" title="No exams added" hint="Add your exam date to see a countdown on the Home screen." />}
    </Screen>
  );
}
