import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Chip, Chips, Icon, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { HEC_RECOGNISED, UNI_FIELDS, UNIVERSITIES } from '@/data/universities';
import { openOfficial } from '@/lib/links';
import { font, useTheme } from '@/lib/theme';

const ICON: Record<string, string> = { Engineering: 'cog-outline', Medical: 'stethoscope', General: 'town-hall', Business: 'briefcase-outline', Agriculture: 'sprout-outline', Distance: 'laptop' };

export default function Universities() {
  const c = useTheme();
  const [field, setField] = useState<string>('All');
  const [q, setQ] = useState('');
  const list = UNIVERSITIES.filter((u) => (field === 'All' || u.field === field) && (!q || `${u.name} ${u.city}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <Screen title="Universities & Admissions" subtitle={`${UNIVERSITIES.length} universities • official admission pages`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, marginBottom: 12 }}>
        <Icon name="magnify" size={20} color={c.faint} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search university or city" placeholderTextColor={c.faint} style={{ flex: 1, height: 44, color: c.text, fontFamily: font.regular }} />
      </View>
      <Chips>{['All', ...UNI_FIELDS].map((f) => <Chip key={f} label={f} active={field === f} onPress={() => setField(f)} />)}</Chips>
      <SectionTitle title={`${list.length} results`} />
      {list.map((u) => (
        <Row key={u.name} icon={(ICON[u.field] ?? 'town-hall') as any} title={u.name} sub={`${u.city} • ${u.type} • Admission: ${u.test}`} onPress={() => openOfficial(u.url)} />
      ))}
      <Note text="Before paying any fee, check that the university and its programme are recognised by HEC (and PMDC / PEC for medical and engineering)." />
      <Row icon="shield-check-outline" colors={['#047857', '#34D399']} title="HEC recognised universities list" onPress={() => openOfficial(HEC_RECOGNISED)} />
    </Screen>
  );
}
