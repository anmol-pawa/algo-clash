/** Persisting gym results in the core save's `flags` (no schema change): pure and idempotent. */
import type { CoreSave } from "../save/schema";
import type { GymDef } from "./types";
import { SHARDS_PER_GYM } from "./machine";

export const badgeFlag = (badgeId: string): string => `badge:${badgeId}`;
export const gymWonFlag = (gymId: string): string => `gym:${gymId}:won`;
export const SHARDS_FLAG = "compilerShards";
/** Set by the first gym win: the starter has evolved Arrayling → Vectorling (GDD §5.5). */
export const EVOLVED_FLAG = "evolved:arrayling";

export const isEvolved = (core: CoreSave): boolean => core.flags[EVOLVED_FLAG] === true;

export const hasBadge = (core: CoreSave, def: GymDef): boolean => core.flags[badgeFlag(def.badge.id)] === true;

/** Records the badge and the Compiler Shard. A rematch win never pays the shard twice. */
export function applyGymWin(core: CoreSave, def: GymDef): CoreSave {
  if (hasBadge(core, def)) return core;
  const shards = typeof core.flags[SHARDS_FLAG] === "number" ? (core.flags[SHARDS_FLAG] as number) : 0;
  return { ...core, flags: { ...core.flags, [badgeFlag(def.badge.id)]: true, [gymWonFlag(def.id)]: true, [SHARDS_FLAG]: shards + SHARDS_PER_GYM, [EVOLVED_FLAG]: true } };
}

/** Whole seconds left on a blitz item (never negative). */
export function blitzSecondsLeft(startedAtMs: number, nowMs: number, limitSeconds: number): number {
  return Math.max(0, Math.ceil(limitSeconds - (nowMs - startedAtMs) / 1000));
}
