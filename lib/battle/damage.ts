/** Damage, type multiplier and rewards (GDD §5.2, §5.3). Tuning lives here, in one place. */
import type { TestGroup } from "../content/types";
import { TEST_GROUPS } from "../content/types";

export const FOE_MAX_HP = 100;
export const MAX_HEARTS = 5;
export const HINT_PENALTY = 0.15;
export const PLAN_BONUS = 1.1;
export const RUN_CHIP = 0.25;

export type Effectiveness = "super" | "neutral" | "weak";
export const MULTIPLIER: Record<Effectiveness, number> = { super: 1.5, neutral: 1, weak: 0.5 };

/**
 * Judge a strategy choice against a problem's patterns.
 * `patterns[0]` is primary. A pattern listed for the problem is super effective;
 * a pattern in `workable` (valid but suboptimal) is neutral; anything else is weak.
 * No strategy chosen (skipped) is neutral: skipping forfeits the bonus but never punishes.
 */
export function effectiveness(chosen: string | null, patterns: readonly string[], workable: readonly string[] = []): Effectiveness {
  if (chosen === null) return "neutral";
  if (patterns.includes(chosen)) return "super";
  if (workable.includes(chosen)) return "neutral";
  return "weak";
}

/** Rust (GDD §6.2) caps the multiplier at 1.25 until the item is reviewed. */
export function applyRust(mult: number, rusty: boolean): number {
  return rusty ? Math.min(mult, 1.25) : mult;
}

/** 1.1 under par, 1.0 under twice par, else 0.9. */
export function timeBonus(seconds: number, parSeconds: number): number {
  if (seconds <= parSeconds) return 1.1;
  if (seconds <= 2 * parSeconds) return 1;
  return 0.9;
}

export interface DamageInput {
  /** Which hidden groups the submission fully passed. */
  passed: Partial<Record<TestGroup, boolean>>;
  weights: Record<TestGroup, number>;
  multiplier: number;
  hintsUsed: number;
  seconds: number;
  parSeconds: number;
  /** A correct Plan step gives +10 %. */
  planCorrect?: boolean;
}

/** Foe HP lost by one submission, as a whole number in 0..FOE_MAX_HP. Full AC always returns FOE_MAX_HP. */
export function submitDamage(i: DamageInput): number {
  const total = TEST_GROUPS.reduce((s, g) => s + i.weights[g], 0);
  if (total <= 0) return 0;
  const all = TEST_GROUPS.every((g) => i.passed[g]);
  if (all) return FOE_MAX_HP; // correctness is never punished
  const got = TEST_GROUPS.reduce((s, g) => s + (i.passed[g] ? i.weights[g] : 0), 0);
  const hintFactor = Math.max(0, 1 - HINT_PENALTY * i.hintsUsed);
  const raw = (got / total) * FOE_MAX_HP * i.multiplier * hintFactor * timeBonus(i.seconds, i.parSeconds) * (i.planCorrect ? PLAN_BONUS : 1);
  // A partial pass can chip the foe to the brink but never finish it: only a full AC defeats it.
  return Math.max(0, Math.min(FOE_MAX_HP - 1, Math.round(raw)));
}

export interface RewardInput {
  difficulty: "E" | "M" | "H";
  multiplier: number;
  heartsLeft: number;
  hintsUsed: number;
  assisted: boolean;
  seconds: number;
  parSeconds: number;
}

const BASE_XP = { E: 30, M: 70, H: 140 } as const;

/** XP and Bits for a win. Multiplier, hearts and speed shape the reward, not whether you win. */
export function rewards(r: RewardInput): { xp: number; bits: number } {
  const heartsBonus = 0.8 + 0.05 * Math.max(0, Math.min(MAX_HEARTS, r.heartsLeft));
  const hintFactor = Math.max(0.4, 1 - HINT_PENALTY * r.hintsUsed);
  const xp = Math.round(BASE_XP[r.difficulty] * r.multiplier * heartsBonus * hintFactor * timeBonus(r.seconds, r.parSeconds) * (r.assisted ? 0.5 : 1));
  return { xp, bits: Math.max(1, Math.round(xp / 5)) };
}
