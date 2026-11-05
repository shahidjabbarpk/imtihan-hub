import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { TabHeader } from '@/components/TabHeader';
import { Grid, Row, SectionTitle, Tile, useTabBarSpace } from '@/components/ui';
import { GUIDES } from '@/data/guides';
import { PRIVACY_URL } from '@/lib/config';
import { openOfficial, shareApp } from '@/lib/links';
import { font, useTheme } from '@/lib/theme';

export default function More() {
  const c = useTheme();
  const space = useTabBarSpace();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="More" ur="مزید" sub="Calculators, tools, guides and settings" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: space }}>
        <SectionTitle title="Tools" />
        <Grid>
          <Tile icon="calculator-variant-outline" colors={['#A16207', '#FACC15']} title="Merit / Aggregate" ur="میرٹ کیلکولیٹر" onPress={() => router.push('/tools/aggregate')} />
          <Tile icon="percent-outline" colors={['#0369A1', '#38BDF8']} title="Percentage & Grade" ur="فیصد" onPress={() => router.push('/tools/percentage')} />
          <Tile icon="school-outline" colors={['#7C3AED', '#C084FC']} title="CGPA Calculator" ur="سی جی پی اے" onPress={() => router.push('/tools/cgpa')} />
          <Tile icon="timer-outline" colors={['#047857', '#34D399']} title="Study Timer" ur="ٹائمر" onPress={() => router.push('/tools/timer')} />
          <Tile icon="timer-sand" colors={['#BE123C', '#FB7185']} title="Exam Countdown" ur="الٹی گنتی" onPress={() => router.push('/tools/countdown')} />
          <Tile icon="tune-variant" colors={['#4338CA', '#818CF8']} title="Custom Test" ur="اپنا ٹیسٹ" onPress={() => router.push('/custom')} />
        </Grid>

        <SectionTitle title="Admissions & Funding" />
        <Row icon="town-hall" colors={['#374151', '#9CA3AF']} title="Universities & Admissions" ur="یونیورسٹیاں" onPress={() => router.push('/universities')} />
        <Row icon="hand-coin-outline" colors={['#047857', '#34D399']} title="Scholarships (Pakistan & Abroad)" ur="وظائف" onPress={() => router.push('/scholarships')} />
        <Row icon="calendar-month-outline" colors={['#0369A1', '#38BDF8']} title="Yearly Exam Calendar" ur="امتحانی کیلنڈر" onPress={() => router.push('/calendar')} />
        <Row icon="bullhorn-outline" colors={['#B45309', '#F59E0B']} title="Latest Updates" ur="تازہ خبریں" onPress={() => router.push('/news')} />

        <SectionTitle title="Guides" />
        {GUIDES.map((g) => <Row key={g.id} icon={g.icon as any} colors={g.colors} title={g.title} ur={g.ur} onPress={() => router.push(`/guide/${g.id}`)} />)}

        <SectionTitle title="You" />
        <Row icon="chart-box-outline" colors={['#1D4ED8', '#60A5FA']} title="My Progress" sub="Accuracy by subject, history, best scores" onPress={() => router.push('/stats')} />
        <Row icon="cog-outline" colors={['#374151', '#9CA3AF']} title="Settings" sub="Name, class, board, dark mode, daily reminder" onPress={() => router.push('/settings')} />
        <Row icon="share-variant-outline" colors={['#047857', '#34D399']} title="Share with friends" sub="WhatsApp, Facebook, any app" onPress={() => shareApp()} />
        <Row icon="shield-lock-outline" colors={['#374151', '#9CA3AF']} title="Privacy Policy" onPress={() => openOfficial(PRIVACY_URL, false)} />
        <Text style={{ color: c.faint, fontFamily: font.regular, fontSize: 11.5, textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
          Imtihan Hub is an independent study app. It is not affiliated with any board, commission, university or government body.
          Results, roll number slips and notices always open the official website.
        </Text>
      </ScrollView>
    </View>
  );
}
