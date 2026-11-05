import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Card, Chip, Chips, Field, Note, Screen, SectionTitle } from '@/components/ui';
import { font, useTheme } from '@/lib/theme';

// Weights as publicly reported for recent sessions (matric / inter / test). Universities change
// them, so every preset is editable and the screen says to confirm with the prospectus.
const PRESETS: { key: string; label: string; w: [number, number, number]; test: [string, number] }[] = [
  { key: 'mdcat', label: 'MDCAT (MBBS/BDS)', w: [10, 40, 50], test: ['MDCAT marks', 180] },
  { key: 'net', label: 'NUST (NET)', w: [10, 15, 75], test: ['NET marks', 200] },
  { key: 'ecat', label: 'UET (ECAT)', w: [17, 50, 33], test: ['ECAT marks', 400] },
  { key: 'fast', label: 'FAST NU', w: [10, 40, 50], test: ['Test marks', 100] },
  { key: 'giki', label: 'GIKI', w: [5, 10, 85], test: ['Test marks', 100] },
  { key: 'custom', label: 'Custom', w: [10, 40, 50], test: ['Test marks', 100] },
];

const num = (s: string) => {
  const n = Number(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function Aggregate() {
  const c = useTheme();
  const p = useLocalSearchParams<{ preset?: string }>();
  const [key, setKey] = useState(PRESETS.some((x) => x.key === p.preset) ? p.preset! : 'mdcat');
  const preset = PRESETS.find((x) => x.key === key)!;
  const [w, setW] = useState<string[]>(preset.w.map(String));
  const [m, setM] = useState({ mo: '', mt: '1200', fo: '', ft: '1200', to: '', tt: String(preset.test[1]) });

  const choose = (k: string) => {
    const pr = PRESETS.find((x) => x.key === k)!;
    setKey(k);
    setW(pr.w.map(String));
    setM((x) => ({ ...x, tt: String(pr.test[1]) }));
  };

  const pct = (o: string, t: string) => (num(t) > 0 ? Math.min(100, (num(o) / num(t)) * 100) : 0);
  const parts = [pct(m.mo, m.mt), pct(m.fo, m.ft), pct(m.to, m.tt)];
  const weights = w.map(num);
  const wSum = weights.reduce((a, b) => a + b, 0);
  const agg = parts.reduce((a, v, i) => a + (v * weights[i]!) / 100, 0);
  const ready = num(m.mo) > 0 && num(m.fo) > 0 && num(m.to) > 0;

  return (
    <Screen title="Merit / Aggregate Calculator" subtitle="Matric + Inter + entry test">
      <Chips>{PRESETS.map((x) => <Chip key={x.key} label={x.label} active={key === x.key} onPress={() => choose(x.key)} />)}</Chips>

      <SectionTitle title="Your marks" />
      <Row2>
        <Field label="Matric obtained" keyboardType="numeric" value={m.mo} onChangeText={(v) => setM({ ...m, mo: v })} placeholder="e.g. 1050" />
        <Field label="Matric total" keyboardType="numeric" value={m.mt} onChangeText={(v) => setM({ ...m, mt: v })} />
      </Row2>
      <Row2>
        <Field label="Inter / FSc obtained" keyboardType="numeric" value={m.fo} onChangeText={(v) => setM({ ...m, fo: v })} placeholder="Part-I ×2 if Part-II not out" />
        <Field label="Inter total" keyboardType="numeric" value={m.ft} onChangeText={(v) => setM({ ...m, ft: v })} />
      </Row2>
      <Row2>
        <Field label={`${preset.test[0]} obtained`} keyboardType="numeric" value={m.to} onChangeText={(v) => setM({ ...m, to: v })} />
        <Field label="Test total" keyboardType="numeric" value={m.tt} onChangeText={(v) => setM({ ...m, tt: v })} />
      </Row2>

      <SectionTitle title="Weightage (%)" />
      <Row3>
        <Field label="Matric" keyboardType="numeric" value={w[0]} onChangeText={(v) => setW([v, w[1]!, w[2]!])} />
        <Field label="Inter" keyboardType="numeric" value={w[1]} onChangeText={(v) => setW([w[0]!, v, w[2]!])} />
        <Field label="Test" keyboardType="numeric" value={w[2]} onChangeText={(v) => setW([w[0]!, w[1]!, v])} />
      </Row3>
      {wSum !== 100 && <Note tone="warn" text={`Weights add up to ${wSum}% – they should add up to 100%.`} />}

      <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Text style={{ color: c.sub, fontFamily: font.medium }}>Your aggregate</Text>
        <Text style={{ color: c.primary, fontFamily: font.bold, fontSize: 40 }}>{ready ? agg.toFixed(3) : '--'}%</Text>
        {ready && (
          <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, textAlign: 'center' }}>
            Matric {parts[0]!.toFixed(1)}% × {weights[0]}  +  Inter {parts[1]!.toFixed(1)}% × {weights[1]}  +  Test {parts[2]!.toFixed(1)}% × {weights[2]}
          </Text>
        )}
      </Card>
      <Note tone="warn" icon="alert-outline" text="Weightages are the latest publicly reported ones and can change every year (and by province for MBBS). Confirm with the university's admission policy or prospectus. Some universities also add hafiz-e-Quran or other marks." />
    </Screen>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 10 }}>{(Array.isArray(children) ? children : [children]).map((ch, i) => <View key={i} style={{ flex: 1 }}>{ch}</View>)}</View>;
}
const Row3 = Row2;
