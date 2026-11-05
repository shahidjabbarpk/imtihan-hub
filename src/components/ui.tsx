import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { type ReactNode, useCallback } from 'react';
import { Pressable, type PressableProps, ScrollView, type StyleProp, StyleSheet, Text, TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomBanner } from '@/lib/ads';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const APressable = Animated.createAnimatedComponent(Pressable);

/** Haptics throw synchronously where unsupported (web, some devices) - never let that block a tap. */
export function haptic(kind: 'select' | 'light' | 'medium' = 'select') {
  try {
    const p = kind === 'select' ? Haptics.selectionAsync()
      : Haptics.impactAsync(kind === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    p.catch(() => {});
  } catch {
    /* unsupported */
  }
}

/** Pressable with a short, subtle press-down (no spring, nothing bounces). */
export function Tap({ style, children, haptic: withHaptic = true, scaleTo = 0.97, onPress, ...rest }:
  Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; children?: ReactNode; haptic?: boolean; scaleTo?: number }) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <APressable
      {...rest}
      onPressIn={() => { s.value = withTiming(scaleTo, { duration: 80 }); }}
      onPressOut={() => { s.value = withTiming(1, { duration: 120 }); }}
      onPress={(e) => {
        if (withHaptic) haptic();
        onPress?.(e);
      }}
      style={[style, anim]}
    >
      {children}
    </APressable>
  );
}

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
export const Icon = MaterialCommunityIcons;

export function useStatusBar(kind: 'hero' | 'plain') {
  const c = useTheme();
  useFocusEffect(useCallback(() => { setStatusBarStyle(kind === 'hero' || c.dark ? 'light' : 'dark'); }, [kind, c.dark]));
}

export const TAB_BAR_H = 64;
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_H + Math.max(insets.bottom, 12) + 16;
}

const isUrdu = (s: string) => /[؀-ۿ]/.test(s);
/** Style patch that switches a text to the Nastaliq font when it is Urdu. */
export function ur(text: string | undefined, bold = false, size?: number) {
  if (!text || !isUrdu(text)) return null;
  return { fontFamily: bold ? font.urduBold : font.urdu, lineHeight: Math.round((size ?? 15) * 2), writingDirection: 'rtl' as const };
}
const useUrduUi = () => useApp((st) => st.lang === 'ur');
/** Text that switches to the Nastaliq font (and right alignment) when it is Urdu. */
export function T({ children, style, bold, numberOfLines }: { children: string; style?: any; bold?: boolean; numberOfLines?: number }) {
  const ur = isUrdu(children);
  return (
    <Text numberOfLines={numberOfLines}
      style={[{ fontFamily: ur ? (bold ? font.urduBold : font.urdu) : bold ? font.semi : font.regular }, ur && { lineHeight: 34, writingDirection: 'rtl' }, style]}>
      {children}
    </Text>
  );
}

/** Gradient header with back button for stack screens; content scrolls under it. */
export function Screen({ title, subtitle, colors, children, right, scroll = true, banner = true, padded = true }:
  { title: string; subtitle?: string; colors?: [string, string]; children: ReactNode; right?: ReactNode; scroll?: boolean; banner?: boolean; padded?: boolean }) {
  useStatusBar('hero');
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const g = colors ?? [c.heroA, c.heroB];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={styles.heroRow}>
          <Tap onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.back} accessibilityLabel="Back">
            <Icon name="arrow-left" size={22} color="#fff" />
          </Tap>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, ur(title, true, 18)]} numberOfLines={1}>{title}</Text>
            {!!subtitle && <Text style={[styles.heroSub, ur(subtitle, false, 12)]} numberOfLines={1}>{subtitle}</Text>}
          </View>
          {right}
        </View>
      </LinearGradient>
      {scroll ? (
        <ScrollView contentContainerStyle={[padded && { padding: 16 }, { paddingBottom: 40 }]} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {banner && <View style={{ paddingBottom: insets.bottom }}><BottomBanner /></View>}
    </View>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const c = useTheme();
  const st = [styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }, style];
  return onPress ? <Tap onPress={onPress} style={st}>{children}</Tap> : <View style={st}>{children}</View>;
}

