import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import * as Notifications from 'expo-notifications';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { startAds } from '@/lib/ads';
import { refreshNews } from '@/lib/news';
import { useApp, waitForHydration } from '@/lib/store';
import { useTheme } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useNotificationTaps() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const open = (r: Notifications.NotificationResponse | null) => {
      const screen = r?.notification.request.content.data?.screen;
      if (r) Notifications.clearLastNotificationResponse();
      if (typeof screen === 'string') router.push(screen as any);
    };
    Notifications.getLastNotificationResponseAsync().then(open).catch(() => {});
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, []);
}

export default function RootLayout() {
  const c = useTheme();
  const [fonts] = useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
    NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold,
  });
  const [hydrated, setHydrated] = useState(useApp.persist.hasHydrated());
  const onboarded = useApp((s) => s.onboarded);
  const segments = useSegments();
  useNotificationTaps();

  useEffect(() => { SystemUI.setBackgroundColorAsync(c.bg).catch(() => {}); }, [c.bg]);
  useEffect(() => { if (fonts) SplashScreen.hideAsync().catch(() => {}); }, [fonts]);
  useEffect(() => {
    waitForHydration().then(() => {
      setHydrated(true);
      refreshNews().catch(() => {});
      if (Platform.OS !== 'web') startAds();
    });
  }, []);

  const ready = fonts && hydrated;
  useEffect(() => {
    if (ready && !onboarded && segments[0] !== 'onboarding') router.replace('/onboarding');
  }, [ready, onboarded, segments]);

  if (!ready) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="quiz" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
