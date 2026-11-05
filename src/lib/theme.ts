import { useApp } from './store';

// Brand: confident study blue (#1D4ED8) + warm amber accent (#F59E0B, highlights / streaks).
const light = {
  dark: false,
  bg: '#F6F8FC',
  card: '#FFFFFF',
  cardAlt: '#EEF2F8',
  text: '#111827',
  sub: '#5B6474',
  faint: '#A0A8B6',
  border: '#E3E8F0',
  primary: '#1D4ED8',
  primarySoft: '#E5EDFF',
  accent: '#F59E0B',
  accentSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FDECEC',
  warn: '#D97706',
  ok: '#059669',
  okSoft: '#DCFCE7',
  heroA: '#0B1F5C',
  heroB: '#1D4ED8',
  shadow: '#0B1F5C',
  tabBar: 'rgba(255,255,255,0.9)',
  glassBorder: 'rgba(255,255,255,0.9)',
};

const dark: typeof light = {
  dark: true,
  bg: '#0F1218',
  card: '#191D26',
  cardAlt: '#232834',
  text: '#F1F4F9',
  sub: '#A4ADBD',
  faint: '#6B7385',
  border: '#2A303C',
  primary: '#6B9BFF',
  primarySoft: '#1B2747',
  accent: '#FBBF24',
  accentSoft: '#3A2E10',
  danger: '#F87171',
  dangerSoft: '#3A1E1E',
  warn: '#FBBF24',
  ok: '#34D399',
  okSoft: '#123326',
  heroA: '#060E2B',
  heroB: '#16348F',
  shadow: '#000000',
  tabBar: 'rgba(25,29,38,0.92)',
  glassBorder: 'rgba(255,255,255,0.08)',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useApp((s) => s.theme) === 'dark' ? dark : light;
}

export const font = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  urdu: 'NotoNastaliqUrdu_400Regular',
  urduBold: 'NotoNastaliqUrdu_700Bold',
};