/** Icon + title + subtitle + chevron row, the workhorse of every list. */
export function Row({ icon, colors, title, sub, right, onPress, ur: urLabel }:
  { icon: IconName; colors?: [string, string]; title: string; sub?: string; right?: ReactNode; onPress?: () => void; ur?: string }) {
  const c = useTheme();
  const swap = useUrduUi() && !!urLabel;
  const main = swap ? urLabel! : title;
  const second = swap ? title : urLabel;
  return (
    <Tap onPress={onPress} style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}>
      <IconBadge icon={icon} colors={colors} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: c.text }, ur(main, true, 15)]} numberOfLines={2}>{main}</Text>
        {!!second && <Text style={[styles.rowUr, { color: c.sub }, swap && { fontFamily: font.regular, lineHeight: undefined }]} numberOfLines={1}>{second}</Text>}
        {!!sub && <Text style={[styles.rowSub, { color: c.sub }, ur(sub, false, 12.5)]} numberOfLines={2}>{sub}</Text>}
      </View>
      {right ?? (onPress ? <Icon name="chevron-right" size={22} color={c.faint} /> : null)}
    </Tap>
  );
}

export function IconBadge({ icon, colors, size = 42 }: { icon: IconName; colors?: [string, string]; size?: number }) {
  const c = useTheme();
  return (
    <LinearGradient colors={colors ?? [c.heroB, c.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size * 0.3, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.52} color="#fff" />
    </LinearGradient>
  );
}

/** Square tile for grids (home, tools). */
export function Tile({ icon, colors, title, ur: urLabel, onPress, badge }:
  { icon: IconName; colors: [string, string]; title: string; ur?: string; onPress: () => void; badge?: string }) {
  const c = useTheme();
  const swap = useUrduUi() && !!urLabel;
  return (
    <Tap onPress={onPress} style={[styles.tile, { backgroundColor: c.card, borderColor: c.border }]}>
      <IconBadge icon={icon} colors={colors} size={46} />
      <Text style={[styles.tileTitle, { color: c.text }, swap && ur(urLabel, true, 13)]} numberOfLines={2}>{swap ? urLabel : title}</Text>
      {!!urLabel && <Text style={[styles.tileUr, { color: c.sub }, swap && { fontFamily: font.regular, lineHeight: undefined }]} numberOfLines={1}>{swap ? title : urLabel}</Text>}
      {!!badge && <View style={[styles.tileBadge, { backgroundColor: c.accent }]}><Text style={styles.tileBadgeText}>{badge}</Text></View>}
    </Tap>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const c = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.text }, ur(title, true, 16)]}>{title}</Text>
      {!!action && <Tap onPress={onAction} haptic={false}><Text style={[styles.sectionAction, { color: c.primary }]}>{action}</Text></Tap>}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const c = useTheme();
  return (
    <Tap onPress={onPress} style={[styles.chip, { backgroundColor: active ? c.primary : c.card, borderColor: active ? c.primary : c.border }]}>
      <Text style={[styles.chipText, { color: active ? '#fff' : c.text }, ur(label, false, 13)]} numberOfLines={1}>{label}</Text>
    </Tap>
  );
}

export function Chips({ children }: { children: ReactNode }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>{children}</ScrollView>;
}

export function Btn({ label, icon, onPress, color, kind = 'solid', style, disabled }:
  { label: string; icon?: IconName; onPress: () => void; color?: string; kind?: 'solid' | 'soft'; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const c = useTheme();
  const bg = kind === 'solid' ? color ?? c.primary : c.cardAlt;
  const fg = kind === 'solid' ? '#fff' : c.text;
  return (
    <Tap onPress={disabled ? undefined : onPress} style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }, style]}>
      {icon && <Icon name={icon} size={20} color={fg} />}
      <Text style={[styles.btnText, { color: fg }, ur(label, true, 14)]} numberOfLines={1}>{label}</Text>
    </Tap>
  );
}

