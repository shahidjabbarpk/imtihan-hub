import { useState } from 'react';
import { Platform, View } from 'react-native';
import mobileAds, { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { FULLSCREEN_GAP_MS, PROD_AD_UNITS } from './config';
import { useApp } from './store';

const prod = Platform.OS === 'ios' ? PROD_AD_UNITS.ios : PROD_AD_UNITS.android;
const useTest = __DEV__ || !prod.banner;
const UNITS = {
  banner: useTest ? TestIds.ADAPTIVE_BANNER : prod.banner,
  interstitial: useTest ? TestIds.INTERSTITIAL : prod.interstitial,
};

let started = false;
export function startAds() {
  if (started) return;
  started = true;
  mobileAds().initialize().then(() => loadInterstitial()).catch(() => {});
}

// ---------------------------------------------------------------- full-screen
// Ads follow what the student does, never a clock:
//  - one before a quiz / mock test starts and one after its result is on screen
//  - opening official links (results, roll no slips, past papers): 1st open ad, 2nd free, 3rd ad...
// Safety nets: nothing in the first 30 s after launch and never two within FULLSCREEN_GAP_MS.

const LAUNCH_GRACE_MS = 30 * 1000;
const launchedAt = Date.now();
let interstitial: InterstitialAd | null = null;
let ready = false;
let afterAd: (() => void) | null = null;

function loadInterstitial() {
  interstitial = InterstitialAd.createForAdRequest(UNITS.interstitial);
  ready = false;
  interstitial.addAdEventListener(AdEventType.LOADED, () => { ready = true; });
  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    afterAd?.();
    afterAd = null;
    loadInterstitial();
  });
  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    ready = false;
    afterAd?.(); // a failing ad must never swallow what the student tapped
    afterAd = null;
    setTimeout(loadInterstitial, 60_000);
  });
  interstitial.load();
}

function show(then?: () => void): boolean {
  const now = Date.now();
  if (!interstitial || !ready || now - launchedAt < LAUNCH_GRACE_MS || now - useApp.getState().lastInterstitial < FULLSCREEN_GAP_MS) return false;
  useApp.getState().set({ lastInterstitial: now });
  ready = false;
  afterAd = then ?? null;
  interstitial.show().catch(() => {
    afterAd = null;
    then?.();
    loadInterstitial();
  });
  return true;
}

/** An ad right now if the safety nets allow it (after a quiz result). */
export function maybeShowInterstitial() {
  show();
}

/** Runs `then` after an ad if one may show now, otherwise straight away (before a quiz). */
export function withAd(then: () => void) {
  if (!show(then)) then();
}

let freeOpens = 1; // starts "due"
/** Every other official-link open gets an ad. */
export function adOnOpen(then: () => void) {
  if (freeOpens >= 1 && show(then)) {
    freeOpens = 0;
    return;
  }
  freeOpens += 1;
  then();
}

// ---------------------------------------------------------------- banner

export function BottomBanner() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd unitId={UNITS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} onAdFailedToLoad={() => setFailed(true)} />
    </View>
  );
}
