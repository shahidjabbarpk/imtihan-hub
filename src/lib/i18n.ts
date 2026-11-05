import { useApp } from './store';

/**
 * Bilingual UI. Screens call `const L = useL()` and write `L('Daily Quiz', 'روزانہ کوئز')`;
 * the language is chosen in onboarding / Settings. Rows and tiles that carry an Urdu label
 * swap their two lines automatically (see components/ui.tsx).
 */
export function useL() {
  const lang = useApp((s) => s.lang);
  return (en: string, ur: string) => (lang === 'ur' ? ur : en);
}

export const isUrduText = (s: string) => /[؀-ۿ]/.test(s);
