/** Rift streak (GDD §6.3): consecutive calendar days with a completed Rift room. No punishment beyond losing the counter. */
import type { Profile } from "../save/schema";
import { daysBetween } from "./day";

export interface StreakState {
  streakDays: number;
  /** Day of the last streak-counting activity, "" if none. */
  lastPlayedDay: string;
}

/** Records activity on `today`. Same day: unchanged. Next day: +1. Any gap (or a clock set back): restarts at 1. */
export function recordActivity(s: StreakState, today: string): StreakState {
  if (s.lastPlayedDay === today) return s;
  const gap = s.lastPlayedDay ? daysBetween(s.lastPlayedDay, today) : NaN;
  const streakDays = gap === 1 ? s.streakDays + 1 : 1;
  return { streakDays, lastPlayedDay: today };
}

/** The streak to display on `today`: a streak lapses to 0 once a whole day was missed (it is not yet 0 on the day itself). */
export function visibleStreak(s: StreakState, today: string): number {
  if (!s.lastPlayedDay) return 0;
  const gap = daysBetween(s.lastPlayedDay, today);
  return gap === 0 || gap === 1 ? s.streakDays : 0;
}

export const applyStreak = (p: Profile, today: string): Profile => ({ ...p, ...recordActivity(p, today) });
