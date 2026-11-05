import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Empty, haptic, Icon, T, Tap, useStatusBar } from '@/components/ui';
import { subjectByKey } from '@/data/bank';
import { maybeShowInterstitial, withAd } from '@/lib/ads';
import { exportPaper } from '@/lib/paper';
import { buildSession, type QuizParams } from '@/lib/session';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function confirm(title: string, msg: string, ok: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${msg}`)) ok();
    return;
  }
  Alert.alert(title, msg, [{ text: 'Cancel', style: 'cancel' }, { text: 'Yes', onPress: ok }]);
}

export default function Quiz() {
  useStatusBar('hero');
  const params = useLocalSearchParams() as QuizParams;
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [round, setRound] = useState(0);
  const session = useMemo(() => buildSession(params), [round]); // eslint-disable-line react-hooks/exhaustive-deps
  const { questions: qs, examMode, seconds } = session;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [left, setLeft] = useState(seconds);
  const [palette, setPalette] = useState(false);
  const started = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const bookmarks = useApp((s) => s.bookmarks);

  const q = qs[idx];
  const choice = picked[idx] ?? null;
  const answered = picked.filter((p) => p != null).length;
  const score = picked.filter((p, i) => p === qs[i]?.a).length;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(qs.length ? (examMode ? answered : idx + (choice != null ? 1 : 0)) / qs.length : 0, { duration: 300 });
  }, [idx, choice, answered, qs.length, examMode, progress]);
  const bar = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const finish = () => {
    if (done) return;
    const st = useApp.getState();
    // exam mode records answers only at the end, practice mode records them as you go
    if (examMode) qs.forEach((m, i) => { if (picked[i] != null) st.answer(m.id, m.sub, picked[i] === m.a); });
    const secs = Math.round((Date.now() - started.current) / 1000);
    setElapsed(secs);
    st.finish({ at: Date.now(), title: session.title, kind: session.kind, score, total: qs.length, seconds: secs }, session.key);
    setDone(true);
    haptic('medium');
    setTimeout(maybeShowInterstitial, 1500);
  };

  // timer
  useEffect(() => {
    if (!seconds || done) return;
    if (left <= 0) { finish(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, done, left]); // eslint-disable-line react-hooks/exhaustive-deps

  // Android back: ask before throwing away an unfinished test
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (done || answered === 0) return false;
      confirm('Leave the test?', 'Your answers in this session will be lost.', () => router.back());
      return true;
    });
    return () => sub.remove();
  }, [done, answered]);

  const pick = (i: number) => {
    if (!q) return;
    if (!examMode && choice != null) return;
    const next = [...picked];
    next[idx] = i;
    setPicked(next);
    if (!examMode) {
      haptic(i === q.a ? 'light' : 'medium');
      useApp.getState().answer(q.id, q.sub, i === q.a);
    } else haptic('select');
  };

  const goNext = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else if (examMode) confirm('Submit test?', `You answered ${answered} of ${qs.length}.`, finish);
    else finish();
  };

  const restart = () => withAd(() => {
    setRound((r) => r + 1);
    setIdx(0);
    setPicked([]);
    setDone(false);
    setPalette(false);
    setLeft(seconds);
    started.current = Date.now();
  });

  const close = () => {
    if (done || answered === 0) router.back();
    else confirm('Leave the test?', 'Your answers in this session will be lost.', () => router.back());
  };

  const header = (
    <LinearGradient colors={session.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { paddingTop: insets.top + 8 }]}>
      <View style={s.heroRow}>
        <Tap onPress={close} style={s.round}><Icon name="close" size={22} color="#fff" /></Tap>
        <Text style={s.heroTitle} numberOfLines={1}>{session.title}</Text>
        {!done && !!seconds && <Text style={[s.counter, left < 60 && { color: '#FFE08A' }]}>⏱ {fmt(Math.max(0, left))}</Text>}
        {!done && !!qs.length && <Text style={s.counter}>{idx + 1}/{qs.length}</Text>}
      </View>
      {!done && <View style={s.track}><Animated.View style={[s.fill, bar]} /></View>}
    </LinearGradient>
  );

  if (!qs.length) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        {header}
        <Empty icon="playlist-remove" title="No questions here yet" hint="Save MCQs with the bookmark button, or answer some questions first – your mistakes collect here." />
      </View>
    );
  }

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    const color = pct >= 70 ? c.ok : pct >= 40 ? c.warn : c.danger;
    const wrongN = answered - score;
    const skipped = qs.length - answered;
    // per-subject breakdown for mixed tests
    const bySub = new Map<string, { n: number; r: number }>();
    qs.forEach((m, i) => {
      const b = bySub.get(m.sub) ?? { n: 0, r: 0 };
      b.n++;
      if (picked[i] === m.a) b.r++;
      bySub.set(m.sub, b);
    });
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        {header}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={[s.result, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={{ color: c.sub, fontFamily: font.medium }}>Your score</Text>
            <View style={[s.ring, { borderColor: color }]}>
              <Text style={[s.pct, { color }]}>{pct}%</Text>
              <Text style={{ color: c.sub, fontFamily: font.medium }}>{score} / {qs.length}</Text>
            </View>
            <View style={s.resRow}>
              <Mini label="Correct" v={score} color={c.ok} />
              <Mini label="Wrong" v={Math.max(0, wrongN)} color={c.danger} />
              <Mini label="Skipped" v={skipped} color={c.faint} />
              <Mini label="Time" v={fmt(elapsed)} color={c.primary} />
            </View>
            <Text style={{ color: c.text, fontFamily: font.semi, textAlign: 'center' }}>
              {pct >= 80 ? 'Excellent! 🏆 Keep it up.' : pct >= 60 ? 'Good work 👍 Revise the wrong ones.' : pct >= 40 ? 'Not bad – practise this topic again.' : 'Read the topic once more, then retry 📖'}
            </Text>
          </View>

          {bySub.size > 1 && (
            <View style={[s.result, { backgroundColor: c.card, borderColor: c.border, alignItems: 'stretch', gap: 8, marginTop: 12 }]}>
              <Text style={{ color: c.text, fontFamily: font.bold }}>Subject-wise</Text>
              {[...bySub.entries()].map(([k, b]) => (
                <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: c.text, fontFamily: font.regular }}>{subjectByKey(k)?.title ?? k}</Text>
                  <Text style={{ color: c.sub, fontFamily: font.semi }}>{b.r} / {b.n}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Btn label="Try again" icon="refresh" onPress={restart} color={session.colors[0]} style={{ flex: 1 }} />
            <Btn label="Done" icon="check" kind="soft" onPress={() => router.back()} style={{ flex: 1 }} />
          </View>
          <Btn label="Save as PDF paper" icon="file-pdf-box" kind="soft" style={{ marginTop: 10 }}
            onPress={() => exportPaper(session.title, qs, Math.max(10, Math.round(qs.length * 1.2))).catch(() => {})} />

          <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 16, marginTop: 20, marginBottom: 6 }}>Answer review</Text>
          {qs.map((m, i) => {
            const ok = picked[i] === m.a;
            return (
              <View key={m.id + i} style={[s.review, { backgroundColor: c.card, borderColor: ok ? c.ok : picked[i] == null ? c.border : c.danger }]}>
                <T style={[s.reviewQ, { color: c.text }]} bold>{`${i + 1}. ${m.q}`}</T>
                {!ok && picked[i] != null && <T style={[s.reviewA, { color: c.danger }]}>{`✗ ${m.o[picked[i]!]}`}</T>}
                <T style={[s.reviewA, { color: c.ok }]}>{`✓ ${m.o[m.a]}`}</T>
                {!!m.e && <Text style={[s.expl, { color: c.sub }]}>{m.e}</Text>}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  const saved = !!bookmarks[q!.id];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {header}
      {palette ? (
        <ScrollView contentContainerStyle={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {qs.map((_, i) => (
            <Tap key={i} onPress={() => { setIdx(i); setPalette(false); }}
              style={[s.cell, { backgroundColor: picked[i] != null ? c.primary : c.card, borderColor: i === idx ? c.accent : c.border }]}>
              <Text style={{ color: picked[i] != null ? '#fff' : c.text, fontFamily: font.semi }}>{i + 1}</Text>
            </Tap>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }}>
          <View style={s.qTop}>
            <Text style={[s.qSub, { color: c.sub }]}>{subjectByKey(q!.sub)?.title}</Text>
            <Tap onPress={() => useApp.getState().toggleBookmark(q!.id)} hitSlop={10} accessibilityLabel="Save question">
              <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color={saved ? c.accent : c.faint} />
            </Tap>
          </View>
          <T style={[s.question, { color: c.text }]} bold>{q!.q}</T>
          {q!.o.map((opt, i) => {
            const right = !examMode && choice != null && i === q!.a;
            const wrong = !examMode && choice === i && i !== q!.a;
            const state = examMode ? (choice === i ? 'sel' : 'idle') : right ? 'right' : wrong ? 'wrong' : choice != null ? 'dim' : 'idle';
            const col = state === 'right' ? c.ok : state === 'wrong' ? c.danger : state === 'sel' ? c.primary : c.border;
            return (
              <Tap key={i} onPress={() => pick(i)} haptic={false}
                style={[s.option, { borderColor: col, opacity: state === 'dim' ? 0.55 : 1,
                  backgroundColor: state === 'right' ? c.okSoft : state === 'wrong' ? c.dangerSoft : state === 'sel' ? c.primarySoft : c.card }]}>
                <View style={[s.letter, { backgroundColor: state === 'idle' || state === 'dim' ? c.cardAlt : col }]}>
                  {state === 'right' ? <Icon name="check" size={18} color="#fff" /> : state === 'wrong' ? <Icon name="close" size={18} color="#fff" />
                    : <Text style={{ color: state === 'sel' ? '#fff' : c.text, fontFamily: font.bold }}>{'ABCD'[i]}</Text>}
                </View>
                <T style={[s.optText, { color: c.text }]}>{opt}</T>
              </Tap>
            );
          })}
          {!examMode && choice != null && (
            <View style={[s.explBox, { backgroundColor: choice === q!.a ? c.okSoft : c.dangerSoft }]}>
              <Icon name={choice === q!.a ? 'check-decagram' : 'lightbulb-on-outline'} size={18} color={choice === q!.a ? c.ok : c.danger} />
              <Text style={[s.expl, { color: c.text, flex: 1, marginTop: 0 }]}>
                {choice === q!.a ? 'Correct!' : `Correct answer: ${q!.o[q!.a]}`}{q!.e ? `\n${q!.e}` : ''}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      <View style={[s.footer, { paddingBottom: insets.bottom + 12, backgroundColor: c.card, borderTopColor: c.border }]}>
        {examMode && (
          <Tap onPress={() => setPalette(!palette)} style={[s.small, { backgroundColor: c.cardAlt }]} accessibilityLabel="All questions">
            <Icon name={palette ? 'close' : 'view-grid-outline'} size={20} color={c.text} />
          </Tap>
        )}
        {idx > 0 && (examMode || choice != null) && (
          <Tap onPress={() => setIdx(idx - 1)} style={[s.small, { backgroundColor: c.cardAlt }]} accessibilityLabel="Previous">
            <Icon name="arrow-left" size={20} color={c.text} />
          </Tap>
        )}
        {examMode && (
          <Tap onPress={() => confirm('Submit test?', `You answered ${answered} of ${qs.length}.`, finish)} style={[s.small, { backgroundColor: c.cardAlt, width: 86 }]}>
            <Text style={{ color: c.text, fontFamily: font.semi }}>Submit</Text>
          </Tap>
        )}
        {(examMode || choice != null) && (
          <Tap onPress={goNext} style={[s.next, { backgroundColor: session.colors[0] }]}>
            <Text style={{ color: '#fff', fontFamily: font.semi, fontSize: 15 }}>{idx + 1 < qs.length ? 'Next' : 'Finish'}</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </Tap>
        )}
        {!examMode && choice == null && (
          <Text style={{ flex: 1, textAlign: 'center', color: c.sub, fontFamily: font.regular, fontSize: 12.5 }}>Choose an option to see the answer</Text>
        )}
      </View>
    </View>
  );
}

function Mini({ label, v, color }: { label: string; v: number | string; color: string }) {
  const c = useTheme();
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ color, fontFamily: font.bold, fontSize: 17 }}>{v}</Text>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { flex: 1, color: '#fff', fontFamily: font.bold, fontSize: 17 },
  counter: { color: '#fff', fontFamily: font.semi, fontSize: 14 },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 14, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
  qTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  qSub: { fontFamily: font.medium, fontSize: 12 },
  question: { fontSize: 18, lineHeight: 28, marginBottom: 18 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10 },
  letter: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  optText: { flex: 1, fontSize: 14.5 },
  explBox: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 14, marginTop: 6 },
  expl: { fontFamily: font.regular, fontSize: 13, lineHeight: 20, marginTop: 6 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: StyleSheet.hairlineWidth },
  small: { height: 50, width: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1, flexDirection: 'row', gap: 8, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cell: { width: 48, height: 48, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  result: { alignItems: 'center', gap: 12, padding: 20, borderRadius: 24, borderWidth: 1 },
  ring: { width: 140, height: 140, borderRadius: 70, borderWidth: 10, alignItems: 'center', justifyContent: 'center' },
  pct: { fontFamily: font.bold, fontSize: 34 },
  resRow: { flexDirection: 'row', alignSelf: 'stretch' },
  review: { borderRadius: 14, padding: 12, borderWidth: 1.5, marginTop: 10 },
  reviewQ: { fontSize: 13.5 },
  reviewA: { fontSize: 13, marginTop: 4 },
});