export function Field({ label, ...p }: TextInputProps & { label: string }) {
  const c = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: c.sub }]}>{label}</Text>
      <TextInput placeholderTextColor={c.faint} {...p}
        style={[styles.input, { color: c.text, backgroundColor: c.card, borderColor: c.border }, p.style]} />
    </View>
  );
}

export function Note({ text, icon = 'information-outline', tone = 'info' }: { text: string; icon?: IconName; tone?: 'info' | 'warn' }) {
  const c = useTheme();
  const bg = tone === 'warn' ? c.accentSoft : c.primarySoft;
  const fg = tone === 'warn' ? c.warn : c.primary;
  return (
    <View style={[styles.note, { backgroundColor: bg }]}>
      <Icon name={icon} size={18} color={fg} />
      <Text style={[styles.noteText, { color: c.text }, ur(text, false, 13)]}>{text}</Text>
    </View>
  );
}

export function Empty({ icon, title, hint }: { icon: IconName; title: string; hint: string }) {
  const c = useTheme();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: c.primarySoft }]}><Icon name={icon} size={44} color={c.primary} /></View>
      <Text style={[styles.emptyTitle, { color: c.text }, ur(title, true, 17)]}>{title}</Text>
      <Text style={[styles.emptyHint, { color: c.sub }, ur(hint, false, 13)]}>{hint}</Text>
    </View>
  );
}

/** Thin progress bar 0..1. */
export function Bar({ value, color }: { value: number; color?: string }) {
  const c = useTheme();
  return (
    <View style={[styles.bar, { backgroundColor: c.cardAlt }]}>
      <View style={[styles.barFill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color ?? c.primary }]} />
    </View>
  );
}

export const styles = StyleSheet.create({
  hero: { paddingHorizontal: 16, paddingBottom: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#fff', fontFamily: font.bold, fontSize: 18 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontFamily: font.regular, fontSize: 12 },
  card: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  rowTitle: { fontFamily: font.semi, fontSize: 14.5 },
  rowUr: { fontFamily: font.urdu, fontSize: 12, lineHeight: 26, textAlign: 'left' },
  rowSub: { fontFamily: font.regular, fontSize: 12, marginTop: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  tile: { width: '31.5%', borderRadius: 18, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', gap: 6 },
  tileTitle: { fontFamily: font.semi, fontSize: 12, textAlign: 'center' },
  tileUr: { fontFamily: font.urdu, fontSize: 10.5, lineHeight: 22, textAlign: 'center' },
  tileBadge: { position: 'absolute', top: 8, right: 8, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  tileBadgeText: { color: '#1A1300', fontFamily: font.bold, fontSize: 9.5 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 },
  sectionTitle: { fontFamily: font.bold, fontSize: 16.5 },
  sectionAction: { fontFamily: font.semi, fontSize: 13 },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: font.medium, fontSize: 13 },
  btn: { flexDirection: 'row', gap: 8, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  btnText: { fontFamily: font.semi, fontSize: 15 },
  label: { fontFamily: font.medium, fontSize: 12.5, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 48, fontFamily: font.regular, fontSize: 15 },
  note: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 14, marginBottom: 12, alignItems: 'flex-start' },
  noteText: { flex: 1, fontFamily: font.regular, fontSize: 12.5, lineHeight: 19 },
  empty: { alignItems: 'center', paddingHorizontal: 30, paddingVertical: 50, gap: 10 },
  emptyIcon: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontFamily: font.bold, fontSize: 17, textAlign: 'center' },
  emptyHint: { fontFamily: font.regular, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  bar: { height: 7, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4 },
});
