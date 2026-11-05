import type { Track } from '@/lib/leaderboard';

/**
 * Weekly Grand Tests: the same paper for every student in a track during one week (Monday to
 * Sunday, Pakistan time), so scores can be ranked on the leaderboard. A new paper every Monday.
 */
export const GRAND: { key: Track; title: string; ur: string; icon: string; colors: [string, string]; for: string; mix: Record<string, number>; minutes: number }[] = [
  { key: 'medical', title: 'Medical Grand Test', ur: 'میڈیکل گرینڈ ٹیسٹ', icon: 'stethoscope', colors: ['#BE123C', '#FB7185'], for: 'MDCAT, FSc Pre-Medical',
    mix: { bio: 24, chem: 16, phy: 12, eng: 8 }, minutes: 60 },
  { key: 'engineering', title: 'Engineering Grand Test', ur: 'انجینئرنگ گرینڈ ٹیسٹ', icon: 'cog-outline', colors: ['#4338CA', '#818CF8'], for: 'ECAT, NET, FAST, FSc Pre-Engineering',
    mix: { math: 20, phy: 18, chem: 12, eng: 10 }, minutes: 60 },
  { key: 'general', title: 'General Grand Test', ur: 'جنرل گرینڈ ٹیسٹ', icon: 'briefcase-outline', colors: ['#B45309', '#F59E0B'], for: 'CSS, PPSC, FPSC, NTS and job tests',
    mix: { eng: 14, gk: 10, pak: 10, isl: 8, sci: 6, math: 6, iq: 6 }, minutes: 60 },
];
export const grandByKey = (k: string) => GRAND.find((g) => g.key === k);
