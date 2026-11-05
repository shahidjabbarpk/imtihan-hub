import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { type ComponentProps, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName, TAB_BAR_H, Tap } from '@/components/ui';
import { font, useTheme } from '@/lib/theme';

type BarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS: { name: string; icon: IconName; active: IconName; label: string }[] = [
  { name: 'index', icon: 'home-variant-outline', active: 'home-variant', label: 'Home' },
  { name: 'study', icon: 'book-open-page-variant-outline', active: 'book-open-page-variant', label: 'Study' },
  { name: 'tests', icon: 'clipboard-text-outline', active: 'clipboard-text', label: 'Tests' },
  { name: 'boards', icon: 'school-outline', active: 'school', label: 'Results' },
  { name: 'more', icon: 'view-grid-outline', active: 'view-grid', label: 'More' },
];

function TabBar({ state, navigation }: BarProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const tabW = w / TABS.length;
  const idx = TABS.findIndex((t) => t.name === state.routes[state.index]?.name);
  useEffect(() => { if (idx >= 0) x.value = withTiming(idx * tabW, { duration: 200 }); }, [idx, tabW, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View pointerEvents="box-none" style={[styles.float, { bottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, { borderColor: c.glassBorder, shadowColor: c.shadow }]}>
        {Platform.OS === 'ios' && <BlurView intensity={60} tint={c.dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Platform.OS === 'ios' ? c.tabBar : c.card }]} />
        <View style={styles.row} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
          {w > 0 && idx >= 0 && (
            <Animated.View style={[styles.pillSlot, { width: tabW }, pill]}>
              <View style={[styles.pill, { backgroundColor: c.primarySoft }]} />
            </Animated.View>
          )}
          {TABS.map((t, i) => {
            const on = i === idx;
            return (
              <Tap key={t.name} style={styles.tab} onPress={() => !on && navigation.navigate(t.name)} accessibilityLabel={t.label}>
                <Icon name={on ? t.active : t.icon} size={23} color={on ? c.primary : c.faint} />
                <Text style={[styles.label, { color: on ? c.primary : c.faint, fontFamily: on ? font.semi : font.regular }]}>{t.label}</Text>
              </Tap>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, animation: 'shift' }}>
      {TABS.map((t) => <Tabs.Screen key={t.name} name={t.name} />)}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  float: { position: 'absolute', left: 14, right: 14 },
  bar: { height: TAB_BAR_H, borderRadius: 26, borderWidth: 1, overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 6, shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  row: { flexDirection: 'row' },
  pillSlot: { position: 'absolute', top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  pill: { width: 58, height: 48, borderRadius: 18 },
  tab: { flex: 1, alignItems: 'center', gap: 1, paddingVertical: 6 },
  label: { fontSize: 10.5 },
});
