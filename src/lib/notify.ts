import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Countdown } from './store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

const DAILY_ID = 'daily-study';

async function permitted(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('study', { name: 'Study reminders', importance: Notifications.AndroidImportance.HIGH });
  }
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Daily "time to practise" reminder at the chosen time. Returns false if permission was refused. */
export async function setDailyReminder(on: boolean, hour: number, minute: number): Promise<boolean> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_ID).catch(() => {});
  if (!on) return true;
  if (!(await permitted())) return false;
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_ID,
    content: { title: 'Aaj ki practice baqi hai 📚', body: 'Daily Quiz ke 10 MCQs solve karein aur apni streak qaim rakhein.', data: { screen: '/quiz?mode=daily' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'study' },
  });
  return true;
}

/** Reminders 7 days, 1 day and the morning of an exam the student added a countdown for. */
export async function scheduleCountdown(c: Countdown): Promise<void> {
  if (!(await permitted())) return;
  const day = Date.parse(`${c.date}T08:00:00+05:00`);
  const plan: [number, string][] = [[7, '7 din baqi'], [1, 'Kal hai'], [0, 'Aaj hai – best of luck!']];
  for (const [d, label] of plan) {
    const when = day - d * 86_400_000;
    if (when <= Date.now()) continue;
    await Notifications.scheduleNotificationAsync({
      identifier: `cd-${c.id}-${d}`,
      content: { title: `${c.name}: ${label}`, body: 'Revision karein aur roll number slip / CNIC tayar rakhein.', data: { screen: '/tools/countdown' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(when), channelId: 'study' },
    }).catch(() => {});
  }
}

export async function cancelCountdown(id: string) {
  for (const d of [7, 1, 0]) await Notifications.cancelScheduledNotificationAsync(`cd-${id}-${d}`).catch(() => {});
}

export const NOTIFY_SUPPORTED = true;
