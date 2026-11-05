/** Rift progress in the core save (GDD §6.3): pure and idempotent. Cleared rooms and paid Bits live in `flags`. */
import type { CoreSave } from "../save/schema";
import { applyAttempt, emptyMastery } from "../srs";
import { advanceStreak, clearedFromMask, maskWith, playableRooms, riftFlagKey, riftReward, visibleStreak, type RiftPlan } from "./rift";

export const riftPaidKey = (day: string): string => `rift:${day}:paid`;

const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

export const clearedRooms = (core: Pick<CoreSave, "flags">, day: string): number[] => clearedFromMask(num(core.flags[riftFlagKey(day)]));

/** Every non-optional room that has items is cleared (empty rooms count as cleared). */
export function riftComplete(plan: RiftPlan, cleared: readonly number[]): boolean {
  const set = new Set(cleared);
  return plan.rooms.every((r, i) => r.optional || r.items.length === 0 || set.has(i));
}

/**
 * Marks a room cleared and pays the Bits and XP earned so far today (the difference from what was already paid, so a
 * replay pays nothing). The streak advances once, when the required rooms are all cleared.
 */
export function applyRoomClear(core: CoreSave, plan: RiftPlan, room: number): CoreSave {
  if (!plan.rooms[room] || !playableRooms(plan).includes(room)) return core;
  const mask = maskWith(num(core.flags[riftFlagKey(plan.day)]), room);
  const cleared = clearedFromMask(mask);
  let { streakDays, lastPlayedDay } = core.profile;
  if (riftComplete(plan, cleared)) ({ streakDays, lastPlayedDay } = advanceStreak({ streakDays, lastPlayedDay }, plan.day));
  const reward = riftReward(plan, cleared, visibleStreak({ streakDays, lastPlayedDay }, plan.day));
  const paid = num(core.flags[riftPaidKey(plan.day)]);
  const bits = Math.max(0, reward.bits - paid);
  return {
    ...core,
    profile: { ...core.profile, streakDays, lastPlayedDay, bits: core.profile.bits + bits, xp: core.profile.xp + bits * 2 },
    flags: { ...core.flags, [riftFlagKey(plan.day)]: mask, [riftPaidKey(plan.day)]: paid + bits },
  };
}

/** Feeds a Rift problem result into the SRS record. */
export function applyRiftProblem(core: CoreSave, id: string, solved: boolean, now: number, seconds: number, parSeconds: number, assisted = false): CoreSave {
  const prev = core.mastery[id] ?? emptyMastery();
  return { ...core, mastery: { ...core.mastery, [id]: applyAttempt(prev, { at: now, solved, assisted, seconds, parSeconds }) } };
}
