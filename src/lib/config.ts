/**
 * Live news feed (results announced, roll no slips out, admission open...). A plain JSON file
 * on any static host: data/news.json in the GitHub repo is the default. If it can't be reached
 * the app shows the bundled copy (src/data/news.ts), so nothing breaks offline.
 */
export const NEWS_URL =
  process.env.EXPO_PUBLIC_NEWS_URL ?? 'https://raw.githubusercontent.com/shahidjabbarpk/imtihan-hub/main/data/news.json';

/** Online content (new MCQs, past papers, Urdu, test-pattern updates) - see docs/admin.html. */
export const CONTENT_URL =
  process.env.EXPO_PUBLIC_CONTENT_URL ?? 'https://raw.githubusercontent.com/shahidjabbarpk/imtihan-hub/main/data/content.json';

export const STORE_URL = 'https://play.google.com/store/apps/details?id=com.imtihanhub.mza';
export const PRIVACY_URL = 'https://shahidjabbarpk.github.io/imtihan-hub/privacy.html';

/** Safety floor between any two full-screen ads; the normal rhythm is per quiz (see lib/ads.tsx). */
export const FULLSCREEN_GAP_MS = 60 * 1000;

// AdMob: create the app "Imtihan Hub" under shahidjabbarpk@gmail.com, then paste the 3 unit ids here
// and the app id into app.json (react-native-google-mobile-ads androidAppId). Empty = Google test ads.
export const PROD_AD_UNITS = {
  android: { banner: '', interstitial: '', rewarded: '' },
  ios: { banner: '', interstitial: '', rewarded: '' },
};

/**
 * Leaderboard backend: Firestore of the shahidjabbarpk Firebase project "pakjobs-daily-sj"
 * (collections imtihan_points / imtihan_grand; rules live in the pakjobs-daily repo, firebase/).
 * Students are anonymous Firebase users; only the display name they type and their scores are stored.
 */
export const FIREBASE_CONFIG: {
  apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string;
} | null = {
  apiKey: 'AIzaSyDgReqSEL_iUg4gbza4hToZ6Ju9OQbF9xo',
  authDomain: 'pakjobs-daily-sj.firebaseapp.com',
  projectId: 'pakjobs-daily-sj',
  storageBucket: 'pakjobs-daily-sj.firebasestorage.app',
  messagingSenderId: '349850513796',
  appId: '1:349850513796:web:50e8ab7215c29f5632add1',
};
