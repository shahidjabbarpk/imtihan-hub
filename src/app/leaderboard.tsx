import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Empty, Field, Note, Screen } from '@/components/ui';
import { GRAND } from '@/data/grand';
import { useL } from '@/lib/i18n';
import { type LbRow, syncPoints, topGrand, topPoints, type Track } from '@/lib/leaderboard';
import { pkWeek, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

type Tab = 'points' | Track;
const MEDAL = ['🥇', '🥈', '🥉'];

/** Joining = choosing a display name; nothing else about the student leaves the phone. */
export function JoinCard({ onJoined }: { onJoined?: () => void }) {
  const c = useTheme();
  const L = useL();
  const [name, setName] = useState(useApp.getState().lbName || useApp.getState().name);
  const ok = name.trim().length >= 2;
  return (
    <Card>
      <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 15 }}>{L('Join the leaderboard', 'لیڈر بورڈ میں شامل ہوں')}</Text>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginBottom: 10 }}>
        {L('Only the name you type below and your scores are shown to other students. You can leave any time in Settings.',
          'صرف نیچے لکھا نام اور آپ کے نمبر دوسرے طلبہ کو نظر آئیں گے۔ آپ سیٹنگز سے کبھی بھی نکل سکتے ہیں۔')}
      </Text>
      <Field label={L('Display name', 'ظاہری نام')} value={name} onChangeText={(v) => setName(v.slice(0, 30))} placeholder="e.g. Ali (Lahore)" />
      <Btn label={L('Join', 'شامل ہوں')} icon="account-check-outline" disabled={!ok}
        onPress={() => { useApp.getState().set({ lbOn: true, lbName: name.trim() }); syncPoints().finally(() => onJoined?.()); }} />
    </Card>
  );
}

export default function Leaderboard() {
  const c = useTheme();
  const L = useL();
  const p = useLocalSearchParams<{ track?: string }>();
  const [tab, setTab] = useState<Tab>((GRAND.some((g) => g.key === p.track) ? p.track : 'points') as Tab);
  const [rows, setRows] = useState<LbRow[] | null>(null);
  const [err, setErr] = useState(false);
  const lbOn = useApp((s) => s.lbOn);
  const week = useApp((s) => s.week);
  const wk = pkWeek();

  const load = useCallback(async () => {
    setRows(null);
    setErr(false);
    try {
      if (lbOn) await syncPoints();
      setRows(tab === 'points' ? await topPoints(wk) : await topGrand(tab, wk));
    } catch {
      setErr(true);
      setRows([]);
    }
  }, [tab, wk, lbOn]);
  useEffect(() => { load(); }, [load]);

  const grand = GRAND.find((g) => g.key === tab);
  return (
    <Screen title={L('Leaderboard', 'لیڈر بورڈ')} subtitle={L(`Week ${wk.slice(6)} • resets every Monday`, `ہفتہ ${wk.slice(6)} • ہر پیر کو نیا`)}>
      <Chips>
        <Chip label={L('Weekly points', 'ہفتہ وار پوائنٹس')} active={tab === 'points'} onPress={() => setTab('points')} />
        {GRAND.map((g) => <Chip key={g.key} label={L(g.title, g.ur)} active={tab === g.key} onPress={() => setTab(g.key)} />)}
      </Chips>
      <View style={{ height: 12 }} />
      {!lbOn && <JoinCard onJoined={load} />}
      {lbOn && tab === 'points' && (
        <Note icon="star-circle-outline" text={L(`You have ${week.id === wk ? week.points : 0} points this week – 1 point for every correct answer in any quiz.`,
          `اس ہفتے آپ کے ${week.id === wk ? week.points : 0} پوائنٹس ہیں – ہر درست جواب پر 1 پوائنٹ۔`)} />
      )}
      {grand && (
        <Btn label={L(`Take this week's ${grand.title}`, `اس ہفتے کا ${grand.ur} دیں`)} icon="play" color={grand.colors[0]} style={{ marginBottom: 12 }}
          onPress={() => router.push('/grand')} />
      )}

      {rows == null ? <ActivityIndicator color={c.primary} style={{ marginTop: 30 }} />
        : err ? <Empty icon="wifi-off" title={L('Could not load', 'لوڈ نہیں ہو سکا')} hint={L('Check your internet and pull down / try again.', 'انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔')} />
        : !rows.length ? <Empty icon="podium" title={L('No scores yet this week', 'اس ہفتے ابھی کوئی اسکور نہیں')} hint={L('Be the first! Solve MCQs or take the grand test.', 'سب سے پہلے آپ! سوال حل کریں یا گرینڈ ٹیسٹ دیں۔')} />
        : rows.map((r, i) => (
          <View key={r.uid} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, marginBottom: 8, borderWidth: r.me ? 2 : 1,
            borderColor: r.me ? c.primary : c.border, backgroundColor: r.me ? c.primarySoft : c.card }}>
            <Text style={{ width: 34, textAlign: 'center', fontFamily: font.bold, fontSize: i < 3 ? 22 : 15, color: c.sub }}>{MEDAL[i] ?? i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.text, fontFamily: font.semi }} numberOfLines={1}>{r.name}{r.me ? L(' (you)', ' (آپ)') : ''}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 11.5 }}>
                {tab === 'points' ? L(`${r.extra} quizzes`, `${r.extra} کوئز`) : `${Math.floor(r.extra / 60)}:${String(r.extra % 60).padStart(2, '0')} min`}
              </Text>
            </View>
            <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 17 }}>{r.value}{tab === 'points' ? '' : `/${GRAND.find((g) => g.key === tab) ? Object.values(GRAND.find((g) => g.key === tab)!.mix).reduce((a, b) => a + b, 0) : ''}`}</Text>
          </View>
        ))}
      {!!rows?.length && <Btn label={L('Refresh', 'تازہ کریں')} icon="refresh" kind="soft" onPress={load} style={{ marginTop: 6 }} />}
    </Screen>
  );
}
