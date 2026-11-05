import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Switch, Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Field, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { boardById } from '@/data/boards';
import { testByKey } from '@/data/tests';
import { NOTIFY_SUPPORTED, setDailyReminder } from '@/lib/notify';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const HOURS = [7, 16, 18, 20, 21, 22];

export default function Settings() {
  const c = useTheme();
  const st = useApp();
  const [name, setName] = useState(st.name);
  const board = st.boardId ? boardById(st.boardId) : undefined;
  const goal = st.goal ? testByKey(st.goal) : undefined;

  const setReminder = async (on: boolean, hour = st.reminder.hour) => {
    const ok = await setDailyReminder(on, hour, 0);
    useApp.getState().set({ reminder: { on: on && ok, hour, minute: 0 } });
    if (on && !ok && Platform.OS !== 'web') Alert.alert('Notifications are off', 'Allow notifications for Imtihan Hub in your phone settings.');
  };

  const reset = () => {
    const go = () => useApp.getState().set({ stats: {}, seen: {}, wrong: {}, attempts: [], best: {}, streak: { days: 0, last: null }, dailyDone: null });
    if (Platform.OS === 'web') { if (globalThis.confirm?.('Clear all progress?')) go(); return; }
    Alert.alert('Clear all progress?', 'Scores, history, mistakes and streak will be deleted. Saved MCQs stay.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: go }]);
  };

  return (
    <Screen title="Settings">
      <Field label="Your name" value={name} onChangeText={setName} onBlur={() => useApp.getState().set({ name: name.trim() })} placeholder="Name" />
      <SectionTitle title="I am preparing for" />
      <Chips>
        {([['matric', 'Matric'], ['inter', 'Inter / FSc'], ['graduate', 'Jobs / CSS / University']] as const).map(([k, l]) => (
          <Chip key={k} label={l} active={st.level === k} onPress={() => useApp.getState().set({ level: k })} />
        ))}
      </Chips>
      <Row icon="flag-outline" title="Goal test" sub={goal ? goal.name : 'Not set – pick from the Tests tab'} onPress={() => router.push('/(tabs)/tests')} />
      <Row icon="school" title="My board" sub={board ? board.name : 'Not set – pick from the Results tab'} onPress={() => router.push('/(tabs)/boards')} />

      <SectionTitle title="Appearance" />
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, color: c.text, fontFamily: font.semi }}>Dark mode</Text>
        <Switch value={st.theme === 'dark'} onValueChange={(v) => useApp.getState().set({ theme: v ? 'dark' : 'light' })} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
      </Card>

      {NOTIFY_SUPPORTED && (
        <>
          <SectionTitle title="Daily study reminder" />
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, color: c.text, fontFamily: font.semi }}>Remind me every day</Text>
              <Switch value={st.reminder.on} onValueChange={(v) => setReminder(v)} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
            </View>
            {st.reminder.on && (
              <View style={{ marginTop: 10 }}>
                <Chips>{HOURS.map((h) => <Chip key={h} label={`${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`} active={st.reminder.hour === h} onPress={() => setReminder(true, h)} />)}</Chips>
              </View>
            )}
          </Card>
        </>
      )}

      <SectionTitle title="Data" />
      <Btn label="Clear my progress" icon="delete-outline" kind="soft" onPress={reset} />
      <Note text="Everything is stored on this phone only. The app has no account and sends no personal data anywhere." />
    </Screen>
  );
}
