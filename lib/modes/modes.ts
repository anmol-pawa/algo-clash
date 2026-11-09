/**
 * Scaffolding modes (GDD §6.5): an honest difficulty dial. Pure data and rules, no DOM and no clock.
 * The UI reads `MODES[mode]`; the SRS reads `masteryRule`.
 */
export type ModeId = "guided" | "standard" | "interview" | "contest";

export interface ModeDef {
  id: ModeId;
  name: string;
  blurb: string;
  /** Editor autocomplete and snippets are offered. */
  autocomplete: boolean;
  /** Starter shows a skeleton plus the approach card (Guided) instead of the signature only. */
  skeleton: boolean;
  /** Hint Tokens work. Guided gives unlimited hints; Interview and Contest give none. */
  hints: "unlimited" | "ladder" | "none";
  /** Max Run presses per fight; null = unlimited. */
  maxRuns: number | null;
  /** The player must write their own tests (with enough edge-case coverage) before Submit unlocks. */
  ownTests: boolean;
  /** A countdown applies (seconds multiple of the problem's par time); null = untimed. */
  timerParMultiple: number | null;
  /** The Debug Lens reveals the failing input (it is the only way to see one in these modes). */
  hidesFailInput: boolean;
  countsForMastery: boolean;
  /** Multiplier on the review interval gained by an unassisted solve. */
  masteryMultiplier: number;
}

export const MODES: Readonly<Record<ModeId, ModeDef>> = {
  guided: {
    id: "guided", name: "Guided", blurb: "Skeleton and approach card, unlimited hints. Great for a first meeting; does not count for mastery.",
    autocomplete: true, skeleton: true, hints: "unlimited", maxRuns: null, ownTests: false, timerParMultiple: null,
    hidesFailInput: false, countsForMastery: false, masteryMultiplier: 1,
  },
  standard: {
    id: "standard", name: "Standard", blurb: "Signature only, autocomplete on, the 3-rung hint ladder.",
    autocomplete: true, skeleton: false, hints: "ladder", maxRuns: null, ownTests: false, timerParMultiple: null,
    hidesFailInput: false, countsForMastery: true, masteryMultiplier: 1,
  },
  interview: {
    id: "interview", name: "Interview", blurb: "No autocomplete, 5 runs, no hints. Write your own tests first. Worth 1.25x mastery.",
    autocomplete: false, skeleton: false, hints: "none", maxRuns: 5, ownTests: true, timerParMultiple: null,
    hidesFailInput: true, countsForMastery: true, masteryMultiplier: 1.25,
  },
  contest: {
    id: "contest", name: "Contest", blurb: "Interview rules against the clock (2x par time).",
    autocomplete: false, skeleton: false, hints: "none", maxRuns: 5, ownTests: true, timerParMultiple: 2,
    hidesFailInput: true, countsForMastery: true, masteryMultiplier: 1.25,
  },
};

export const MODE_IDS: readonly ModeId[] = ["guided", "standard", "interview", "contest"];

export const isModeId = (v: unknown): v is ModeId => typeof v === "string" && (MODE_IDS as readonly string[]).includes(v);

/** Runs left after `used` presses; null = unlimited. */
export function runsLeft(mode: ModeId, used: number): number | null {
  const max = MODES[mode].maxRuns;
  return max === null ? null : Math.max(0, max - used);
}

/** Seconds on the clock for a problem, or null when untimed. */
export function timeLimitSeconds(mode: ModeId, parSeconds: number): number | null {
  const m = MODES[mode].timerParMultiple;
  return m === null ? null : Math.round(parSeconds * m);
}

/** Whether a Hint Token can be spent in this mode. */
export const hintsAllowed = (mode: ModeId): boolean => MODES[mode].hints !== "none";

/**
 * How a solve in this mode feeds the SRS. `assisted` is forced on in Guided (GDD §6.2);
 * `intervalMultiplier` scales the review interval granted to an unassisted solve.
 */
export function masteryRule(mode: ModeId, assisted: boolean): { counts: boolean; assisted: boolean; intervalMultiplier: number } {
  const m = MODES[mode];
  return { counts: m.countsForMastery, assisted: assisted || !m.countsForMastery, intervalMultiplier: assisted ? 1 : m.masteryMultiplier };
}
