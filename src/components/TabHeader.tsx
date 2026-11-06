import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';
import { useStatusBar } from './ui';

/** Gradient header for the tab screens (no back button). */
export function TabHeader({ title, ur, sub, children }: { title: string; ur?: string; sub?: string; children?: ReactNode }) {
  useStatusBar('hero');
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const swap = useApp((st) => st.lang === 'ur') && !!ur;
  return (
    <LinearGradient colors={[c.heroA, c.heroB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, { paddingTop: insets.top + 12 }]}>
      <View style={s.row}>
        <Text style={swap ? s.urBig : s.title}>{swap ? ur : title}</Text>
        {!!ur && <Text style={swap ? s.small : s.ur}>{swap ? title : ur}</Text>}
      </View>
      {!!sub && <Text style={s.sub}>{sub}</Text>}
      {children}
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 18, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#fff', fontFamily: font.bold, fontSize: 24 },
  ur: { color: 'rgba(255,255,255,0.85)', fontFamily: font.urdu, fontSize: 15, lineHeight: 38, paddingTop: 4 },
  urBig: { color: '#fff', fontFamily: font.urduBold, fontSize: 22, lineHeight: 54, paddingTop: 6 },
  small: { color: 'rgba(255,255,255,0.85)', fontFamily: font.semi, fontSize: 15 },
  sub: { color: 'rgba(255,255,255,0.8)', fontFamily: font.regular, fontSize: 12.5, marginTop: 2 },
});
