import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Btn, Card, Grid, Note, Row, Screen, SectionTitle, Tile } from '@/components/ui';
import { BOARD_ACTIONS, boardById, BOARDS, searchUrl } from '@/data/boards';
import { openOfficial } from '@/lib/links';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const COLORS: [string, string][] = [['#0369A1', '#38BDF8'], ['#7C3AED', '#C084FC'], ['#047857', '#34D399'], ['#9D174D', '#F472B6'], ['#B45309', '#F59E0B'], ['#1D4ED8', '#60A5FA'], ['#BE123C', '#FB7185'], ['#374151', '#9CA3AF']];

export default function BoardScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const b = boardById(id) ?? BOARDS[0]!;
  const mine = useApp((s) => s.boardId === b.id);
  const year = new Date().getFullYear();

  return (
    <Screen title={b.name} subtitle={b.full}>
      <Note text="Every button opens the board's official website, where the board publishes results, roll number slips and date sheets. Use “Latest news” if a page has moved." />
      <Grid>
        {BOARD_ACTIONS.map((a, i) => (
          <Tile key={a.key} icon={a.icon as any} colors={COLORS[i % COLORS.length]!} title={a.label} ur={a.ur} onPress={() => openOfficial(b.site)} />
        ))}
        <Tile icon="web" colors={['#0B1F5C', '#1D4ED8']} title="Official website" ur="ویب سائٹ" onPress={() => openOfficial(b.site, false)} />
      </Grid>

      <SectionTitle title="Latest news (search)" />
      {BOARD_ACTIONS.slice(0, 4).map((a) => (
        <Row key={a.key} icon="magnify" title={`${b.name} ${a.label} ${year}`} sub="Google search for the newest announcement"
          onPress={() => openOfficial(searchUrl(`${b.name} ${a.q} ${year}`))} />
      ))}

      <Card style={{ marginTop: 8 }}>
        <Text style={{ color: c.text, fontFamily: font.semi }}>{mine ? 'This is your board' : 'Is this your board?'}</Text>
        <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginTop: 2 }}>It will show on your Home screen for one-tap access.</Text>
        <View style={{ marginTop: 10 }}>
          <Btn label={mine ? 'Remove from Home' : 'Set as my board'} icon={mine ? 'star-off-outline' : 'star-outline'} kind={mine ? 'soft' : 'solid'}
            onPress={() => useApp.getState().set({ boardId: mine ? null : b.id })} />
        </View>
      </Card>
    </Screen>
  );
}
