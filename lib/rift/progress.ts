/**
 * Rift progress, streak and rewards (GDD §6.3). Lives in the core save: the streak in `profile`, the day's
 * progress in `flags` (`rift:day`, `rift:cleared` bitmask, `rift:done`). Pure and idempotent: no schema change.
 */
import type { CoreSave, Profile } from "../save/schema";
import { daysBetween } from "./day";
import { ROOM_ORDER, type RiftPlan } from "./types";

export const FLAG_DAY = "rift:day";
export const FLAG_CLEARED = "rift:cleared";
export const FLAG_DONE = "rift:done";

/** Bits per room, in room order. The vault pays most because it is the hardest. */
export const ROOM_BITS = [10, 10, 15, 15, 30] as const;
/** Extra Bits for clearing the four required rooms, plus 5 per streak day (capped at 7 days). */
export const COMPLETION_BITS = 20;
export const STREAK_BITS_PER_DAY = 5;
export const STREAK_BITS_CAP_DAYS = 7;
export const ROOM_XP = 20;
/** Correct answers needed (out of the five) to clear the Blitz Gate: it tests recognition, so guessing should not pass. */
export const BLITZ_PASS = 3;

export interface RiftReward {
  bits: number;
  xp: number;
}

const ZERO: RiftReward = { bits: 0, xp: 0 };

/** Bitmask of rooms cleared today (0 when the saved day is not `day`). */
export function clearedMask(core: Pick<CoreSave, "flags">, day: string): number {
  if (core.flags[FLAG_DAY] !== day) return 0;
  const m = core.flags[FLAG_CLEARED];
  return typeof m === "number" && Number.isInteger(m) && m >= 0 && m < 1 << ROOM_ORDER.length ? m : 0;
}

export const isRoomCleared = (core: Pick<CoreSave, "flags">, day: string, index: number): boolean => (clearedMask(core, day) & (1 << index)) !== 0;

/** Empty rooms are open for free: they count as cleared without paying. */
export function effectiveMask(core: Pick<CoreSave, "flags">, plan: RiftPlan): number {
  let m = clearedMask(core, plan.day);
  for (const r of plan.rooms) if (r.empty) m |= 1 << r.index;
  return m;
}

/** The four required rooms are all cleared (the optional vault does not gate the day). */
export function isRiftComplete(core: Pick<CoreSave, "flags">, plan: RiftPlan): boolean {
  const m = effectiveMask(core, plan);
  return plan.rooms.every((r) => r.optional || (m & (1 << r.index)) !== 0);
}

/** The streak to show on `today`: it silently reads 0 once a day has been skipped. Nothing is ever deducted. */
export function currentStreak(profile: Pick<Profile, "streakDays" | "lastPlayedDay">, today: string): number {
  const gap = daysBetween(profile.lastPlayedDay, today);
  return Number.isFinite(gap) && gap >= 0 && gap <= 1 ? profile.streakDays : 0;
}

export function completionReward(streakDays: number): RiftReward {
  const bonus = COMPLETION_BITS + STREAK_BITS_PER_DAY * Math.min(streakDays, STREAK_BITS_CAP_DAYS);
  return { bits: bonus, xp: ROOM_XP * 2 };
}

export interface ClearResult {
  core: CoreSave;
  reward: RiftReward;
  /** True when this clear completed the required rooms (streak advanced, completion bonus paid). */
  completed: boolean;
}

/**
 * Marks one room cleared and pays it. Clearing a room twice, an empty room, or a room of another day pays nothing.
 * Completing the four required rooms advances the streak once per day and pays the completion bonus.
 */
export function clearRoom(core: CoreSave, plan: RiftPlan, roomIndex: number): ClearResult {
  const room = plan.rooms[roomIndex];
  if (!room || room.empty || isRoomCleared(core, plan.day, roomIndex)) return { core, reward: ZERO, completed: false };
  const mask = clearedMask(core, plan.day) | (1 << roomIndex);
  let next: CoreSave = { ...core, flags: { ...core.flags, [FLAG_DAY]: plan.day, [FLAG_CLEARED]: mask } };
  let reward: RiftReward = { bits: ROOM_BITS[roomIndex] ?? 0, xp: ROOM_XP };
  let completed = false;
  if (isRiftComplete(next, plan) && next.flags[FLAG_DONE] !== plan.day) {
    const gap = daysBetween(next.profile.lastPlayedDay, plan.day);
    const streak = gap === 1 ? next.profile.streakDays + 1 : gap === 0 ? Math.max(1, next.profile.streakDays) : 1;
    const bonus = completionReward(streak);
    reward = { bits: reward.bits + bonus.bits, xp: reward.xp + bonus.xp };
    next = { ...next, flags: { ...next.flags, [FLAG_DONE]: plan.day }, profile: { ...next.profile, streakDays: streak, lastPlayedDay: plan.day } };
    completed = true;
  }
  const profile = { ...next.profile, bits: next.profile.bits + reward.bits, xp: next.profile.xp + reward.xp };
  return { core: { ...next, profile }, reward, completed };
}
