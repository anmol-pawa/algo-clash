/** Scaffolding modes (GDD §6.5): an honest difficulty dial. Pure rules, no DOM. */

export type ModeId = "guided" | "standard" | "interview" | "contest";

export interface ModeDef {
  id: ModeId;
  label: string;
  blurb: string;
  /** Editor autocomplete allowed. */
  autocomplete: boolean;
  /** Hint ladder available (spends Hint Tokens). */
  hints: boolean;
  /** Debug Lens / Compass purchasable items usable. */
  items: boolean;
  /** Max Run presses before only Submit remains; null = unlimited. */
  maxRuns: number | null;
  /** The player must write at least one own test before Submit. */
  ownTests: boolean;
  /** Timed (a countdown is shown; time over ends the fight). */
  timeLimitMultiplier: number | null;
  /** Guided wins never advance mastery (the solve is assisted). */
  guided: boolean;
  /** Multiplier on the mastery gain of an unassisted win (informational + par bonus). */
  masteryMultiplier: number;
}

export const MODES: readonly ModeDef[] = [
  { id: "guided", label: "Guided", blurb: "Approach card and unlimited hints. Does not count for mastery.", autocomplete: true, hints: true, items: false, maxRuns: null, ownTests: false, timeLimitMultiplier: null, guided: true, masteryMultiplier: 0 },
  { id: "standard", label: "Standard", blurb: "Signature only, autocomplete on, 3-hint ladder. Counts for mastery.", autocomplete: true, hints: true, items: true, maxRuns: null, ownTests: false, timeLimitMultiplier: null, guided: false, masteryMultiplier: 1 },
  { id: "interview", label: "Interview", blurb: "No autocomplete, 5 runs, write your own tests first. Counts x1.25.", autocomplete: false, hints: false, items: false, maxRuns: 5, ownTests: true, timeLimitMultiplier: null, guided: false, masteryMultiplier: 1.25 },
  { id: "contest", label: "Contest", blurb: "Interview rules plus a clock (2x par). Counts x1.25.", autocomplete: false, hints: false, items: false, maxRuns: 5, ownTests: true, timeLimitMultiplier: 2, guided: false, masteryMultiplier: 1.25 },
];

export const DEFAULT_MODE: ModeId = "standard";

export const modeDef = (id: string | undefined): ModeDef => MODES.find((m) => m.id === id) ?? MODES[1];

export const isModeId = (s: unknown): s is ModeId => MODES.some((m) => m.id === s);

/** Runs left before the cap (Infinity when unlimited). */
export function runsLeft(mode: ModeDef, runsUsed: number): number {
  return mode.maxRuns === null ? Infinity : Math.max(0, mode.maxRuns - runsUsed);
}

/** Seconds on the Contest clock for a problem, or null when the mode is untimed. Par 0 falls back to 10 minutes. */
export function clockSeconds(mode: ModeDef, parSeconds: number): number | null {
  if (mode.timeLimitMultiplier === null) return null;
  return Math.round((parSeconds > 0 ? parSeconds : 300) * mode.timeLimitMultiplier);
}

/** Submit is allowed once the mode's preconditions hold. Returns the reason when blocked. */
export function submitBlockedReason(mode: ModeDef, ownTestCount: number): string | null {
  if (mode.ownTests && ownTestCount < 1) return "Interview rules: add at least one test of your own first.";
  return null;
}

/** Whether a mode lets this kind of help be used. */
export function allows(mode: ModeDef, help: "hints" | "items"): boolean {
  return help === "hints" ? mode.hints : mode.items;
}

/**
 * Mastery effect of a win in this mode. Guided is assisted (never advances). The x1.25 bonus is applied
 * to the elapsed time the scheduler sees, i.e. a win counts as if it were that much faster against par, so a
 * clean Interview solve earns "mastered" a little easier. Returns the seconds to report to the SRS.
 */
export function effectiveSeconds(mode: ModeDef, seconds: number): number {
  return mode.masteryMultiplier > 1 ? Math.round(seconds / mode.masteryMultiplier) : seconds;
}
