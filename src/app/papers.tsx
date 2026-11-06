import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, Chip, Chips, Empty, Note, Row, Screen, SectionTitle } from '@/components/ui';
import { buildFromMix, mcqsOf, shuffle, shuffleOptions, SUBJECTS } from '@/data/bank';
import { boardById } from '@/data/boards';
import { withAd, withRewarded } from '@/lib/ads';
import { useL } from '@/lib/i18n';
import { openOfficial } from '@/lib/links';
import { exportPaper } from '@/lib/paper';
import { type RemotePaper, useApp } from '@/lib/store';
import { font, useTheme } from '@/lib/theme';

const BOARD_SUBJECTS = ['bio', 'chem', 'phy', 'math', 'eng', 'comp', 'pak', 'isl', 'urdu'];

function groupOf(p: RemotePaper): string {
  const s = `${p.exam ?? ''} ${p.cls ?? ''}`.toLowerCase();
  if (/mdcat|medical/.test(s)) return 'MDCAT';
  if (/ecat|net|engineer|fast|giki/.test(s)) return 'Engineering';
  if (/css|pms|ppsc|fpsc|spsc|kppsc|bpsc|nts|job|police|teach/.test(s)) return 'Jobs';
  if (/inter|fsc|11|12|hssc/.test(s)) return 'Inter';
  if (/matric|9|10|ssc/.test(s)) return 'Matric';
  return 'Other';
}

