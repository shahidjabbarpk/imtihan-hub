// Web preview: no local notifications.
import type { Countdown } from './store';

export async function setDailyReminder(_on: boolean, _h: number, _m: number): Promise<boolean> {
  return false;
}
export async function scheduleCountdown(_c: Countdown): Promise<void> {}
export async function cancelCountdown(_id: string): Promise<void> {}
export const NOTIFY_SUPPORTED = false;
