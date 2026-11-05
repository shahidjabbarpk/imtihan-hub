import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text } from 'react-native';
import { Card, Empty, Row, Screen } from '@/components/ui';
import { openOfficial } from '@/lib/links';
import { refreshNews } from '@/lib/news';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

export default function News() {
  const c = useTheme();
  const news = useApp((s) => s.news);
  const [busy, setBusy] = useState(false);
  const reload = () => { setBusy(true); refreshNews().finally(() => setBusy(false)); };
  return (
    <Screen title="Latest Updates" subtitle="Results, roll no slips, admissions, tests" scroll={false}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={busy} onRefresh={reload} />}>
        {news.length ? news.map((n) => (
          <Card key={n.id} onPress={n.url ? () => openOfficial(n.url!) : undefined}>
            <Text style={{ color: c.primary, fontFamily: font.medium, fontSize: 11.5 }}>{n.date}{n.tag ? ` • ${n.tag}` : ''}</Text>
            <Text style={{ color: c.text, fontFamily: font.semi, fontSize: 14.5, marginTop: 2 }}>{n.title}</Text>
            {!!n.body && <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 13, marginTop: 4, lineHeight: 19 }}>{n.body}</Text>}
            {!!n.url && <Text style={{ color: c.primary, fontFamily: font.semi, fontSize: 12.5, marginTop: 6 }}>Open official page →</Text>}
          </Card>
        )) : (
          <>
            <Empty icon="bullhorn-outline" title="No updates right now" hint="Pull down to refresh. Meanwhile, check your board directly or see the yearly calendar." />
            <Row icon="school" title="Boards: results & roll no slips" onPress={() => router.push('/(tabs)/boards')} />
            <Row icon="calendar-month-outline" title="Yearly exam calendar" onPress={() => router.push('/calendar')} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
