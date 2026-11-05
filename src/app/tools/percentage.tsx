import { useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Chip, Chips, Field, Note, Screen, SectionTitle } from '@/components/ui';
import { gradeFor, GRADING } from '@/data/guides';
import { font, useTheme } from '@/lib/theme';

export default function Percentage() {
  const c = useTheme();
  const [o, setO] = useState('');
  const [t, setT] = useState('1200');
  const [scheme, setScheme] = useState<'ibcc' | 'old'>('ibcc');
  const ob = Number(o), tot = Number(t);
  const ok = ob > 0 && tot > 0 && ob <= tot;
  const pct = ok ? (ob / tot) * 100 : 0;
  const passMark = scheme === 'ibcc' ? 40 : 33;

  return (
    <Screen title="Percentage & Grade" subtitle="Matric / Inter marks to % and grade">
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Field label="Obtained marks" keyboardType="numeric" value={o} onChangeText={setO} placeholder="e.g. 985" /></View>
        <View style={{ flex: 1 }}><Field label="Total marks" keyboardType="numeric" value={t} onChangeText={setT} /></View>
      </View>
      <Chips>
        <Chip label="New IBCC grading" active={scheme === 'ibcc'} onPress={() => setScheme('ibcc')} />
        <Chip label="Old grading" active={scheme === 'old'} onPress={() => setScheme('old')} />
      </Chips>
      <Card style={{ alignItems: 'center', paddingVertical: 20, marginTop: 14 }}>
        <Text style={{ color: c.sub, fontFamily: font.medium }}>Percentage</Text>
        <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 40 }}>{ok ? pct.toFixed(2) : '--'}%</Text>
        {ok && <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 22 }}>Grade {gradeFor(pct, scheme)}</Text>}
        {ok && <Text style={{ color: pct >= passMark ? c.ok : c.danger, fontFamily: font.semi, marginTop: 4 }}>{pct >= passMark ? 'Pass' : 'Below pass mark'} (pass = {passMark}%)</Text>}
        {!!o && !!t && ob > tot && <Text style={{ color: c.danger, fontFamily: font.regular }}>Obtained marks can't be more than total.</Text>}
      </Card>
      <SectionTitle title={scheme === 'ibcc' ? 'New IBCC 10-point grading' : 'Old grading scheme'} />
      <Card>
        {GRADING[scheme].map(([r, g, d], i) => (
          <View key={g} style={{ flexDirection: 'row', paddingVertical: 7, borderBottomWidth: i < GRADING[scheme].length - 1 ? 1 : 0, borderBottomColor: c.border }}>
            <Text style={{ flex: 1, color: c.text, fontFamily: font.regular }}>{r}</Text>
            <Text style={{ width: 50, color: c.primary, fontFamily: font.bold }}>{g}</Text>
            <Text style={{ flex: 1, color: c.sub, fontFamily: font.regular, textAlign: 'right' }}>{d}</Text>
          </View>
        ))}
      </Card>
      <Note text="The new IBCC scheme (pass mark 40%) is being adopted board by board – Matric first, then Inter. A few boards use slightly different letters for the lower bands, so check your board's notification." />
    </Screen>
  );
}
