import { type ReactNode, useMemo, useState } from 'react';
import { Modal, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName, Tap, ur } from '@/components/ui';
import { font, useTheme } from '@/lib/theme';

export interface SelectOption {
  value: string;
  label: string;
  sub?: string;
  group?: string;
}

/**
 * Professional dropdown: a field that opens a bottom sheet with search and grouped options.
 * Use it for every pick-one-from-a-list input (board, province, city, district...).
 * Pass `trigger` to open the sheet from a custom element (e.g. a settings Row) instead of the field.
 */
export function Select({ value, options, onChange, placeholder = 'Select', title, icon, clearLabel, searchPlaceholder = 'Search', trigger }: {
  value: string | null | undefined;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  title?: string;
  icon?: IconName;
  /** Adds a first row that clears the choice (e.g. "Not now"). */
  clearLabel?: string;
  searchPlaceholder?: string;
  trigger?: (open: () => void) => ReactNode;
}) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const current = options.find((o) => o.value === value);
  const searchable = options.length > 7;

  const sections = useMemo(() => {
    const term = q.trim().toLowerCase();
    const hit = (o: SelectOption) => !term || `${o.label} ${o.sub ?? ''} ${o.group ?? ''}`.toLowerCase().includes(term);
    const out: { title: string; data: SelectOption[] }[] = [];
    for (const o of options.filter(hit)) {
      const g = o.group ?? '';
      let sec = out.find((s) => s.title === g);
      if (!sec) out.push((sec = { title: g, data: [] }));
      sec.data.push(o);
    }
    return out;
  }, [options, q]);

  // search is cleared when the sheet opens, so the list doesn't jump while it slides away
  const close = () => setOpen(false);
  const pick = (v: string | null) => { onChange(v); close(); };
  const show = () => { setQ(''); setOpen(true); };

  return (
    <>
      {trigger ? trigger(show) : (
        <Tap onPress={show} scaleTo={0.99} accessibilityRole="button" accessibilityLabel={title ?? placeholder}
          style={[s.field, { backgroundColor: c.card, borderColor: current ? c.primary : c.border }]}>
          {!!icon && <Icon name={icon} size={20} color={current ? c.primary : c.sub} />}
          <View style={{ flex: 1 }}>
            <Text style={[s.fieldText, { color: current ? c.text : c.faint }, ur(current?.label ?? placeholder, false, 15)]} numberOfLines={1}>
              {current?.label ?? placeholder}
            </Text>
            {!!current?.sub && <Text style={[s.fieldSub, { color: c.sub }]} numberOfLines={1}>{current.sub}</Text>}
          </View>
          <Icon name="chevron-down" size={22} color={c.sub} />
        </Tap>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
        <Pressable style={s.backdrop} onPress={close} accessibilityLabel="Close" />
        <View style={[s.sheet, { backgroundColor: c.bg, paddingBottom: insets.bottom + 8 }]}>
          <View style={[s.grabber, { backgroundColor: c.border }]} />
          <View style={s.head}>
            <Text style={[s.headTitle, { color: c.text }, ur(title ?? placeholder, true, 17)]}>{title ?? placeholder}</Text>
            <Tap onPress={close} style={[s.closeBtn, { backgroundColor: c.cardAlt }]} accessibilityLabel="Close">
              <Icon name="close" size={20} color={c.text} />
            </Tap>
          </View>
          {searchable && (
            <View style={[s.search, { backgroundColor: c.card, borderColor: c.border }]}>
              <Icon name="magnify" size={20} color={c.sub} />
              <TextInput value={q} onChangeText={setQ} placeholder={searchPlaceholder} placeholderTextColor={c.faint}
                style={[s.searchInput, { color: c.text }]} autoCorrect={false} />
              {!!q && <Tap onPress={() => setQ('')} haptic={false}><Icon name="close-circle" size={18} color={c.faint} /></Tap>}
            </View>
          )}
          <SectionList
            sections={sections}
            keyExtractor={(o) => o.value}
            keyboardShouldPersistTaps="handled"
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
            ListHeaderComponent={clearLabel && !q ? (
              <OptionRow label={clearLabel} active={!value} onPress={() => pick(null)} muted />
            ) : null}
            renderSectionHeader={({ section }) => (section.title
              ? <Text style={[s.group, { color: c.sub }]}>{section.title.toUpperCase()}</Text> : null)}
            renderItem={({ item }) => (
              <OptionRow label={item.label} sub={item.sub} active={item.value === value} onPress={() => pick(item.value)} />
            )}
            ListEmptyComponent={<Text style={[s.empty, { color: c.sub }]}>No match for “{q}”</Text>}
          />
        </View>
      </Modal>
    </>
  );
}

function OptionRow({ label, sub, active, onPress, muted }: { label: string; sub?: string; active?: boolean; onPress: () => void; muted?: boolean }) {
  const c = useTheme();
  return (
    <Tap onPress={onPress} scaleTo={0.99}
      style={[s.option, { backgroundColor: active ? c.primarySoft : c.card, borderColor: active ? c.primary : c.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[s.optLabel, { color: muted ? c.sub : c.text }, ur(label, true, 15)]} numberOfLines={1}>{label}</Text>
        {!!sub && <Text style={[s.optSub, { color: c.sub }, ur(sub, false, 12)]} numberOfLines={1}>{sub}</Text>}
      </View>
      {active && <Icon name="check-circle" size={22} color={c.primary} />}
    </Tap>
  );
}

const s = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 54, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8 },
  fieldText: { fontFamily: font.semi, fontSize: 15 },
  fieldSub: { fontFamily: font.regular, fontSize: 12, marginTop: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { maxHeight: '82%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 8 },
  grabber: { alignSelf: 'center', width: 42, height: 5, borderRadius: 3, marginBottom: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  headTitle: { fontFamily: font.bold, fontSize: 17, flex: 1 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 46 },
  searchInput: { flex: 1, fontFamily: font.regular, fontSize: 15, paddingVertical: 0 },
  group: { fontFamily: font.semi, fontSize: 11.5, letterSpacing: 0.6, marginTop: 14, marginBottom: 6, marginLeft: 2 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  optLabel: { fontFamily: font.semi, fontSize: 15 },
  optSub: { fontFamily: font.regular, fontSize: 12, marginTop: 1 },
  empty: { textAlign: 'center', fontFamily: font.regular, fontSize: 13.5, paddingVertical: 30 },
});
