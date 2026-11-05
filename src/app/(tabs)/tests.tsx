import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TabHeader } from '@/components/TabHeader';
import { Chip, Chips, Row, SectionTitle, useTabBarSpace } from '@/components/ui';
import { type Test, TESTS } from '@/data/tests';
import { useApp } from '@/lib/store';
import { useTheme } from '@/lib/theme';

export default function Tests() {
  const c = useTheme();
  const space = useTabBarSpace();
  const p = useLocalSearchParams<{ kind?: string }>();
  const [kind, setKind] = useState<Test['kind']>(p.kind === 'job' ? 'job' : 'entry');
  useEffect(() => { if (p.kind === 'job' || p.kind === 'entry') setKind(p.kind); }, [p.kind]);
  const best = useApp((s) => s.best);

  const list = TESTS.filter((t) => t.kind === kind);
  const groups = [...new Set(list.map((t) => t.group))];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="Tests" ur="ٹیسٹ" sub="Pattern, syllabus, tips and timed mock tests" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: space }}>
        <Chips>
          <Chip label="Admission / Entry Tests" active={kind === 'entry'} onPress={() => setKind('entry')} />
          <Chip label="Job & Competitive" active={kind === 'job'} onPress={() => setKind('job')} />
        </Chips>
        {groups.map((g) => (
          <View key={g}>
            <SectionTitle title={g} />
            {list.filter((t) => t.group === g).map((t) => (
              <Row key={t.key} icon={t.icon as any} colors={t.colors} title={t.name} sub={t.full + (best[`mock-${t.key}`] != null ? ` • Best ${best[`mock-${t.key}`]}%` : '')}
                onPress={() => router.push(`/test/${t.key}`)} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
