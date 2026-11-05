import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform, Share } from 'react-native';
import { adOnOpen } from './ads';
import { STORE_URL } from './config';

/** Opens an official page in an in-app browser tab (every other open may show an ad first). */
export function openOfficial(url: string, withAd = true) {
  const go = () => {
    if (Platform.OS === 'web') {
      globalThis.open?.(url, '_blank');
      return;
    }
    WebBrowser.openBrowserAsync(url, { toolbarColor: '#1D4ED8', showTitle: true, enableBarCollapsing: true })
      .catch(() => Linking.openURL(url).catch(() => {}));
  };
  if (withAd) adOnOpen(go);
  else go();
}

export function shareApp(text?: string) {
  const msg = `${text ?? 'Matric, Inter, MDCAT, ECAT, NTS, CSS aur PPSC ki tayari – MCQs, mock tests, results, roll no slips aur past papers ek hi app mein:'}\n${STORE_URL}`;
  Share.share({ message: msg }).catch(() => {});
}
