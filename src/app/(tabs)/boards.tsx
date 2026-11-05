import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { TabHeader } from '@/components/TabHeader';
import { Chip, Chips, Icon, Row, SectionTitle, useTabBarSpace } from '@/components/ui';
import { BOARDS, IBCC, REGIONS } from '@/data/boards';
import { openOfficial } from '@/lib/links';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

export default function Boards() {
  const c = useTheme();
  const space = useTabBarSpace();
  const mine = useApp((s) => s.boardId);
  const [region, setRegion] = useState<string>('All');
  const [q, setQ] = useState('');
  const list = BOARDS.filter((b) => (region === 'All' || b.region === region)
    && (!q || `${b.name} ${b.full}`.toLowerCase().includes(q.toLowerCase())));
  const my = BOARDS.find((b) => b.id === mine);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="Results & Boards" ur="بورڈز" sub="Result • Roll No Slip • Date Sheet • Past Papers • Gazette">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 14, paddingHorizontal: 12, marginTop: 12 }}>
          <Icon name="magnify" size={20} color="#fff" />
          <TextInput value={q} onChangeText={setQ} placeholder="Search your board (e.g. Lahore)" placeholderTextColor="rgba(255,255,255,0.7)"
            style={{ flex: 1, height: 44, color: '#fff', fontFamily: font.regular }} />
        </View>
      </TabHeader>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: space }} keyboardShouldPersistTaps="handled">
        {my && !q && (
          <>
            <SectionTitle title="My board" />
            <Row icon="star" colors={['#B45309', '#F59E0B']} title={my.name} sub={my.full} onPress={() => router.push(`/board/${my.id}`)} />
          </>
        )}
        <Chips>{['All', ...REGIONS].map((r) => <Chip key={r} label={r} active={region === r} onPress={() => setRegion(r)} />)}</Chips>
        <SectionTitle title={`${list.length} boards`} />
        {list.map((b) => <Row key={b.id} icon="school" title={b.name} sub={`${b.region} • ${b.levels.map((l) => (l === 'matric' ? 'Matric' : 'Inter')).join(' & ')}`} onPress={() => router.push(`/board/${b.id}`)} />)}
        <SectionTitle title="Also useful" />
        <Row icon="certificate-outline" colors={['#7C3AED', '#C084FC']} title={IBCC.label} sub="O/A level equivalence, attestation, new grading system" onPress={() => openOfficial(IBCC.url)} />
        <Row icon="clipboard-search-outline" colors={['#0369A1', '#38BDF8']} title="How to check result & roll no slip" onPress={() => router.push('/guide/result')} />
        <Row icon="percent-outline" colors={['#A16207', '#FACC15']} title="Percentage & grade calculator" onPress={() => router.push('/tools/percentage')} />
      </ScrollView>
    </View>
  );
}
