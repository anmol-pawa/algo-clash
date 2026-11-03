/** Pure, immutable gym flow (GDD §5.5). The coding battles themselves reuse `lib/battle`. */
import { FOE_MAX_HP } from "../battle/damage";
import { makeRng } from "../content/rng";
import type { BlitzItem, GymDef, GymState } from "./types";

export const SHIELD_START = 4;
export const SHIELD_MAX = 6;
/** Foe HP lost at the start of the core battle for each shield point broken below the start value. */
export const HEAD_START_PER_POINT = 8;
export const SHARDS_PER_GYM = 1;

export class GymError extends Error {}

export function startGym(def: GymDef): GymState {
  if (def.blitz.length === 0) throw new GymError("a gym needs blitz items");
  return { gymId: def.id, phase: "blitz", blitzIndex: 0, shield: SHIELD_START, answers: [], coreFaints: 0, signatureFaints: 0, reward: null };
}

/**
 * Answer the current blitz item. `choice === null` is a timeout/skip. An answer after the time limit is a miss
 * even if it is right, which is the point of a blitz: recognition on sight.
 */
export function answerBlitz(def: GymDef, s: GymState, choice: string | null, seconds: number): GymState {
  if (s.phase !== "blitz") throw new GymError(`not in the blitz (phase "${s.phase}")`);
  const item = def.blitz[s.blitzIndex];
  if (choice !== null && !item.options.includes(choice)) throw new GymError(`"${choice}" is not an option of ${item.id}`);
  const correct = choice === item.answer && seconds <= def.blitzSeconds;
  const shield = correct ? Math.max(0, s.shield - 1) : Math.min(SHIELD_MAX, s.shield + 1);
  const blitzIndex = s.blitzIndex + 1;
  const answers = [...s.answers, { itemId: item.id, choice, seconds, correct }];
  return { ...s, shield, blitzIndex, answers, phase: blitzIndex >= def.blitz.length ? "core" : "blitz" };
}

export const blitzCorrect = (s: GymState): number => s.answers.filter((a) => a.correct).length;

/** The foe's starting HP in the core battle: every shield point broken below the start value takes a bite. */
export function coreFoeHp(s: GymState): number {
  return FOE_MAX_HP - HEAD_START_PER_POINT * Math.max(0, SHIELD_START - s.shield);
}

export type BattleResult = "won" | "fainted" | "retreated";

/** Report the result of the core (phase 2) or signature (phase 3) coding battle. A faint allows a retry of that phase. */
export function battleResult(def: GymDef, s: GymState, result: BattleResult): GymState {
  if (s.phase !== "core" && s.phase !== "signature") throw new GymError(`no battle in phase "${s.phase}"`);
  if (result === "retreated") return { ...s, phase: "abandoned" };
  if (result === "fainted") {
    return s.phase === "core" ? { ...s, coreFaints: s.coreFaints + 1 } : { ...s, signatureFaints: s.signatureFaints + 1 };
  }
  if (s.phase === "core") return { ...s, phase: "signature" };
  return { ...s, phase: "won", reward: { badge: def.badge.id, shards: SHARDS_PER_GYM } };
}

/** Option order shown to the player: a seeded shuffle, so the answer is not always in the same slot and a retry sees the same order. */
export function shuffledOptions(item: BlitzItem, seed: number): string[] {
  let h = seed >>> 0;
  for (const ch of item.id) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
  return makeRng(h).shuffle(item.options);
}
