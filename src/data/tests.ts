// Entry tests (admission) and job / competitive tests. Patterns are the latest publicly reported
// ones (Nov 2026); bodies change them, so each screen says "confirm on the official site".
import type { LinkItem } from './types';

export interface Test {
  key: string;
  name: string;
  full: string;
  kind: 'entry' | 'job';
  group: string;                        // Medical, Engineering, General, Armed Forces, PSC...
  icon: string;
  colors: [string, string];
  about: string;
  pattern: [string, string][];          // [section, MCQs / marks]
  facts: string[];                      // total, time, negative marking, passing...
  syllabus: string[];
  tips: string[];
  mix: Record<string, number>;          // mock test built from the app's bank
  minutes: number;                      // mock test time
  paper?: { mix: Record<string, number>; minutes: number }; // full-length paper like the real test
  links: LinkItem[];
}

const MED: [string, string] = ['#047857', '#34D399'];
const ENGG: [string, string] = ['#1D4ED8', '#60A5FA'];
const GEN: [string, string] = ['#7C3AED', '#C084FC'];
const ARMY: [string, string] = ['#3F6212', '#84CC16'];
const PSC: [string, string] = ['#B45309', '#F59E0B'];
const TEST: [string, string] = ['#BE123C', '#FB7185'];

const generalJobMix = { pak: 6, isl: 5, gk: 6, eng: 6, math: 4, comp: 3, sci: 3, urdu: 2 };

