import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, haptic, Note, Screen } from '@/components/ui';
import { font, useTheme } from '@/lib/theme';

const PLANS = [
  { label: '25 / 5 (Pomodoro)', work: 25, rest: 5 },
  { label: '50 / 10', work: 50, rest: 10 },
  { label: '90 / 15 (deep work)', work: 90, rest: 15 },
];

export default function Timer() {
  const c = useTheme();
  const [plan, setPlan] = useState(0);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [left, setLeft] = useState(PLANS[0]!.work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const p = PLANS[plan]!;

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      haptic('medium');
      if (phase === 'work') { setSessions((s) => s + 1); setPhase('rest'); setLeft(p.rest * 60); }
      else { setPhase('work'); setLeft(p.work * 60); }
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left, phase, p]);

  const choose = (i: number) => { setPlan(i); setPhase('work'); setLeft(PLANS[i]!.work * 60); setRunning(false); };
  const reset = () => { setPhase('work'); setLeft(p.work * 60); setRunning(false); };
  const col = phase === 'work' ? c.primary : c.ok;

  return (
    <Screen title="Study Timer" subtitle="Focus blocks with short breaks">
      <Chips>{PLANS.map((x, i) => <Chip key={x.label} label={x.label} active={plan === i} onPress={() => choose(i)} />)}</Chips>
      <Card style={{ alignItems: 'center', paddingVertical: 30, marginTop: 14 }}>
        <Text style={{ color: col, fontFamily: font.semi, fontSize: 15 }}>{phase === 'work' ? 'Focus time 📚' : 'Break time ☕'}</Text>
        <Text style={{ color: c.text, fontFamily: font.bold, fontSize: 64, marginVertical: 6 }}>
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
        </Text>
        <Text style={{ color: c.sub, fontFamily: font.regular }}>Sessions completed today: {sessions}</Text>
      </Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Btn label={running ? 'Pause' : 'Start'} icon={running ? 'pause' : 'play'} onPress={() => setRunning(!running)} color={col} style={{ flex: 1 }} />
        <Btn label="Reset" icon="restart" kind="soft" onPress={reset} style={{ flex: 1 }} />
      </View>
      <Note text="Keep the app open while the timer runs. Put your phone on silent, keep only your book and notebook on the desk, and drink water in breaks." />
    </Screen>
  );
}
