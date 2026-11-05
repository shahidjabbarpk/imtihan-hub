// Every BISE in Pakistan with its official website. Results, roll number slips, date sheets,
// gazettes and past papers are all published on these sites, so every button opens the official
// page, plus a "latest news" Google search as a fallback when a board moves its pages around.

export interface Board {
  id: string;
  name: string;      // short, as students say it
  full: string;
  region: 'Punjab' | 'Federal' | 'Khyber Pakhtunkhwa' | 'Sindh' | 'Balochistan' | 'AJK' | 'Private';
  site: string;
  sindhHsc?: boolean; // Karachi has separate boards for Matric (BSEK) and Inter (BIEK)
  levels: ('matric' | 'inter')[];
}

const P = 'Punjab', K = 'Khyber Pakhtunkhwa', S = 'Sindh';
const both: Board['levels'] = ['matric', 'inter'];

export const BOARDS: Board[] = [
  { id: 'lahore', name: 'BISE Lahore', full: 'Board of Intermediate & Secondary Education, Lahore', region: P, site: 'https://www.biselahore.com/', levels: both },
  { id: 'gujranwala', name: 'BISE Gujranwala', full: 'BISE Gujranwala', region: P, site: 'https://www.bisegrw.edu.pk/', levels: both },
  { id: 'rawalpindi', name: 'BISE Rawalpindi', full: 'BISE Rawalpindi', region: P, site: 'https://www.biserawalpindi.edu.pk/', levels: both },
  { id: 'faisalabad', name: 'BISE Faisalabad', full: 'BISE Faisalabad', region: P, site: 'https://www.bisefsd.edu.pk/', levels: both },
  { id: 'multan', name: 'BISE Multan', full: 'BISE Multan', region: P, site: 'https://www.bisemultan.edu.pk/', levels: both },
  { id: 'sargodha', name: 'BISE Sargodha', full: 'BISE Sargodha', region: P, site: 'https://www.bisesargodha.edu.pk/', levels: both },
  { id: 'sahiwal', name: 'BISE Sahiwal', full: 'BISE Sahiwal', region: P, site: 'https://www.bisesahiwal.edu.pk/', levels: both },
  { id: 'bahawalpur', name: 'BISE Bahawalpur', full: 'BISE Bahawalpur', region: P, site: 'https://www.bisebwp.edu.pk/', levels: both },
  { id: 'dgkhan', name: 'BISE DG Khan', full: 'BISE Dera Ghazi Khan', region: P, site: 'https://www.bisedgkhan.edu.pk/', levels: both },
  { id: 'fbise', name: 'FBISE', full: 'Federal Board of Intermediate & Secondary Education, Islamabad', region: 'Federal', site: 'https://www.fbise.edu.pk/', levels: both },
  { id: 'peshawar', name: 'BISE Peshawar', full: 'BISE Peshawar', region: K, site: 'https://www.bisep.edu.pk/', levels: both },
  { id: 'mardan', name: 'BISE Mardan', full: 'BISE Mardan', region: K, site: 'https://www.bisemdn.edu.pk/', levels: both },
  { id: 'abbottabad', name: 'BISE Abbottabad', full: 'BISE Abbottabad', region: K, site: 'https://www.biseatd.edu.pk/', levels: both },
  { id: 'swat', name: 'BISE Swat', full: 'BISE Swat (Saidu Sharif)', region: K, site: 'https://www.bisess.edu.pk/', levels: both },
  { id: 'malakand', name: 'BISE Malakand', full: 'BISE Malakand', region: K, site: 'https://www.bisemalakand.edu.pk/', levels: both },
  { id: 'kohat', name: 'BISE Kohat', full: 'BISE Kohat', region: K, site: 'https://www.bisekt.edu.pk/', levels: both },
  { id: 'bannu', name: 'BISE Bannu', full: 'BISE Bannu', region: K, site: 'https://biseb.edu.pk/', levels: both },
  { id: 'dikhan', name: 'BISE DI Khan', full: 'BISE Dera Ismail Khan', region: K, site: 'https://www.bisedik.edu.pk/', levels: both },
  { id: 'bsek', name: 'BSEK Karachi (Matric)', full: 'Board of Secondary Education Karachi', region: S, site: 'https://www.bsek.edu.pk/', levels: ['matric'] },
  { id: 'biek', name: 'BIEK Karachi (Inter)', full: 'Board of Intermediate Education Karachi', region: S, site: 'https://www.biek.edu.pk/', levels: ['inter'] },
  { id: 'hyderabad', name: 'BISE Hyderabad', full: 'BISE Hyderabad', region: S, site: 'https://www.biseh.edu.pk/', levels: both },
  { id: 'sukkur', name: 'BISE Sukkur', full: 'BISE Sukkur', region: S, site: 'https://www.bisesuksindh.edu.pk/', levels: both },
  { id: 'larkana', name: 'BISE Larkana', full: 'BISE Larkana', region: S, site: 'https://www.biselrk.edu.pk/', levels: both },
  { id: 'mirpurkhas', name: 'BISE Mirpurkhas', full: 'BISE Mirpurkhas', region: S, site: 'https://www.bisempk.edu.pk/', levels: both },
  { id: 'sba', name: 'BISE Shaheed Benazirabad', full: 'BISE Shaheed Benazirabad (Nawabshah)', region: S, site: 'https://www.bisesba.edu.pk/', levels: both },
  { id: 'quetta', name: 'BBISE Quetta', full: 'Balochistan Board of Intermediate & Secondary Education, Quetta', region: 'Balochistan', site: 'https://www.bbiseqta.edu.pk/', levels: both },
  { id: 'ajk', name: 'AJK Board Mirpur', full: 'AJK Board of Intermediate & Secondary Education, Mirpur', region: 'AJK', site: 'https://www.ajkbise.net/', levels: both },
  { id: 'akueb', name: 'AKU-EB', full: 'Aga Khan University Examination Board', region: 'Private', site: 'https://examinationboard.aku.edu/', levels: both },
];

