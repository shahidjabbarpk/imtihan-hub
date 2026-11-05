import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn, Chip, Icon, Tap, useStatusBar } from '@/components/ui';
import { BOARDS } from '@/data/boards';
import { useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const LEVELS = [
  { k: 'matric', icon: 'numeric-10-box-outline', t: 'Matric (9th / 10th)', s: 'Board exams, MCQs, past papers' },
  { k: 'inter', icon: 'school-outline', t: 'Inter / FSc / ICS', s: 'Board exams + MDCAT, ECAT, NET' },
  { k: 'graduate', icon: 'briefcase-outline', t: 'Jobs / CSS / University', s: 'PPSC, FPSC, NTS, CSS, HAT' },
] as const;

const GOALS: Record<string, [string, string][]> = {
  matric: [['', 'Board exams only'], ['issb', 'Army / Navy / PAF'], ['nat', 'NTS NAT']],
  inter: [['mdcat', 'MDCAT'], ['ecat', 'ECAT'], ['net', 'NUST NET'], ['fast', 'FAST'], ['nat', 'NTS NAT'], ['issb', 'Armed Forces'], ['', 'Board exams only']],
  graduate: [['css', 'CSS'], ['pms', 'PMS / CCE'], ['ppsc', 'PPSC'], ['fpsc', 'FPSC'], ['nts', 'NTS / OTS / PTS'], ['teaching', 'Teaching'], ['police', 'Police / FIA'], ['usat', 'HAT / USAT']],
};

export default function Onboarding() {
  useStatusBar('hero');
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'matric' | 'inter' | 'graduate'>('inter');
  const [goal, setGoal] = useState('');
  const [board, setBoard] = useState<string | null>(null);
  const lang = useApp((s) => s.lang);

  const done = () => {
    useApp.getState().set({ name: name.trim(), level, goal: goal || null, boardId: board, onboarded: true });
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[c.heroA, c.heroB]} style={{ paddingTop: insets.top + 30, paddingBottom: 30, paddingHorizontal: 22, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <Icon name="school" size={44} color="#fff" />
        <Text style={{ color: '#fff', fontFamily: font.bold, fontSize: 28, marginTop: 8 }}>Imtihan Hub</Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontFamily: font.regular, fontSize: 13.5 }}>
          MCQs, mock tests, results, roll no slips, past papers, merit calculators & scholarships – one app for every Pakistani student.
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>
          {[0, 1, 2].map((i) => <View key={i} style={{ height: 5, flex: 1, borderRadius: 3, backgroundColor: i <= step ? '#fff' : 'rgba(255,255,255,0.3)' }} />)}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 30 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <>
            <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 18, marginBottom: 8 }}>Language / زبان</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
              <Chip label="English" active={lang === 'en'} onPress={() => useApp.getState().set({ lang: 'en' })} />
              <Chip label="اردو" active={lang === 'ur'} onPress={() => useApp.getState().set({ lang: 'ur' })} />
            </View>
            <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 18, marginBottom: 6 }}>Aap ka naam?</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Your name (optional)" placeholderTextColor={c.faint}
              style={{ borderWidth: 1, borderColor: c.border, backgroundColor: c.card, borderRadius: 14, height: 50, paddingHorizontal: 14, color: c.text, fontFamily: font.regular, fontSize: 15 }} />
            <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 18, marginTop: 22, marginBottom: 10 }}>Aap kis ki tayari kar rahe hain?</Text>
            {LEVELS.map((l) => (
              <Tap key={l.k} onPress={() => { setLevel(l.k); setGoal(''); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10, borderColor: level === l.k ? c.primary : c.border, backgroundColor: level === l.k ? c.primarySoft : c.card }}>
                <Icon name={l.icon} size={26} color={level === l.k ? c.primary : c.sub} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.text, fontFamily: font.semi, fontSize: 15 }}>{l.t}</Text>
                  <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12 }}>{l.s}</Text>
                </View>
                {level === l.k && <Icon name="check-circle" size={22} color={c.primary} />}
              </Tap>
            ))}
            <Btn label="Next" icon="arrow-right" onPress={() => setStep(1)} style={{ marginTop: 8 }} />
          </>
        )}
        {step === 1 && (
          <>
            <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 18, marginBottom: 10 }}>Main goal kya hai?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {GOALS[level]!.map(([k, l]) => <Chip key={l} label={l} active={goal === k} onPress={() => setGoal(k)} />)}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
              <Btn label="Back" kind="soft" onPress={() => setStep(0)} style={{ flex: 1 }} />
              <Btn label={level === 'graduate' ? 'Start' : 'Next'} icon="arrow-right" onPress={() => (level === 'graduate' ? done() : setStep(2))} style={{ flex: 2 }} />
            </View>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 18, marginBottom: 4 }}>Aap ka board?</Text>
            <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginBottom: 12 }}>Results, roll no slip and date sheet will be one tap away on Home.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {BOARDS.map((b) => <Chip key={b.id} label={b.name} active={board === b.id} onPress={() => setBoard(board === b.id ? null : b.id)} />)}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
              <Btn label="Back" kind="soft" onPress={() => setStep(1)} style={{ flex: 1 }} />
              <Btn label="Start" icon="check" onPress={done} style={{ flex: 2 }} />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
