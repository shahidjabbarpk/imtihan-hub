// Scholarships Pakistani students can apply for. Dates change every year: each opens the official page.
export interface Scholarship {
  name: string;
  by: string;
  scope: 'Pakistan' | 'Abroad';
  level: string;
  about: string;
  url: string;
}

export const SCHOLARSHIPS: Scholarship[] = [
  { name: 'HEC Need-Based Scholarship', by: 'Higher Education Commission', scope: 'Pakistan', level: 'BS / MS', about: 'Tuition and living support for deserving students of public universities. Apply through your university\'s financial aid office.', url: 'https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx' },
  { name: 'PEEF Scholarships', by: 'Punjab Educational Endowment Fund', scope: 'Pakistan', level: 'Matric to Master', about: 'Merit-cum-need scholarships for students of Punjab (and quota for other regions). Applied through schools, colleges and universities.', url: 'https://www.peef.org.pk/' },
  { name: 'Benazir Taleemi Wazaif', by: 'BISP', scope: 'Pakistan', level: 'Primary to Higher Secondary', about: 'Quarterly stipends for children of BISP-registered families who stay enrolled in school.', url: 'https://bisp.gov.pk/' },
  { name: 'PM Youth Programme (laptops, skills, loans)', by: 'Government of Pakistan', scope: 'Pakistan', level: 'University students & youth', about: 'Laptop scheme, skill scholarships and youth business loans when announced.', url: 'https://pmyp.gov.pk/' },
  { name: 'HEC Overseas & Indigenous PhD', by: 'Higher Education Commission', scope: 'Abroad', level: 'MS / PhD', about: 'Fully funded postgraduate study in Pakistan or abroad in announced phases.', url: 'https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx' },
  { name: 'Fulbright (USA)', by: 'USEFP', scope: 'Abroad', level: 'Master / PhD', about: 'Fully funded study in the United States. Usually needs GRE and a 16-year degree.', url: 'https://www.usefpakistan.org/' },
  { name: 'Chevening (UK)', by: 'UK Government', scope: 'Abroad', level: 'One-year Master', about: 'Fully funded master\'s in the UK for future leaders with work experience.', url: 'https://www.chevening.org/' },
  { name: 'Commonwealth Scholarships (UK)', by: 'CSC', scope: 'Abroad', level: 'Master / PhD', about: 'For students of Commonwealth countries; nominated through HEC in Pakistan.', url: 'https://cscuk.fcdo.gov.uk/' },
  { name: 'Erasmus Mundus (Europe)', by: 'European Union', scope: 'Abroad', level: 'Master', about: 'Joint master\'s programmes across several European universities with full scholarship.', url: 'https://erasmus-plus.ec.europa.eu/' },
  { name: 'DAAD (Germany)', by: 'German Academic Exchange Service', scope: 'Abroad', level: 'Master / PhD', about: 'Scholarships for study and research in Germany.', url: 'https://www.daad.de/en/' },
  { name: 'Türkiye Bursları', by: 'Government of Türkiye', scope: 'Abroad', level: 'BS / Master / PhD', about: 'Fully funded study in Turkey including a Turkish language year.', url: 'https://www.turkiyeburslari.gov.tr/' },
  { name: 'Chinese Government Scholarship', by: 'CSC China', scope: 'Abroad', level: 'BS / Master / PhD', about: 'Study in China; often applied via HEC or the university directly.', url: 'https://www.campuschina.org/' },
  { name: 'MEXT (Japan)', by: 'Government of Japan', scope: 'Abroad', level: 'BS / Master / PhD', about: 'Japanese government scholarship through the Embassy of Japan.', url: 'https://www.studyinjapan.go.jp/en/' },
  { name: 'Global Korea Scholarship', by: 'Government of Korea', scope: 'Abroad', level: 'BS / Master / PhD', about: 'Fully funded study in South Korea.', url: 'https://www.studyinkorea.go.kr/' },
  { name: 'Stipendium Hungaricum', by: 'Government of Hungary', scope: 'Abroad', level: 'BS / Master / PhD', about: 'Study in Hungary; Pakistani nominations through HEC.', url: 'https://stipendiumhungaricum.hu/' },
];