export default function Papers() {
  const c = useTheme();
  const L = useL();
  const papers = useApp((s) => s.remote?.papers ?? []);
  const level = useApp((s) => s.level);
  const boardId = useApp((s) => s.boardId);
  const board = boardId ? boardById(boardId) : undefined;
  const [group, setGroup] = useState<string>('All');
  const [cls, setCls] = useState<'matric' | 'inter'>(level === 'matric' ? 'matric' : 'inter');

  const groups = useMemo(() => ['All', ...new Set(papers.map(groupOf))], [papers]);
  const list = useMemo(() => papers
    .filter((p) => group === 'All' || groupOf(p) === group)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title)), [papers, group]);

  const open = (p: RemotePaper) => {
    if (p.mcqs?.length) withAd(() => router.push({ pathname: '/quiz', params: { mode: 'paper', paper: p.id } }));
    else if (p.url) openOfficial(p.url);
  };

  const boardPaper = (sub: string) => {
    const pool = mcqsOf(sub, undefined, cls);
    return shuffle(pool).slice(0, 20).map((m) => shuffleOptions(m));
  };

  return (
    <Screen title={L('Past Papers', 'پرانے پرچے')} subtitle={L('Archive, official board papers & practice papers', 'آرکائیو، بورڈ کے پرچے اور پریکٹس پیپرز')}>
      <SectionTitle title={L('Past paper archive', 'پرانے پرچوں کا آرکائیو')} />
      {papers.length > 0 && <Chips>{groups.map((g) => <Chip key={g} label={g} active={group === g} onPress={() => setGroup(g)} />)}</Chips>}
      <View style={{ height: 8 }} />
      {list.length ? list.slice(0, 300).map((p) => (
        <Row key={p.id} icon={p.mcqs?.length ? 'clipboard-play-outline' : 'file-pdf-box'} colors={p.mcqs?.length ? ['#9D174D', '#F472B6'] : ['#B91C1C', '#F87171']}
          title={p.title}
          sub={[p.exam, p.board, p.cls, p.subject, p.year].filter(Boolean).join(' • ') + (p.mcqs?.length ? L(` • ${p.mcqs.length} MCQs, solve online`, ` • ${p.mcqs.length} سوال، آن لائن حل کریں`) : L(' • PDF', ' • پی ڈی ایف'))}
          onPress={() => open(p)} />
      )) : (
        <Empty icon="file-document-multiple-outline" title={L('Archive is being filled', 'آرکائیو بن رہا ہے')}
          hint={L('New past papers are added online and appear here automatically – keep internet on once in a while.',
            'نئے پرانے پرچے آن لائن شامل ہوتے ہیں اور یہاں خود بخود آ جاتے ہیں – کبھی کبھار انٹرنیٹ آن رکھیں۔')} />
      )}

      <SectionTitle title={L('Official board past papers', 'بورڈ کے سرکاری پرانے پرچے')} />
      {board
        ? <Row icon="school" title={board.name} sub={L('Past papers, model papers & date sheets on the official website', 'سرکاری ویب سائٹ پر پرانے اور ماڈل پیپرز')} onPress={() => router.push(`/board/${board.id}`)} />
        : <Row icon="school-outline" title={L('Choose your board', 'اپنا بورڈ منتخب کریں')} sub={L('All 28 boards of Pakistan', 'پاکستان کے تمام 28 بورڈ')} onPress={() => router.push('/(tabs)/boards')} />}

      <SectionTitle title={L('Board objective paper (practice)', 'بورڈ معروضی پرچہ (پریکٹس)')} />
      <Chips>
        <Chip label="Matric" active={cls === 'matric'} onPress={() => setCls('matric')} />
        <Chip label="Inter / FSc" active={cls === 'inter'} onPress={() => setCls('inter')} />
      </Chips>
      <Text style={{ color: c.sub, fontFamily: font.regular, fontSize: 12.5, marginVertical: 8 }}>
        {L('20 fresh MCQs from the chosen class, timed like the objective part. Every paper is different.', 'منتخب کلاس کے 20 نئے سوال، معروضی حصے کی طرح وقت کے ساتھ۔ ہر پرچہ نیا۔')}
      </Text>
      {SUBJECTS.filter((s) => BOARD_SUBJECTS.includes(s.key)).map((s) => (
        <Card key={s.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ flex: 1, color: c.text, fontFamily: font.semi }}>{L(s.title, s.ur)}</Text>
          <Btn label={L('Solve', 'حل کریں')} icon="play" style={{ paddingHorizontal: 14 }} color={s.colors[0]}
            onPress={() => withAd(() => router.push({ pathname: '/quiz', params: { mode: 'practice', sub: s.key, level: cls, count: '20', minutes: '20', exam: '1' } }))} />
          <Btn label="PDF" icon="file-pdf-box" kind="soft" style={{ paddingHorizontal: 12 }}
            onPress={() => withRewarded('PDF paper', () => { exportPaper(`${s.title} ${cls === 'matric' ? 'Matric' : 'Inter'} Objective Paper`, boardPaper(s.key), 20).catch(() => {}); })} />
        </Card>
      ))}

      <SectionTitle title={L('Entry test papers', 'انٹری ٹیسٹ پیپرز')} />
      {[['mdcat', 'MDCAT full paper (180 MCQs)'], ['ecat', 'ECAT full paper (100 MCQs)'], ['net', 'NUST NET full paper (200 MCQs)']].map(([k, t]) => (
        <Row key={k} icon="file-document-outline" colors={['#1D4ED8', '#60A5FA']} title={t!} sub={L('Same subject mix and time as the real test', 'اصل ٹیسٹ جیسا مضامین کا تناسب اور وقت')}
          onPress={() => router.push(`/test/${k}`)} />
      ))}
      <Btn label={L('Mixed PDF paper (50 MCQs)', 'ملا جلا پی ڈی ایف پرچہ (50 سوال)')} icon="file-pdf-box" kind="soft" style={{ marginTop: 6 }}
        onPress={() => withRewarded('PDF paper', () => { exportPaper('Mixed Practice Paper', buildFromMix({ eng: 10, gk: 10, pak: 10, math: 10, sci: 10 }), 50).catch(() => {}); })} />
      <Note text={L('Original board papers belong to the boards, so the app opens them on the official websites. The archive above grows by itself from the online feed.',
        'اصل بورڈ پیپرز بورڈز کی ملکیت ہیں، اس لیے ایپ انہیں سرکاری ویب سائٹ پر کھولتی ہے۔ اوپر والا آرکائیو آن لائن فیڈ سے خود بڑھتا رہتا ہے۔')} />
    </Screen>
  );
}
