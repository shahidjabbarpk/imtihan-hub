import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Card, Screen, SectionTitle } from '@/components/ui';
import { guideById, GUIDES } from '@/data/guides';
import { font, useTheme } from '@/lib/theme';

export default function GuideScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = guideById(id) ?? GUIDES[0]!;
  return (
    <Screen title={g.title} subtitle={g.ur} colors={g.colors}>
      {g.sections.map((sec) => (
        <View key={sec.h}>
          <SectionTitle title={sec.h} />
          <Card>
            {sec.items.map((t, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8, paddingVertical: 6, borderBottomWidth: i < sec.items.length - 1 ? 1 : 0, borderBottomColor: c.border }}>
                <Text style={{ color: g.colors[0], fontFamily: font.bold }}>•</Text>
                <Text selectable style={{ flex: 1, color: c.text, fontFamily: font.regular, fontSize: 14, lineHeight: 21 }}>{t}</Text>
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
