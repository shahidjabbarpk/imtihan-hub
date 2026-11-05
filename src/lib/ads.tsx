import { useState } from 'react';
import { Platform, View } from 'react-native';
import { Alert } from 'react-native';
import mobileAds, { AdEventType, BannerAd, BannerAdSize, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { FULLSCREEN_GAP_MS, PROD_AD_UNITS } from './config';
import { useApp } from './store';

const prod = Platform.OS === 'ios' ? PROD_AD_UNITS.ios : PROD_AD_UNITS.android;
const useTest = __DEV__ || !prod.banner;
const UNITS = {
  banner: useTest ? TestIds.ADAPTIVE_BANNER : prod.banner,
  interstitial: useTest ? TestIds.INTERSTITIAL : prod.interstitial,
  rewarded: useTest || !prod.rewarded ? TestIds.REWARDED : prod.rewarded,
};

let started = false;
export function startAds() {
  if (started) return;
  started = true;
  mobileAds().initialize().then(() => { loadInterstitial(); loadRewarded(); }).catch(() => {});
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

// ---------------------------------------------------------------- rewarded
// "Watch a short video to unlock": full-length papers, PDF papers and the grand-test answer key.
// If no video is available the student still gets the feature - an ad must never block studying.

let rewarded: RewardedAd | null = null;
let rewardedReady = false;

function loadRewarded() {
  rewarded = RewardedAd.createForAdRequest(UNITS.rewarded);
  rewardedReady = false;
  rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => { rewardedReady = true; });
  rewarded.addAdEventListener(AdEventType.ERROR, () => { rewardedReady = false; setTimeout(loadRewarded, 60_000); });
  rewarded.load();
}

/** Asks to watch a rewarded video, then runs `then` (also when no video is available). */
export function withRewarded(what: string, then: () => void) {
  if (!rewarded || !rewardedReady) { then(); return; }
  Alert.alert('Unlock ' + what, 'Watch a short video to unlock this for free.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Watch video',
      onPress: () => {
        const ad = rewarded!;
        let earned = false;
        const offEarn = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => { earned = true; });
        const offClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
          offEarn(); offClose();
          useApp.getState().set({ lastInterstitial: Date.now() });
          loadRewarded();
          if (earned) then();
        });
        rewardedReady = false;
        ad.show().catch(() => { offEarn(); offClose(); loadRewarded(); then(); });
      },
    },
  ]);
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
