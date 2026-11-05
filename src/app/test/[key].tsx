import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { buildFromMix, subjectByKey } from '@/data/bank';
import { testByKey, TESTS } from '@/data/tests';
import { withAd, withRewarded } from '@/lib/ads';
import { openOfficial } from '@/lib/links';
import { exportPaper } from '@/lib/paper';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

function Bullets({ items }: { items: string[] }) {
  const c = useTheme();
  return (
    <Card>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: i < items.length - 1 ? 8 : 0 }}>
          <Text style={{ color: c.primary, fontFamily: font.bold }}>•</Text>
          <Text style={{ flex: 1, color: c.text, fontFamily: font.regular, fontSize: 13.5, lineHeight: 20 }}>{t}</Text>
        </View>
      ))}
    </Card>
  );
}

export default function TestScreen() {
  const c = useTheme();
  const { key } = useLocalSearchParams<{ key: string }>();
  const t = testByKey(key) ?? TESTS[0]!;
  const best = useApp((s) => s.best[`mock-${t.key}`]);
  const nQ = Object.values(t.mix).reduce((a, b) => a + b, 0);
  const isGoal = useApp((s) => s.goal === t.key);
  const negative = useApp((s) => s.negative);

  return (
    <Screen title={t.name} subtitle={t.full} colors={t.colors}>
      <Text style={{ color: c.text, fontFamily: font.regular, fontSize: 14, lineHeight: 21, marginBottom: 12 }}>{t.about}</Text>

      <Card>
        <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 15 }}>Mock test</Text>
        <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginTop: 2 }}>
          {nQ} MCQs in the same subject mix • {t.minutes} minutes • new questions every time{best != null ? ` • Best: ${best}%` : ''}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {Object.entries(t.mix).map(([k, n]) => (
            <Text key={k} style={{ backgroundColor: c.cardAlt, color: c.sub, fontFamily: font.medium, fontSize: 11.5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
              {subjectByKey(k)?.title} {n}
            </Text>
          ))}
        </View>
        <Text style={{ color: c.sub, fontFamily: font.medium, fontSize: 12, marginTop: 10, marginBottom: 6 }}>Negative marking (marks cut per wrong answer)</Text>
        <Chips>{[0, 0.25, 0.33, 0.5, 1].map((v) => <Chip key={v} label={v ? `−${v}` : 'Off'} active={negative === v} onPress={() => useApp.getState().set({ negative: v })} />)}</Chips>
        <Btn label="Start mock test" icon="timer-outline" color={t.colors[0]} style={{ marginTop: 12 }}
          onPress={() => withAd(() => router.push({ pathname: '/quiz', params: { mode: 'mock', test: t.key } }))} />
        {t.paper && (
          <Btn label={`Full-length paper (${Object.values(t.paper.mix).reduce((a, b) => a + b, 0)} MCQs, ${t.paper.minutes} min)`} icon="file-document-outline" kind="soft" style={{ marginTop: 10 }}
            onPress={() => withRewarded('full-length paper', () => router.push({ pathname: '/quiz', params: { mode: 'mock', test: t.key, full: '1' } }))} />
        )}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Btn label="PDF paper" icon="file-pdf-box" kind="soft" style={{ flex: 1 }}
            onPress={() => withRewarded('PDF paper', () => { exportPaper(`${t.name} Practice Paper`, buildFromMix(t.mix), t.minutes).catch(() => {}); })} />
          <Btn label={isGoal ? 'My goal ✓' : 'Set as goal'} icon="flag-outline" kind="soft" style={{ flex: 1 }}
            onPress={() => useApp.getState().set({ goal: isGoal ? null : t.key })} />
        </View>
      </Card>

      <SectionTitle title="Paper pattern" />
      <Card>
        {t.pattern.map(([a, b], i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, paddingVertical: 7, borderBottomWidth: i < t.pattern.length - 1 ? 1 : 0, borderBottomColor: c.border }}>
            <Text style={{ flex: 1.2, color: c.text, fontFamily: font.semi, fontSize: 13 }}>{a}</Text>
            <Text style={{ flex: 1, color: c.sub, fontFamily: font.regular, fontSize: 13, textAlign: 'right' }}>{b}</Text>
          </View>
        ))}
      </Card>
      <Bullets items={t.facts} />
      <Note tone="warn" icon="alert-outline" text="Patterns, dates and merit formulas are the latest publicly reported ones. Bodies change them – always confirm on the official website before the test." />

      <SectionTitle title="Syllabus" />
      <Bullets items={t.syllabus} />
      <SectionTitle title="Preparation tips" />
      <Bullets items={t.tips} />

      <SectionTitle title="Practise by subject" />
      {Object.keys(t.mix).map((k) => {
        const s = subjectByKey(k);
        return s ? <Row key={k} icon={s.icon as any} colors={s.colors} title={s.title} ur={s.ur} onPress={() => router.push({ pathname: '/subject/[key]', params: { key: k } })} /> : null;
      })}

      <SectionTitle title="Official links" />
      {t.links.map((l) => <Row key={l.url} icon="open-in-new" colors={t.colors} title={l.label} sub="Registration, roll no slip, result, notices" onPress={() => openOfficial(l.url)} />)}
      {['mdcat', 'ecat', 'net', 'fast', 'giki'].includes(t.key) && (
        <Row icon="calculator-variant-outline" colors={['#A16207', '#FACC15']} title="Calculate your aggregate" onPress={() => router.push({ pathname: '/tools/aggregate', params: { preset: t.key } })} />
      )}
    </Screen>
  );
}
