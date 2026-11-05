import { useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Note, Screen, SectionTitle } from '@/components/ui';
import { SCHOLARSHIPS } from '@/data/scholarships';
import { openOfficial } from '@/lib/links';
import { font, useTheme } from '@/lib/theme';

export default function Scholarships() {
  const c = useTheme();
  const [scope, setScope] = useState<'All' | 'Pakistan' | 'Abroad'>('All');
  const list = SCHOLARSHIPS.filter((s) => scope === 'All' || s.scope === scope);
  return (
    <Screen title="Scholarships" subtitle="Pakistan & abroad • official pages">
      <Chips>{(['All', 'Pakistan', 'Abroad'] as const).map((s) => <Chip key={s} label={s} active={scope === s} onPress={() => setScope(s)} />)}</Chips>
      <SectionTitle title={`${list.length} scholarships`} />
      {list.map((s) => (
        <Card key={s.name}>
          <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 15 }}>{s.name}</Text>
          <Text style={{ color: c.primary, fontFamily: font.medium, fontSize: 12, marginTop: 1 }}>{s.by} • {s.level}</Text>
          <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 13, lineHeight: 19, marginTop: 6 }}>{s.about}</Text>
          <View style={{ marginTop: 10 }}><Btn label="Official page" icon="open-in-new" kind="soft" onPress={() => openOfficial(s.url)} /></View>
        </Card>
      ))}
      <Note tone="warn" icon="alert-outline" text="Scholarships never ask for a fee to apply. Ignore WhatsApp / SMS messages asking for money for a scholarship." />
    </Screen>
  );
}
