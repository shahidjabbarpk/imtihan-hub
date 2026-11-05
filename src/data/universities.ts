// Major universities with their official admission pages. "test" = what they usually admit on.
export interface Uni {
  name: string;
  city: string;
  type: 'Public' | 'Private';
  field: 'Engineering' | 'Medical' | 'General' | 'Business' | 'Agriculture' | 'Distance';
  test: string;
  url: string;
}

export const UNIVERSITIES: Uni[] = [
  { name: 'NUST', city: 'Islamabad', type: 'Public', field: 'Engineering', test: 'NET', url: 'https://nust.edu.pk/' },
  { name: 'UET Lahore', city: 'Lahore', type: 'Public', field: 'Engineering', test: 'ECAT', url: 'https://www.uet.edu.pk/' },
  { name: 'UET Taxila', city: 'Taxila', type: 'Public', field: 'Engineering', test: 'ECAT', url: 'https://www.uettaxila.edu.pk/' },
  { name: 'UET Peshawar', city: 'Peshawar', type: 'Public', field: 'Engineering', test: 'ETEA', url: 'https://www.uetpeshawar.edu.pk/' },
  { name: 'NED University', city: 'Karachi', type: 'Public', field: 'Engineering', test: 'NED entry test', url: 'https://www.neduet.edu.pk/' },
  { name: 'Mehran UET', city: 'Jamshoro', type: 'Public', field: 'Engineering', test: 'MUET test', url: 'https://www.muet.edu.pk/' },
  { name: 'PIEAS', city: 'Islamabad', type: 'Public', field: 'Engineering', test: 'PIEAS test', url: 'https://www.pieas.edu.pk/' },
  { name: 'GIK Institute', city: 'Topi', type: 'Private', field: 'Engineering', test: 'GIKI test', url: 'https://giki.edu.pk/' },
  { name: 'FAST NUCES', city: 'Multiple', type: 'Private', field: 'Engineering', test: 'FAST test / NTS', url: 'https://nu.edu.pk/' },
  { name: 'COMSATS University', city: 'Multiple', type: 'Public', field: 'Engineering', test: 'NTS NAT / own test', url: 'https://www.comsats.edu.pk/' },
  { name: 'Air University', city: 'Islamabad', type: 'Public', field: 'Engineering', test: 'AU test', url: 'https://au.edu.pk/' },
  { name: 'Bahria University', city: 'Islamabad / Karachi / Lahore', type: 'Public', field: 'General', test: 'Bahria test', url: 'https://www.bahria.edu.pk/' },
  { name: 'Institute of Space Technology', city: 'Islamabad', type: 'Public', field: 'Engineering', test: 'IST test', url: 'https://www.ist.edu.pk/' },
  { name: 'ITU Lahore', city: 'Lahore', type: 'Public', field: 'Engineering', test: 'ITU test', url: 'https://itu.edu.pk/' },
  { name: 'NUTECH', city: 'Islamabad', type: 'Public', field: 'Engineering', test: 'NUTECH test', url: 'https://nutech.edu.pk/' },
  { name: 'LUMS', city: 'Lahore', type: 'Private', field: 'General', test: 'LCAT / SAT', url: 'https://lums.edu.pk/' },
  { name: 'Habib University', city: 'Karachi', type: 'Private', field: 'General', test: 'Own test / SAT', url: 'https://habib.edu.pk/' },
  { name: 'IBA Karachi', city: 'Karachi', type: 'Public', field: 'Business', test: 'IBA test', url: 'https://www.iba.edu.pk/' },
  { name: 'University of the Punjab', city: 'Lahore', type: 'Public', field: 'General', test: 'Merit / dept. tests', url: 'https://pu.edu.pk/' },
  { name: 'GC University Lahore', city: 'Lahore', type: 'Public', field: 'General', test: 'Merit / test', url: 'https://gcu.edu.pk/' },
  { name: 'Quaid-i-Azam University', city: 'Islamabad', type: 'Public', field: 'General', test: 'Merit', url: 'https://qau.edu.pk/' },
  { name: 'International Islamic University', city: 'Islamabad', type: 'Public', field: 'General', test: 'IIUI test', url: 'https://www.iiu.edu.pk/' },
  { name: 'NUML', city: 'Islamabad', type: 'Public', field: 'General', test: 'NUML test', url: 'https://numl.edu.pk/' },
  { name: 'University of Karachi', city: 'Karachi', type: 'Public', field: 'General', test: 'Merit / test', url: 'https://www.uok.edu.pk/' },
  { name: 'University of Peshawar', city: 'Peshawar', type: 'Public', field: 'General', test: 'Merit / test', url: 'https://www.uop.edu.pk/' },
  { name: 'Bahauddin Zakariya University', city: 'Multan', type: 'Public', field: 'General', test: 'Merit', url: 'https://www.bzu.edu.pk/' },
  { name: 'Islamia University Bahawalpur', city: 'Bahawalpur', type: 'Public', field: 'General', test: 'Merit', url: 'https://www.iub.edu.pk/' },
  { name: 'University of Sargodha', city: 'Sargodha', type: 'Public', field: 'General', test: 'Merit', url: 'https://su.edu.pk/' },
  { name: 'University of Sindh', city: 'Jamshoro', type: 'Public', field: 'General', test: 'Pre-entry test', url: 'https://usindh.edu.pk/' },
  { name: 'University of Balochistan', city: 'Quetta', type: 'Public', field: 'General', test: 'Merit / test', url: 'https://www.uob.edu.pk/' },
  { name: 'BUITEMS', city: 'Quetta', type: 'Public', field: 'Engineering', test: 'BUITEMS test', url: 'https://www.buitms.edu.pk/' },
  { name: 'UMT', city: 'Lahore', type: 'Private', field: 'General', test: 'UMT test', url: 'https://www.umt.edu.pk/' },
  { name: 'UCP', city: 'Lahore', type: 'Private', field: 'General', test: 'UCP test', url: 'https://ucp.edu.pk/' },
  { name: 'Riphah International University', city: 'Islamabad', type: 'Private', field: 'Medical', test: 'MDCAT / own test', url: 'https://www.riphah.edu.pk/' },
  { name: 'Forman Christian College', city: 'Lahore', type: 'Private', field: 'General', test: 'FCCU test', url: 'https://www.fccollege.edu.pk/' },
  { name: 'University of Health Sciences', city: 'Lahore', type: 'Public', field: 'Medical', test: 'MDCAT (Punjab admissions)', url: 'https://uhs.edu.pk/' },
  { name: 'King Edward Medical University', city: 'Lahore', type: 'Public', field: 'Medical', test: 'MDCAT', url: 'https://kemu.edu.pk/' },
  { name: 'Khyber Medical University', city: 'Peshawar', type: 'Public', field: 'Medical', test: 'MDCAT (KP admissions)', url: 'https://www.kmu.edu.pk/' },
  { name: 'Dow University of Health Sciences', city: 'Karachi', type: 'Public', field: 'Medical', test: 'MDCAT', url: 'https://www.duhs.edu.pk/' },
  { name: 'Aga Khan University', city: 'Karachi', type: 'Private', field: 'Medical', test: 'AKU test', url: 'https://www.aku.edu/' },
  { name: 'University of Agriculture Faisalabad', city: 'Faisalabad', type: 'Public', field: 'Agriculture', test: 'Merit / test', url: 'https://www.uaf.edu.pk/' },
  { name: 'Allama Iqbal Open University', city: 'Islamabad (distance)', type: 'Public', field: 'Distance', test: 'No test (most)', url: 'https://www.aiou.edu.pk/' },
  { name: 'Virtual University', city: 'Online', type: 'Public', field: 'Distance', test: 'No test (most)', url: 'https://www.vu.edu.pk/' },
];

export const UNI_FIELDS = ['Engineering', 'Medical', 'General', 'Business', 'Agriculture', 'Distance'] as const;

/** HEC's recognised-university list for anything not listed above. */
export const HEC_RECOGNISED = 'https://www.hec.gov.pk/english/universities/pages/recognised.aspx';