export const TESTS: Test[] = [
  // ------------------------------------------------------------------ entry tests
  {
    key: 'mdcat', name: 'MDCAT', full: 'Medical & Dental College Admission Test (PMDC)', kind: 'entry', group: 'Medical', icon: 'stethoscope', colors: MED,
    about: 'One national test for admission to MBBS and BDS in all public and private medical and dental colleges of Pakistan.',
    pattern: [['Biology', '81 MCQs (45%)'], ['Chemistry', '45 MCQs (25%)'], ['Physics', '36 MCQs (20%)'], ['English', '9 MCQs (5%)'], ['Logical Reasoning', '9 MCQs (5%)']],
    facts: ['Total: 180 MCQs, 1 mark each', 'No negative marking', 'Reported pass marks: 55% for MBBS, 50% for BDS', 'Usually held in August–September; registration a month or two before', 'Merit (most colleges): MDCAT 50% + FSc 40% + Matric 10% – check your province\'s admission policy'],
    syllabus: ['FSc Part I & II Biology, Chemistry, Physics (PMDC national MDCAT syllabus)', 'English: grammar, vocabulary, sentence correction, comprehension', 'Logical reasoning: critical thinking, letter/number series, cause & effect, deductions'],
    tips: ['Biology is 45% – read the textbook line by line', 'Practise full-length timed papers every week in the last two months', 'No negative marking, so never leave a question blank', 'Revise mistakes from your Mistakes list daily'],
    mix: { bio: 20, chem: 11, phy: 9, eng: 2, iq: 3 }, minutes: 50,
    paper: { mix: { bio: 81, chem: 45, phy: 36, eng: 9, iq: 9 }, minutes: 210 },
    links: [{ label: 'PMDC official website', url: 'https://pmdc.pk/' }],
  },
  {
    key: 'ecat', name: 'ECAT', full: 'Engineering College Admission Test (UET Lahore)', kind: 'entry', group: 'Engineering', icon: 'cog-outline', colors: ENGG,
    about: 'Entry test for UET Lahore and the public engineering universities of Punjab that admit on its result.',
    pattern: [['Mathematics', '30 MCQs'], ['Physics', '30 MCQs'], ['Chemistry / Computer Science / Statistics', '30 MCQs'], ['English', '10 MCQs']],
    facts: ['Total: 100 MCQs, 400 marks (4 marks each)', 'Time: 100 minutes', 'ECAT 2026 was reported without negative marking – older papers had −1 per wrong answer, so check the current notice', 'Merit weightage changes by session – see UET\'s admission portal'],
    syllabus: ['FSc Pre-Engineering / ICS Part I & II', 'English: grammar and vocabulary at FSc level'],
    tips: ['Speed matters: one minute per question', 'Learn formulas and standard results by heart', 'Solve past ECAT papers under the clock'],
    mix: { math: 9, phy: 9, chem: 9, eng: 3 }, minutes: 30,
    paper: { mix: { math: 30, phy: 30, chem: 30, eng: 10 }, minutes: 100 },
    links: [{ label: 'UET Lahore admissions', url: 'https://admission.uet.edu.pk/' }, { label: 'UET Lahore website', url: 'https://www.uet.edu.pk/' }],
  },
  {
    key: 'net', name: 'NUST NET', full: 'NUST Entry Test', kind: 'entry', group: 'Engineering', icon: 'school-outline', colors: ENGG,
    about: 'Computer-based test held in several series every year for NUST undergraduate programmes (engineering, computing, business, medical-related).',
    pattern: [['Mathematics', '~80–100 MCQs'], ['Physics', '~60 MCQs'], ['English', '~20–40 MCQs'], ['Chemistry / Intelligence (some series)', 'varies']],
    facts: ['Engineering NET: 200 MCQs in about 3 hours', 'Pattern differs by programme (Engineering, Computing, Business, Applied Sciences)', 'Merit (reported): NET 75% + FSc 15% + Matric 10%', 'You may take more than one series – the best score counts'],
    syllabus: ['FSc Part I & II Maths, Physics, Chemistry / Computer', 'English: vocabulary, grammar, comprehension', 'Basic intelligence / analytical questions'],
    tips: ['Maths carries the most weight – practise daily', 'Take an early series to learn the format, then improve in a later one'],
    mix: { math: 12, phy: 9, eng: 6, chem: 3 }, minutes: 35,
    paper: { mix: { math: 100, phy: 60, eng: 40 }, minutes: 180 },
    links: [{ label: 'NUST UG admissions', url: 'https://ugadmissions.nust.edu.pk/' }, { label: 'NUST website', url: 'https://nust.edu.pk/' }],
  },
  {
    key: 'fast', name: 'FAST NU', full: 'FAST National University Admission Test', kind: 'entry', group: 'Engineering', icon: 'laptop', colors: ENGG,
    about: 'Admission test for FAST-NUCES campuses (computing, engineering, business). FAST also accepts NTS NAT/SAT scores for some programmes.',
    pattern: [['Advanced / Basic Mathematics', 'largest share'], ['IQ / Analytical', 'section'], ['English', 'section'], ['Physics (engineering)', 'section']],
    facts: ['Computer-based / paper-based by campus', 'Sections and weightage differ by programme – see the prospectus'],
    syllabus: ['FSc Maths and Physics', 'English and analytical reasoning'],
    tips: ['Maths and IQ decide most of the merit', 'Practise number series and analogies'],
    mix: { math: 12, iq: 8, eng: 6, phy: 4 }, minutes: 35,
    links: [{ label: 'FAST NU admissions', url: 'https://nu.edu.pk/Admissions' }],
  },
  {
    key: 'giki', name: 'GIKI', full: 'GIK Institute Admission Test', kind: 'entry', group: 'Engineering', icon: 'domain', colors: ENGG,
    about: 'Admission test for GIK Institute of Engineering Sciences & Technology, Topi.',
    pattern: [['Mathematics', 'section'], ['Physics', 'section'], ['English', 'section']],
    facts: ['MCQ test, merit mostly based on the test score', 'Check the current prospectus for exact weightage'],
    syllabus: ['FSc Maths, Physics', 'English'],
    tips: ['Maths and Physics problems are conceptual – practise numericals'],
    mix: { math: 12, phy: 12, eng: 6 }, minutes: 35,
    links: [{ label: 'GIKI admissions', url: 'https://giki.edu.pk/admissions/' }],
  },
  {
    key: 'pieas', name: 'PIEAS', full: 'Pakistan Institute of Engineering & Applied Sciences Test', kind: 'entry', group: 'Engineering', icon: 'atom', colors: ENGG,
    about: 'Admission test for PIEAS BS engineering and science programmes, Islamabad.',
    pattern: [['Mathematics', 'section'], ['Physics', 'section'], ['Chemistry / Computer', 'section'], ['English', 'section']],
    facts: ['Written MCQ test; negative marking has been used – check the current notice'],
    syllabus: ['FSc Maths, Physics, Chemistry', 'English'],
    tips: ['Accuracy matters if negative marking applies – skip pure guesses'],
    mix: { math: 9, phy: 9, chem: 6, eng: 6 }, minutes: 35,
    links: [{ label: 'PIEAS admissions', url: 'https://www.pieas.edu.pk/admissions/' }],
  },
  {
    key: 'etea', name: 'ETEA', full: 'Educational Testing & Evaluation Agency (KP)', kind: 'entry', group: 'Engineering', icon: 'file-certificate-outline', colors: ENGG,
    about: 'KP government testing agency: engineering entry test for KP universities and many KP government job tests.',
    pattern: [['Mathematics', 'section'], ['Physics', 'section'], ['Chemistry / Computer', 'section'], ['English', 'section']],
    facts: ['Also conducts KP job tests (teachers, police, clerks)', 'Check the advertisement for the exact pattern'],
    syllabus: ['KP Textbook Board FSc syllabus'],
    tips: ['Use KP textbooks for wording close to the paper'],
    mix: { math: 9, phy: 9, chem: 6, eng: 6 }, minutes: 35,
    links: [{ label: 'ETEA official website', url: 'https://etea.edu.pk/' }],
  },
  {
    key: 'nat', name: 'NTS NAT', full: 'National Aptitude Test (NTS)', kind: 'entry', group: 'General', icon: 'pencil-box-multiple-outline', colors: TEST,
    about: 'Aptitude test accepted by many universities for BS admissions. Categories: NAT-IE (engineering), IM (medical), ICS, ICOM, IGS, IA (arts).',
    pattern: [['Verbal (English)', '20 MCQs'], ['Analytical', '20 MCQs'], ['Quantitative', '20 MCQs'], ['Subject (by category)', '30 MCQs']],
    facts: ['Total: 90 MCQs (NAT-I)', 'Result valid for about one year', 'NAT-II (for 14-year graduates) has a bigger subject section'],
    syllabus: ['Verbal: synonyms, antonyms, analogies, sentence completion', 'Analytical: logical puzzles, series', 'Quantitative: arithmetic, algebra, geometry', 'Subjects of your FSc / FA group'],
    tips: ['Analytical questions are fast marks once you learn the types'],
    mix: { eng: 8, iq: 8, math: 8, phy: 3, chem: 3 }, minutes: 35,
    links: [{ label: 'NTS official website', url: 'https://www.nts.org.pk/' }],
  },
  {
    key: 'usat', name: 'HEC USAT / HAT', full: 'HEC Undergraduate & Higher-education Aptitude Tests', kind: 'entry', group: 'General', icon: 'certificate-outline', colors: GEN,
    about: 'HEC\'s Education Testing Council runs USAT (undergraduate admission), HAT (MS/MPhil/PhD admission and scholarships) and LAT (law).',
    pattern: [['Verbal Reasoning', 'section'], ['Analytical Reasoning', 'section'], ['Quantitative Reasoning', 'section'], ['Subject (USAT categories)', 'section']],
    facts: ['HAT replaced GAT-General for postgraduate admissions', 'HAT score is valid for two years (as announced by HEC)'],
    syllabus: ['English vocabulary & comprehension', 'Logical and analytical reasoning', 'Basic maths & data interpretation'],
    tips: ['HAT pass score requirements differ for MS and PhD – check your university'],
    mix: { eng: 10, iq: 10, math: 10 }, minutes: 35,
    links: [{ label: 'HEC Education Testing Council', url: 'https://etc.hec.gov.pk/' }],
  },
  {
    key: 'lat', name: 'LAT', full: 'Law Admission Test (HEC)', kind: 'entry', group: 'General', icon: 'scale-balance', colors: GEN,
    about: 'Mandatory test for admission to the 5-year LLB programme, conducted by HEC.',
    pattern: [['Essay writing (English)', 'subjective'], ['Personal statement', 'subjective'], ['English grammar & comprehension', 'MCQs'], ['General knowledge, Pakistan Studies, Islamiat, Maths', 'MCQs']],
    facts: ['Pass marks have been reported as 50%', 'Check HEC for the current schedule'],
    syllabus: ['Essay and précis practice', 'GK, Pakistan Studies, Islamiat, basic maths'],
    tips: ['Practise one essay a week'],
    mix: { eng: 10, gk: 6, pak: 6, isl: 4, math: 4 }, minutes: 35,
    links: [{ label: 'HEC Education Testing Council', url: 'https://etc.hec.gov.pk/' }],
  },
  {
    key: 'issb', name: 'Army / Navy / PAF Initial Test', full: 'Armed Forces Initial Tests & ISSB', kind: 'entry', group: 'Armed Forces', icon: 'shield-star-outline', colors: ARMY,
    about: 'For commission (PMA Long Course, Navy PN Cadet, PAF GD Pilot etc.) and soldier/sailor/airman entry: initial written test → medical → interview → ISSB (for officers).',
    pattern: [['Intelligence test (verbal + non-verbal)', 'section'], ['Academic test (English, Maths, Physics, GK, Pak Studies, Islamiat)', 'section']],
    facts: ['ISSB takes 4–5 days: psychological tests, group tasks, interview', 'Physical fitness (running, push-ups) is tested'],
    syllabus: ['Verbal & non-verbal intelligence', 'Matric/FSc English, Maths, Physics', 'GK, Pakistan Studies, Islamiat'],
    tips: ['Practise intelligence tests daily – they are timed', 'Start running 3 km daily a month before'],
    mix: { iq: 12, eng: 5, math: 5, phy: 3, gk: 3, pak: 2 }, minutes: 30,
    links: [{ label: 'Join Pak Army', url: 'https://joinpakarmy.gov.pk/' }, { label: 'Join Pak Navy', url: 'https://www.joinpaknavy.gov.pk/' }, { label: 'Join PAF', url: 'https://joinpaf.gov.pk/' }],
  },

  // ------------------------------------------------------------------ job / competitive tests
  {
    key: 'css', name: 'CSS', full: 'Central Superior Services (FPSC)', kind: 'job', group: 'Competitive', icon: 'bank-outline', colors: PSC,
    about: 'The competitive exam for BS-17 officers in the federal government (PAS, PSP, Foreign Service, Customs, IRS...). Conducted by FPSC.',
    pattern: [['MPT (screening)', '200 MCQs: English, GSA (Science & Maths), Current Affairs, Pakistan Affairs, Islamiat'], ['Written: compulsory papers', 'Essay, Précis & Composition, General Science & Ability, Current Affairs, Pakistan Affairs, Islamiat / Comparative Religions'], ['Written: optional papers', '600 marks from the optional subjects list'], ['Psychological assessment & Viva Voce', 'interview']],
    facts: ['Age limit: 21–30 years (with notified relaxations)', 'Minimum qualification: Bachelor\'s degree (2nd division)', 'MPT is a qualifying screening test – only those who pass it sit the written exam','Held once a year; MPT a few months before the written exam'],
    syllabus: ['English Essay & Précis', 'General Science & Ability', 'Current Affairs & Pakistan Affairs', 'Islamic Studies', 'Optional subjects (600 marks)'],
    tips: ['Read a newspaper editorial daily', 'Write one essay every week and get it checked', 'Choose optional subjects with your background and scoring trend'],
    mix: { eng: 10, sci: 6, math: 4, pak: 6, isl: 4, gk: 5 }, minutes: 35,
    links: [{ label: 'FPSC – CSS exams', url: 'https://www.fpsc.gov.pk/' }],
  },
  {
    key: 'pms', name: 'PMS / CCE', full: 'Provincial Management Service (PPSC / SPSC / KPPSC / BPSC)', kind: 'job', group: 'Competitive', icon: 'office-building-outline', colors: PSC,
    about: 'Provincial version of CSS for BS-17 provincial posts: PMS (Punjab, KP), CCE (Sindh, Balochistan).',
    pattern: [['Compulsory papers', 'English, Essay, GK (Everyday Science, Current Affairs, Pakistan Affairs), Islamiat'], ['Optional papers', 'as per province'], ['Interview', 'viva']],
    facts: ['Age and qualification limits are in each commission\'s advertisement'],
    syllabus: ['English Essay & Précis', 'General Knowledge & Everyday Science', 'Pakistan Affairs & Current Affairs', 'Islamic Studies'],
    tips: ['Province-specific GK (districts, rivers, history) is often asked'],
    mix: { eng: 8, gk: 5, sci: 5, pak: 6, isl: 4, urdu: 2 }, minutes: 35,
    links: [{ label: 'PPSC', url: 'https://www.ppsc.gop.pk/' }, { label: 'SPSC', url: 'https://spsc.gov.pk/' }, { label: 'KPPSC', url: 'https://www.kppsc.gov.pk/' }, { label: 'BPSC', url: 'https://www.bpsc.gob.pk/' }],
  },
  {
    key: 'fpsc', name: 'FPSC', full: 'Federal Public Service Commission – General Recruitment', kind: 'job', group: 'PSC', icon: 'bank', colors: PSC,
    about: 'Federal government jobs (BS-16 and above, inspectors, lecturers, AD etc.) by general recruitment.',
    pattern: [['English', '~20 MCQs'], ['General Ability (GK, Pak Studies, Current Affairs, Islamiat, Maths)', '~30 MCQs'], ['Subject / professional', '~50 MCQs']],
    facts: ['Usually 100 MCQs, 90 minutes', 'Negative marking may apply – read the instructions on the call letter'],
    syllabus: ['English grammar & vocabulary', 'General ability', 'Post-related subject'],
    tips: ['Check the FPSC syllabus page for your post'],
    mix: { eng: 8, gk: 5, pak: 6, isl: 5, math: 6 }, minutes: 30,
    links: [{ label: 'FPSC official website', url: 'https://www.fpsc.gov.pk/' }],
  },
  {
    key: 'ppsc', name: 'PPSC', full: 'Punjab Public Service Commission', kind: 'job', group: 'PSC', icon: 'file-document-edit-outline', colors: PSC,
    about: 'Punjab government jobs: lecturers, tehsildars, naib tehsildars, sub-inspectors, educators and more.',
    pattern: [['General Knowledge, Pakistan Studies, Current Affairs, Islamiat', '~40%'], ['English, Urdu, Maths, Computer', '~30%'], ['Subject-related', '~30%']],
    facts: ['Written MCQ test of 100 marks for most posts', 'Negative marking may apply – see the call letter'],
    syllabus: ['Punjab-specific GK is often asked'],
    tips: ['Revise past PPSC questions for your post'],
    mix: generalJobMix, minutes: 30,
    links: [{ label: 'PPSC official website', url: 'https://www.ppsc.gop.pk/' }],
  },
  {
    key: 'spsc', name: 'SPSC', full: 'Sindh Public Service Commission', kind: 'job', group: 'PSC', icon: 'file-document-multiple-outline', colors: PSC,
    about: 'Sindh government jobs and CCE.', pattern: [['General ability & subject MCQs', 'per advertisement']],
    facts: ['Pre-interview written test for most posts'], syllabus: ['GK, Pakistan Studies, Islamiat, English, Sindh-specific GK'], tips: ['Read Sindh history and geography'],
    mix: generalJobMix, minutes: 30, links: [{ label: 'SPSC official website', url: 'https://spsc.gov.pk/' }],
  },
  {
    key: 'kppsc', name: 'KPPSC', full: 'Khyber Pakhtunkhwa Public Service Commission', kind: 'job', group: 'PSC', icon: 'file-certificate-outline', colors: PSC,
    about: 'KP government jobs and PMS.', pattern: [['General ability & subject MCQs', 'per advertisement']],
    facts: ['Screening test followed by interview'], syllabus: ['GK, Pakistan Studies, Islamiat, English, KP-specific GK'], tips: ['KPPSC posts its own past papers – practise them'],
    mix: generalJobMix, minutes: 30, links: [{ label: 'KPPSC official website', url: 'https://www.kppsc.gov.pk/' }],
  },
  {
    key: 'bpsc', name: 'BPSC', full: 'Balochistan Public Service Commission', kind: 'job', group: 'PSC', icon: 'file-document-outline', colors: PSC,
    about: 'Balochistan government jobs and CCE.', pattern: [['General ability & subject MCQs', 'per advertisement']],
    facts: ['Check the advertisement for test and interview details'], syllabus: ['GK, Pakistan Studies, Islamiat, English, Balochistan GK'], tips: ['Read about Balochistan districts, minerals and history'],
    mix: generalJobMix, minutes: 30, links: [{ label: 'BPSC official website', url: 'https://www.bpsc.gob.pk/' }],
  },
  {
    key: 'nts', name: 'NTS / OTS / PTS', full: 'Testing services for government & semi-government jobs', kind: 'job', group: 'Testing Service', icon: 'clipboard-check-outline', colors: TEST,
    about: 'Many departments hire through testing services: NTS, OTS, PTS, UTS, ETEA. The paper usually mixes general ability with the post\'s subject.',
    pattern: [['English & Urdu', 'section'], ['General Knowledge, Pak Studies, Islamiat', 'section'], ['Maths & Analytical', 'section'], ['Subject / professional', 'section']],
    facts: ['Download your roll number slip from the testing service\'s website', 'Results and answer keys are published there too'],
    syllabus: ['General ability + post-related subject'], tips: ['Bring the original CNIC and roll number slip to the test centre'],
    mix: generalJobMix, minutes: 30,
    links: [{ label: 'NTS', url: 'https://www.nts.org.pk/' }, { label: 'OTS', url: 'https://ots.org.pk/' }, { label: 'PTS', url: 'https://www.pts.org.pk/' }, { label: 'ETEA', url: 'https://etea.edu.pk/' }],
  },
  {
    key: 'teaching', name: 'Teaching Jobs', full: 'Educators, SST, PST, ESE, Lecturer tests', kind: 'job', group: 'Education', icon: 'human-male-board', colors: GEN,
    about: 'School teacher tests (PST, EST, SST, SESE) and college lecturer tests by PPSC, SPSC, KPPSC, ETEA, NTS and others.',
    pattern: [['General ability', 'section'], ['Pedagogy / teaching methods', 'section'], ['Subject knowledge', 'section']],
    facts: ['Many teacher tests include pedagogy questions (Bloom\'s taxonomy, lesson planning, assessment)'],
    syllabus: ['GK, English, Urdu, Islamiat, Pak Studies', 'Teaching methods, child psychology, assessment', 'Your subject'],
    tips: ['Learn the basics of Bloom\'s taxonomy and classroom assessment'],
    mix: { eng: 6, urdu: 4, isl: 4, pak: 5, gk: 5, math: 4, comp: 2 }, minutes: 30,
    links: [{ label: 'PPSC', url: 'https://www.ppsc.gop.pk/' }, { label: 'ETEA', url: 'https://etea.edu.pk/' }, { label: 'NTS', url: 'https://www.nts.org.pk/' }],
  },
  {
    key: 'police', name: 'Police / FIA / ASF / ANF', full: 'Police & law-enforcement recruitment tests', kind: 'job', group: 'Law Enforcement', icon: 'police-badge-outline', colors: ARMY,
    about: 'Constable, ASI and Sub-Inspector tests for provincial police, FIA, ASF, ANF and Motorway Police.',
    pattern: [['Physical test (running, height/chest)', 'qualifying'], ['Written test: GK, Pak Studies, Islamiat, English, Urdu, Maths, Computer', 'MCQs'], ['Interview', 'viva']],
    facts: ['Sub-Inspector posts are usually through PSCs; constables through police / testing services'],
    syllabus: ['General ability + basic law knowledge for SI posts'], tips: ['Practise the running test in advance'],
    mix: generalJobMix, minutes: 30,
    links: [{ label: 'FIA', url: 'https://www.fia.gov.pk/' }, { label: 'Punjab Police', url: 'https://punjabpolice.gov.pk/' }],
  },
];

export const testByKey = (k: string) => TESTS.find((t) => t.key === k);
