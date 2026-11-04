/** Rift progress and rewards. Stored in the core save's `flags` (no schema change); pure and idempotent. */
import type { CoreSave } from "../save/schema";
import { ROOM_KINDS, type RiftPlan, type RoomKind } from "./plan";
import { applyStreak, visibleStreak } from "./streak";

export const roomsFlag = (day: string): string => `rift:${day}:rooms`;
export const claimedFlag = (day: string): string => `rift:${day}:claimed`;

/** Rooms with nothing to do are skipped, so they never block completion. */
export const activeRooms = (plan: RiftPlan) => plan.rooms.filter((r) => r.items.length > 0);

export function completedRooms(core: Pick<CoreSave, "flags">, day: string): RoomKind[] {
  const raw = core.flags[roomsFlag(day)];
  if (typeof raw !== "string") return [];
  return raw.split(",").filter((k): k is RoomKind => (ROOM_KINDS as readonly string[]).includes(k));
}

/** Marks a room cleared on `plan.day` and counts the day for the streak. Re-clearing changes nothing. */
export function completeRoom(core: CoreSave, plan: RiftPlan, kind: RoomKind): CoreSave {
  const room = plan.rooms.find((r) => r.kind === kind);
  if (!room || room.items.length === 0) return core;
  const done = completedRooms(core, plan.day);
  if (done.includes(kind)) return core;
  const next = [...done, kind].sort((a, b) => ROOM_KINDS.indexOf(a) - ROOM_KINDS.indexOf(b));
  return {
    ...core,
    profile: applyStreak(core.profile, plan.day),
    flags: { ...core.flags, [roomsFlag(plan.day)]: next.join(",") },
  };
}

export const BITS_PER_ROOM = 10;
export const FULL_CLEAR_BONUS = 20;
export const BONUS_ROOM_BITS = 15;
export const STREAK_BITS_PER_DAY = 2;
export const STREAK_BITS_CAP_DAYS = 7;
export const XP_PER_ROOM = 25;

export interface RiftReward {
  bits: number;
  xp: number;
}

/** Reward for the rooms cleared so far. Scales with completion; the streak adds a small capped bonus per cleared room. */
export function rewardFor(plan: RiftPlan, done: readonly RoomKind[], streakDays: number): RiftReward {
  let bits = 0;
  let xp = 0;
  const streakBonus = STREAK_BITS_PER_DAY * Math.min(Math.max(streakDays, 0), STREAK_BITS_CAP_DAYS);
  for (const room of activeRooms(plan)) {
    if (!done.includes(room.kind)) continue;
    bits += (room.optional ? BONUS_ROOM_BITS : BITS_PER_ROOM) + streakBonus;
    xp += XP_PER_ROOM;
  }
  const required = activeRooms(plan).filter((r) => !r.optional);
  if (required.length > 0 && required.every((r) => done.includes(r.kind))) bits += FULL_CLEAR_BONUS;
  return { bits, xp };
}

/**
 * Pays out the day's reward once. The amount is computed for the rooms cleared at claim time, so claim after
 * the player is done; a second claim on the same day is a no-op (no farming by clearing rooms one at a time).
 */
export function claimReward(core: CoreSave, plan: RiftPlan): { core: CoreSave; reward: RiftReward } {
  if (core.flags[claimedFlag(plan.day)] === true) return { core, reward: { bits: 0, xp: 0 } };
  const done = completedRooms(core, plan.day);
  const reward = rewardFor(plan, done, visibleStreak(core.profile, plan.day));
  if (reward.bits === 0 && reward.xp === 0) return { core, reward };
  return {
    reward,
    core: {
      ...core,
      profile: { ...core.profile, bits: core.profile.bits + reward.bits, xp: core.profile.xp + reward.xp },
      flags: { ...core.flags, [claimedFlag(plan.day)]: true },
    },
  };
}
