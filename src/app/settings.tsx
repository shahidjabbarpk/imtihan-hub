import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Alert, Platform, Switch, Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Field, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { boardById } from '@/data/boards';
import { testByKey } from '@/data/tests';
import { refreshContent } from '@/lib/content';
import { useL } from '@/lib/i18n';
import { syncPoints } from '@/lib/leaderboard';
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
  const L = useL();
  const [lbName, setLbName] = useState(st.lbName || st.name);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState<string | null>(null);
  const checkNow = async () => {
    setChecking(true);
    const n = await refreshContent();
    setChecking(false);
    setChecked(n ? L(`${n} new MCQs added`, `${n} نئے سوال شامل ہوئے`) : L('You have the latest content', 'آپ کے پاس تازہ ترین مواد ہے'));
  };

  const setReminder = async (on: boolean, hour = st.reminder.hour) => {
    const ok = await setDailyReminder(on, hour, 0);
    useApp.getState().set({ reminder: { on: on && ok, hour, minute: 0 } });
    if (on && !ok && Platform.OS !== 'web') Alert.alert('Notifications are off', 'Allow notifications for Imtihan Hub in your phone settings.');
  };

  const reset = () => {
    const go = () => useApp.getState().set({ stats: {}, tstats: {}, seen: {}, wrong: {}, attempts: [], best: {}, streak: { days: 0, last: null }, dailyDone: null });
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

      <SectionTitle title="Language / زبان" />
      <Chips>
        <Chip label="English" active={st.lang === 'en'} onPress={() => useApp.getState().set({ lang: 'en' })} />
        <Chip label="اردو" active={st.lang === 'ur'} onPress={() => useApp.getState().set({ lang: 'ur' })} />
      </Chips>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12, marginTop: 6 }}>
        {L('Urdu shows menus in Urdu. MCQs that have an Urdu version get an "اردو" button in the quiz.', 'اردو میں مینو اردو میں نظر آئیں گے۔ جن سوالوں کا اردو ترجمہ ہے، کوئز میں "اردو" بٹن آئے گا۔')}
      </Text>

      <SectionTitle title={L('Negative marking in mock tests', 'موک ٹیسٹ میں منفی مارکنگ')} />
      <Chips>
        {([[0, L('Off', 'بند')], [0.25, '−0.25'], [0.33, '−0.33'], [0.5, '−0.5'], [1, '−1']] as const).map(([v, l]) => (
          <Chip key={String(v)} label={l} active={st.negative === v} onPress={() => useApp.getState().set({ negative: v })} />
        ))}
      </Chips>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12, marginTop: 6 }}>
        {L('Marks cut for each wrong answer in timed mock tests (some job and university tests do this). Skipped questions are never cut.',
          'ہر غلط جواب پر کٹنے والے نمبر (کچھ ٹیسٹوں میں ہوتا ہے)۔ چھوڑے گئے سوالوں کے نمبر نہیں کٹتے۔')}
      </Text>

      <SectionTitle title={L('Leaderboard', 'لیڈر بورڈ')} />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, color: c.text, fontFamily: font.semi }}>{L('Show my name and scores', 'میرا نام اور نمبر دکھائیں')}</Text>
          <Switch value={st.lbOn} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff"
            onValueChange={(v) => { useApp.getState().set({ lbOn: v && lbName.trim().length >= 2, lbName: lbName.trim() }); if (v) syncPoints(); }} />
        </View>
        <Field label={L('Display name', 'ظاہری نام')} value={lbName} onChangeText={(v) => setLbName(v.slice(0, 30))} placeholder="e.g. Ali (Lahore)"
          onBlur={() => { useApp.getState().set({ lbName: lbName.trim() }); if (st.lbOn) syncPoints(); }} />
        <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>
          {L('Only this name and your weekly scores are shared. Turn it off any time.', 'صرف یہ نام اور ہفتہ وار نمبر شیئر ہوتے ہیں۔ کبھی بھی بند کر سکتے ہیں۔')}
        </Text>
      </Card>

      <SectionTitle title={L('Content updates', 'مواد کی اپڈیٹس')} />
      <Card>
        <Text style={{ color: c.text, fontFamily: font.semi }}>
          {st.remote ? L(`Online content: ${st.remote.mcqs.length} extra MCQs, ${st.remote.papers.length} past papers`, `آن لائن مواد: ${st.remote.mcqs.length} اضافی سوال، ${st.remote.papers.length} پرانے پرچے`) : L('Online content not downloaded yet', 'آن لائن مواد ابھی ڈاؤن لوڈ نہیں ہوا')}
        </Text>
        <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12, marginTop: 2 }}>
          {L('New MCQs, past papers and pattern changes download by themselves when the app opens.', 'نئے سوال، پرانے پرچے اور پیٹرن کی تبدیلیاں ایپ کھلنے پر خود ڈاؤن لوڈ ہوتی ہیں۔')}
          {st.remoteAt ? `  (${new Date(st.remoteAt).toLocaleDateString()})` : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <Btn label={L('Check now', 'ابھی چیک کریں')} icon="cloud-download-outline" kind="soft" onPress={checkNow} style={{ flex: 1 }} />
          {checking && <ActivityIndicator color={c.primary} />}
        </View>
        {!!checked && <Text style={{ color: c.ok, fontFamily: font.medium, fontSize: 12.5, marginTop: 6 }}>{checked}</Text>}
      </Card>

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
      <Note text={L('Your progress is stored on this phone only. Nothing is shared unless you join the leaderboard (then only your display name and scores).',
        'آپ کی پراگریس صرف اسی فون میں محفوظ ہے۔ لیڈر بورڈ میں شامل ہونے پر صرف ظاہری نام اور نمبر شیئر ہوتے ہیں۔')} />
    </Screen>
  );
}
