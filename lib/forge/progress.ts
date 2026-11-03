import { FORGE_TIERS, type ForgeTier, type ScrollProgress } from "./types";

export const TRACE_PASS_MIN = 4; // of 5 questions
export const INGRAIN_GAP_MS = 2 * 24 * 3600 * 1000; // two Blank passes under par at least two days apart

export const emptyProgress = (): ScrollProgress => ({ passed: [], blankRuns: [] });

/** A tier opens once every earlier tier has passed. */
export function isUnlocked(p: ScrollProgress, tier: ForgeTier): boolean {
  const i = FORGE_TIERS.indexOf(tier);
  return FORGE_TIERS.slice(0, i).every((t) => p.passed.includes(t));
}

export function tracePasses(correct: number): boolean {
  return correct >= TRACE_PASS_MIN;
}

/** Record a pass (idempotent). Blank passes remember their time for the Ingrained rule. */
export function recordPass(p: ScrollProgress, tier: ForgeTier, opts: { seconds?: number; at: number }): ScrollProgress {
  if (!isUnlocked(p, tier)) return p;
  const passed = p.passed.includes(tier) ? p.passed : [...p.passed, tier];
  const blankRuns = tier === "blank" && opts.seconds !== undefined ? [...p.blankRuns, { seconds: opts.seconds, at: opts.at }] : p.blankRuns;
  return { passed, blankRuns };
}

/** Ingrained = Blank passed under par on two spaced occasions (GDD §6.4). */
export function isIngrained(p: ScrollProgress, parSeconds: number): boolean {
  const fast = p.blankRuns.filter((r) => r.seconds <= parSeconds).map((r) => r.at).sort((a, b) => a - b);
  for (let i = 0; i < fast.length; ++i) for (let j = i + 1; j < fast.length; ++j) if (fast[j] - fast[i] >= INGRAIN_GAP_MS) return true;
  return false;
}

export type ScrollStatus = "new" | "forging" | "inscribed" | "ingrained";

/** Inscribed = Blank passed once (the move can be equipped, GDD §3); Ingrained needs the spaced fast passes. */
export function scrollStatus(p: ScrollProgress, parSeconds: number): ScrollStatus {
  if (isIngrained(p, parSeconds)) return "ingrained";
  if (p.passed.includes("blank")) return "inscribed";
  return p.passed.length > 0 ? "forging" : "new";
}
