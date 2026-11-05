// Web preview: AdMob is native-only, so ads do nothing here.
export function startAds() {}
export function maybeShowInterstitial() {}
export function withAd(then: () => void) {
  then();
}
export function adOnOpen(then: () => void) {
  then();
}
export function withRewarded(_what: string, then: () => void) {
  then();
}
export function BottomBanner() {
  return null;
}
