import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Btn, Card, Icon, Note, Screen, SectionTitle, Tap } from '@/components/ui';
import { font, useTheme } from '@/lib/theme';

interface Course { name: string; ch: string; gp: string }

// HEC undergraduate grade points from percentage marks (commonly used scale; universities may differ).
const HEC: [number, number, string][] = [[85, 4.0, 'A'], [80, 3.7, 'A-'], [75, 3.3, 'B+'], [71, 3.0, 'B'], [68, 2.7, 'B-'], [64, 2.3, 'C+'], [61, 2.0, 'C'], [58, 1.7, 'C-'], [54, 1.3, 'D+'], [50, 1.0, 'D'], [0, 0, 'F']];

export default function Cgpa() {
  const c = useTheme();
  const [rows, setRows] = useState<Course[]>([{ name: '', ch: '3', gp: '' }, { name: '', ch: '3', gp: '' }, { name: '', ch: '3', gp: '' }]);
  const [prevG, setPrevG] = useState('');
  const [prevCh, setPrevCh] = useState('');
  const upd = (i: number, p: Partial<Course>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));

  const valid = rows.filter((r) => Number(r.ch) > 0 && r.gp !== '' && Number(r.gp) >= 0 && Number(r.gp) <= 4);
  const ch = valid.reduce((a, r) => a + Number(r.ch), 0);
  const pts = valid.reduce((a, r) => a + Number(r.ch) * Number(r.gp), 0);
  const gpa = ch ? pts / ch : 0;
  const pc = Number(prevCh), pg = Number(prevG);
  const cgpa = pc > 0 && pg >= 0 && pg <= 4 && ch ? (pts + pc * pg) / (ch + pc) : null;

  const inputSt = { borderWidth: 1, borderColor: c.border, backgroundColor: c.card, color: c.text, borderRadius: 12, height: 44, paddingHorizontal: 10, fontFamily: font.regular } as const;
  return (
    <Screen title="GPA / CGPA Calculator" subtitle="4.0 scale (HEC)">
      <SectionTitle title="This semester" />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        <Text style={{ flex: 2, color: c.sub, fontFamily: font.medium, fontSize: 12 }}>Course</Text>
        <Text style={{ flex: 1, color: c.sub, fontFamily: font.medium, fontSize: 12 }}>Credit hrs</Text>
        <Text style={{ flex: 1, color: c.sub, fontFamily: font.medium, fontSize: 12 }}>Grade pt</Text>
        <View style={{ width: 28 }} />
      </View>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <TextInput style={[inputSt, { flex: 2 }]} value={r.name} onChangeText={(v) => upd(i, { name: v })} placeholder={`Course ${i + 1}`} placeholderTextColor={c.faint} />
          <TextInput style={[inputSt, { flex: 1 }]} value={r.ch} onChangeText={(v) => upd(i, { ch: v })} keyboardType="numeric" />
          <TextInput style={[inputSt, { flex: 1 }]} value={r.gp} onChangeText={(v) => upd(i, { gp: v })} keyboardType="numeric" placeholder="3.3" placeholderTextColor={c.faint} />
          <Tap onPress={() => rows.length > 1 && setRows(rows.filter((_, j) => j !== i))} hitSlop={8}><Icon name="close-circle-outline" size={24} color={c.faint} /></Tap>
        </View>
      ))}
      <Btn label="Add course" icon="plus" kind="soft" onPress={() => setRows([...rows, { name: '', ch: '3', gp: '' }])} />

      <SectionTitle title="Previous semesters (optional)" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput style={[inputSt, { flex: 1 }]} value={prevG} onChangeText={setPrevG} keyboardType="numeric" placeholder="Current CGPA" placeholderTextColor={c.faint} />
        <TextInput style={[inputSt, { flex: 1 }]} value={prevCh} onChangeText={setPrevCh} keyboardType="numeric" placeholder="Credit hours done" placeholderTextColor={c.faint} />
      </View>

      <Card style={{ flexDirection: 'row', marginTop: 16, paddingVertical: 18 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: c.sub, fontFamily: font.medium }}>Semester GPA</Text>
          <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 32 }}>{ch ? gpa.toFixed(2) : '--'}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: c.sub, fontFamily: font.medium }}>New CGPA</Text>
          <Text style={{ color: c.ok, fontFamily: font.bold, fontSize: 32 }}>{cgpa != null ? cgpa.toFixed(2) : '--'}</Text>
        </View>
      </Card>

      <SectionTitle title="Marks → grade point (HEC scale)" />
      <Card>
        {HEC.map(([min, gp, g], i) => (
          <View key={g} style={{ flexDirection: 'row', paddingVertical: 5 }}>
            <Text style={{ flex: 1, color: c.text, fontFamily: font.regular }}>{min ? `${min}%${i ? ` – ${HEC[i - 1]![0] - 1}%` : ' +'}` : 'Below 50%'}</Text>
            <Text style={{ width: 44, color: c.primary, fontFamily: font.bold }}>{g}</Text>
            <Text style={{ width: 40, color: c.sub, fontFamily: font.semi, textAlign: 'right' }}>{gp.toFixed(1)}</Text>
          </View>
        ))}
      </Card>
      <Note text="Many universities use this HEC scale, but some have their own. Use the grade points printed on your transcript." />
    </Screen>
  );
}
