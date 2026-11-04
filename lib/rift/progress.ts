/** Persisting Daily Rift progress in the core save (flags + profile + mastery): pure and idempotent. */
import { applyAttempt, emptyMastery, markSeen, type SolveEvent } from "../srs";
import type { CoreSave } from "../save/schema";
import { advanceStreak, clearedFromMask, maskWith, riftFlagKey, riftReward, type RiftPlan, type RiftReward } from "./rift";

export const riftPaidKey = (day: string): string => `rift:${day}:paid`;

export function clearedRooms(core: CoreSave, day: string): number[] {
  const v = core.flags[riftFlagKey(day)];
  return clearedFromMask(typeof v === "number" ? v : 0);
}

/** Marks a room cleared. Idempotent. */
export function markRoomCleared(core: CoreSave, day: string, room: number): CoreSave {
  const v = core.flags[riftFlagKey(day)];
  const mask = maskWith(typeof v === "number" ? v : 0, room);
  return { ...core, flags: { ...core.flags, [riftFlagKey(day)]: mask } };
}

/** Feeds a problem attempt to the SRS state of that problem. */
export function recordProblemAttempt(core: CoreSave, id: string, ev: SolveEvent): CoreSave {
  const prev = core.mastery[id] ?? markSeen(emptyMastery());
  return { ...core, mastery: { ...core.mastery, [id]: applyAttempt(prev, ev) } };
}

/** A room counts when it has no items (skipped) or has been cleared. */
export function riftComplete(plan: RiftPlan, cleared: readonly number[]): boolean {
  return plan.rooms.every((r, i) => r.optional || r.items.length === 0 || cleared.includes(i));
}

/**
 * Pays the day's reward once: advances the streak, adds bits and xp. Returns the new save and the reward paid
 * (null when nothing is owed: unfinished, or already paid today).
 */
export function claimRift(core: CoreSave, plan: RiftPlan): { core: CoreSave; reward: RiftReward | null } {
  const cleared = clearedRooms(core, plan.day);
  if (core.flags[riftPaidKey(plan.day)] === true || !riftComplete(plan, cleared)) return { core, reward: null };
  const s = advanceStreak({ streakDays: core.profile.streakDays, lastPlayedDay: core.profile.lastPlayedDay }, plan.day);
  const reward = riftReward(plan, cleared, s.streakDays);
  return {
    reward,
    core: {
      ...core,
      profile: { ...core.profile, ...s, bits: core.profile.bits + reward.bits, xp: core.profile.xp + reward.xp },
      flags: { ...core.flags, [riftPaidKey(plan.day)]: true },
    },
  };
}