export const REGIONS = ['Punjab', 'Federal', 'Khyber Pakhtunkhwa', 'Sindh', 'Balochistan', 'AJK', 'Private'] as const;

export const boardById = (id: string) => BOARDS.find((b) => b.id === id);

/** What a student comes to a board for. Each opens the official site (search fallback below it). */
export const BOARD_ACTIONS = [
  { key: 'result', label: 'Result', ur: 'رزلٹ', icon: 'trophy-outline', q: 'result' },
  { key: 'rollno', label: 'Roll No Slip', ur: 'رول نمبر سلپ', icon: 'card-account-details-outline', q: 'roll number slip' },
  { key: 'datesheet', label: 'Date Sheet', ur: 'ڈیٹ شیٹ', icon: 'calendar-month-outline', q: 'date sheet' },
  { key: 'papers', label: 'Past Papers', ur: 'پرانے پرچے', icon: 'file-document-multiple-outline', q: 'past papers' },
  { key: 'admission', label: 'Admission / Forms', ur: 'داخلہ فارم', icon: 'form-select', q: 'admission form schedule' },
  { key: 'gazette', label: 'Gazette / Position Holders', ur: 'گزٹ', icon: 'medal-outline', q: 'gazette position holders' },
  { key: 'rechecking', label: 'Rechecking', ur: 'ری چیکنگ', icon: 'file-find-outline', q: 'rechecking' },
  { key: 'syllabus', label: 'Syllabus / Pairing', ur: 'سلیبس', icon: 'book-open-page-variant-outline', q: 'syllabus pairing scheme' },
] as const;

export const searchUrl = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;

/** Official textbook boards: free PDF books are on these sites. */
export const TEXTBOOKS = [
  { label: 'Punjab Curriculum & Textbook Board (PCTB)', url: 'https://pctb.punjab.gov.pk/' },
  { label: 'KP Textbook Board (KPTBB)', url: 'https://kpese.gov.pk/textbook-board-tbb/' },
  { label: 'Sindh Textbook Board (STBB)', url: 'https://stbb.edu.pk/' },
  { label: 'Federal / National Curriculum (NCC)', url: 'https://www.mofept.gov.pk/' },
  { label: 'Balochistan Textbook Board', url: 'https://www.emis.gob.pk/website/BTB.aspx' },
];

/** Equivalence for O/A level and foreign certificates. */
export const IBCC = { label: 'IBCC – Equivalence & Attestation', url: 'https://ibcc.edu.pk/' };
