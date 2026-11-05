import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Grid, Icon, Row, SectionTitle, Tap, Tile, useStatusBar, useTabBarSpace } from '@/components/ui';
import { ALL } from '@/data/bank';
import { boardById } from '@/data/boards';
import { testByKey } from '@/data/tests';
import { withAd } from '@/lib/ads';
import { openOfficial } from '@/lib/links';
import { liveStreak, pkToday, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

function greeting() {
  const h = new Date(Date.now() + 5 * 3600_000).getUTCHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function Home() {
  useStatusBar('hero');
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const space = useTabBarSpace();
  const name = useApp((s) => s.name);
  const goal = useApp((s) => s.goal);
  const boardId = useApp((s) => s.boardId);
  const streakObj = useApp((s) => s.streak);
  const dailyDone = useApp((s) => s.dailyDone);
  const seenCount = useApp((s) => Object.keys(s.seen).length);
  const wrongCount = useApp((s) => Object.keys(s.wrong).length);
  const savedCount = useApp((s) => Object.keys(s.bookmarks).length);
  const countdowns = useApp((s) => s.countdowns);
  const news = useApp((s) => s.news);
  const streak = liveStreak(streakObj);
  const doneToday = dailyDone === pkToday();
  const goalTest = goal ? testByKey(goal) : undefined;
  const board = boardId ? boardById(boardId) : undefined;

  const next = useMemo(() => {
    const today = pkToday();
    return [...countdowns].filter((x) => x.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [countdowns]);
  const daysTo = next ? Math.round((Date.parse(next.date) - Date.parse(pkToday())) / 86_400_000) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingBottom: space }}>
      <LinearGradient colors={[c.heroA, c.heroB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { paddingTop: insets.top + 14 }]}>
        <View style={s.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.hello}>{greeting()}{name ? `, ${name}` : ''} 👋</Text>
            <Text style={s.title}>Imtihan Hub</Text>
          </View>
          <View style={s.streak}>
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={s.streakNum}>{streak}</Text>
            <Text style={s.streakLbl}>day streak</Text>
          </View>
        </View>
        <View style={s.statsRow}>
          <Stat n={ALL.length} label="MCQs in app" />
          <Stat n={seenCount} label="You solved" />
          <Stat n={wrongCount} label="To revise" />
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16 }}>
        <Tap onPress={() => withAd(() => router.push({ pathname: '/quiz', params: { mode: 'daily' } }))} style={[s.daily, { backgroundColor: c.card, borderColor: c.border }]}>
          <LinearGradient colors={['#B45309', '#F59E0B']} style={s.dailyIcon}><Icon name="calendar-star" size={26} color="#fff" /></LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={[s.dailyTitle, { color: c.text }]}>Daily Quiz</Text>
            <Text style={[s.dailySub, { color: c.sub }]}>{doneToday ? 'Done for today ✓ – play again or try a mock test' : '10 MCQs from every subject • keeps your streak alive'}</Text>
          </View>
          <Icon name="play-circle" size={34} color={c.accent} />
        </Tap>

        {next && (
          <Card onPress={() => router.push('/tools/countdown')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Icon name="timer-sand" size={26} color={c.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[s.cdName, { color: c.text }]} numberOfLines={1}>{next.name}</Text>
              <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{next.date}</Text>
            </View>
            <Text style={[s.cdDays, { color: c.primary }]}>{daysTo === 0 ? 'Today' : `${daysTo} days`}</Text>
          </Card>
        )}

        {goalTest && (
          <Row icon={goalTest.icon as any} colors={goalTest.colors} title={`My goal: ${goalTest.name}`} sub="Pattern, syllabus, tips & full mock test"
            onPress={() => router.push(`/test/${goalTest.key}`)} />
        )}
        {board && (
          <Row icon="school" title={board.name} sub="Result • Roll No Slip • Date Sheet • Past Papers" onPress={() => router.push(`/board/${board.id}`)} />
        )}

        <SectionTitle title="Prepare" />
        <Grid>
          <Tile icon="numeric-10-box-outline" colors={['#047857', '#34D399']} title="Matric (9th–10th)" ur="میٹرک" onPress={() => router.push({ pathname: '/(tabs)/study', params: { level: 'matric' } })} />
          <Tile icon="school-outline" colors={['#1D4ED8', '#60A5FA']} title="Inter (FSc / ICS)" ur="انٹر" onPress={() => router.push({ pathname: '/(tabs)/study', params: { level: 'inter' } })} />
          <Tile icon="stethoscope" colors={['#BE123C', '#FB7185']} title="MDCAT" ur="میڈیکل" onPress={() => router.push('/test/mdcat')} />
          <Tile icon="cog-outline" colors={['#4338CA', '#818CF8']} title="ECAT / NET" ur="انجینئرنگ" onPress={() => router.push('/(tabs)/tests')} />
          <Tile icon="briefcase-outline" colors={['#B45309', '#F59E0B']} title="Job Tests" ur="نوکری ٹیسٹ" onPress={() => router.push({ pathname: '/(tabs)/tests', params: { kind: 'job' } })} />
          <Tile icon="bank-outline" colors={['#065F46', '#10B981']} title="CSS / PMS" ur="سی ایس ایس" onPress={() => router.push('/test/css')} />
        </Grid>

        <SectionTitle title="Results & Admissions" />
        <Grid>
          <Tile icon="trophy-outline" colors={['#0369A1', '#38BDF8']} title="Board Results" ur="رزلٹ" onPress={() => router.push('/(tabs)/boards')} />
          <Tile icon="card-account-details-outline" colors={['#7C3AED', '#C084FC']} title="Roll No Slip" ur="رول نمبر سلپ" onPress={() => router.push('/(tabs)/boards')} />
          <Tile icon="file-document-multiple-outline" colors={['#9D174D', '#F472B6']} title="Past Papers" ur="پرانے پرچے" onPress={() => router.push('/(tabs)/boards')} />
          <Tile icon="calculator-variant-outline" colors={['#A16207', '#FACC15']} title="Merit Calculator" ur="میرٹ" onPress={() => router.push('/tools/aggregate')} />
          <Tile icon="town-hall" colors={['#374151', '#9CA3AF']} title="Universities" ur="داخلے" onPress={() => router.push('/universities')} />
          <Tile icon="hand-coin-outline" colors={['#047857', '#34D399']} title="Scholarships" ur="وظائف" onPress={() => router.push('/scholarships')} />
        </Grid>

        <SectionTitle title="Revise" />
        <Row icon="alert-circle-outline" colors={['#DC2626', '#F87171']} title="My Mistakes" sub={wrongCount ? `${wrongCount} MCQs you got wrong – practise them again` : 'Wrong answers collect here automatically'}
          onPress={() => wrongCount && withAd(() => router.push({ pathname: '/quiz', params: { mode: 'mistakes', count: '20' } }))} />
        <Row icon="bookmark-outline" colors={['#BE123C', '#FB7185']} title="Saved MCQs" sub={savedCount ? `${savedCount} saved` : 'Tap the bookmark on any question to save it'}
          onPress={() => savedCount && withAd(() => router.push({ pathname: '/quiz', params: { mode: 'bookmarks', count: '30' } }))} />

        <SectionTitle title="Latest updates" action={news.length ? 'All' : undefined} onAction={() => router.push('/news')} />
        {news.length ? news.slice(0, 4).map((n) => (
          <Row key={n.id} icon="bullhorn-outline" title={n.title} sub={`${n.date}${n.tag ? ' • ' + n.tag : ''}`}
            onPress={() => (n.url ? openOfficial(n.url) : router.push('/news'))} />
        )) : (
          <Row icon="calendar-month-outline" title="Yearly exam calendar" sub="When results, roll no slips, MDCAT, ECAT and admissions usually come" onPress={() => router.push('/calendar')} />
        )}
      </View>
    </ScrollView>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statN}>{n.toLocaleString()}</Text>
      <Text style={s.statL}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 18, paddingBottom: 56, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  hello: { color: 'rgba(255,255,255,0.85)', fontFamily: font.regular, fontSize: 13 },
  title: { color: '#fff', fontFamily: font.bold, fontSize: 26 },
  streak: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  streakNum: { color: '#fff', fontFamily: font.bold, fontSize: 18, marginTop: -2 },
  streakLbl: { color: 'rgba(255,255,255,0.8)', fontFamily: font.regular, fontSize: 9.5 },
  statsRow: { flexDirection: 'row', marginTop: 18, gap: 10 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  statN: { color: '#fff', fontFamily: font.bold, fontSize: 17 },
  statL: { color: 'rgba(255,255,255,0.8)', fontFamily: font.regular, fontSize: 10.5 },
  daily: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, borderWidth: 1, marginTop: -36, marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
  dailyIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dailyTitle: { fontFamily: font.bold, fontSize: 16 },
  dailySub: { fontFamily: font.regular, fontSize: 12 },
  cdName: { fontFamily: font.semi, fontSize: 14.5 },
  cdDays: { fontFamily: font.bold, fontSize: 16 },
});
