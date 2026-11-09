/**
 * Scaffolding modes: the honest difficulty dial (GDD §6.5). Pure and deterministic: no DOM, no clock.
 * A mode changes the editor, the help on offer and how a win counts toward mastery. It never changes the judge.
 */

export const MODE_IDS = ["guided", "standard", "interview", "contest"] as const;
export type ModeId = (typeof MODE_IDS)[number];

export interface ModeDef {
  id: ModeId;
  name: string;
  /** One line shown on the picker. */
  blurb: string;
  /** Editor autocomplete allowed. */
  autocomplete: boolean;
  /** Hint ladder available (Hint Tokens still apply). Guided hints are free and unlimited. */
  hints: boolean;
  /** Guided: the approach card is shown and hints cost nothing. */
  approachCard: boolean;
  /** Debug Lens, Compass and hint items may be used. Interview and Contest allow only the Lens (GDD §6.6). */
  items: boolean;
  /** Max Run presses (visible tests); null = unlimited. Submit is never limited. */
  maxRuns: number | null;
  /** Timer in multiples of the par time; null = untimed. When it runs out the foe wins. */
  timerParMultiple: number | null;
  /** The win counts for mastery at all. Guided never does. */
  countsForMastery: boolean;
  /** Speed-credit multiplier: elapsed time is divided by it before comparing with par (GDD 6.5, x1.25 mastery). */
  multiplier: number;
  /** The player must write their own tests before Submit unlocks. */
  ownTests: boolean;
}

export const MODES: readonly ModeDef[] = [
  { id: "guided", name: "Guided", blurb: "Skeleton and approach card. Unlimited free hints. Does not count for mastery.", autocomplete: true, hints: true, approachCard: true, items: true, maxRuns: null, timerParMultiple: null, countsForMastery: false, multiplier: 1, ownTests: false },
  { id: "standard", name: "Standard", blurb: "Signature only, autocomplete, the 3-hint ladder. Counts for mastery.", autocomplete: true, hints: true, approachCard: false, items: true, maxRuns: null, timerParMultiple: null, countsForMastery: true, multiplier: 1, ownTests: false },
  { id: "interview", name: "Interview", blurb: "No autocomplete, no hints, 6 runs, write your own tests first. 25% time slack toward mastery.", autocomplete: false, hints: false, approachCard: false, items: false, maxRuns: 6, timerParMultiple: null, countsForMastery: true, multiplier: 1.25, ownTests: true },
  { id: "contest", name: "Contest", blurb: "Interview rules against the clock (2x par). 25% time slack toward mastery.", autocomplete: false, hints: false, approachCard: false, items: false, maxRuns: 6, timerParMultiple: 2, countsForMastery: true, multiplier: 1.25, ownTests: true },
];

export const DEFAULT_MODE: ModeId = "standard";

export const isModeId = (v: unknown): v is ModeId => typeof v === "string" && (MODE_IDS as readonly string[]).includes(v);

/** Coerce untrusted (e.g. stored) input into a mode id. */
export const sanitizeMode = (v: unknown): ModeId => (isModeId(v) ? v : DEFAULT_MODE);

export function modeDef(id: ModeId): ModeDef {
  return MODES.find((m) => m.id === id) ?? MODES[1];
}

/** The mode's time budget in seconds, or null when untimed. */
export function timerSeconds(mode: ModeDef, parSeconds: number): number | null {
  if (mode.timerParMultiple === null) return null;
  return Math.max(60, Math.round(parSeconds * mode.timerParMultiple));
}

/** Runs left, or null for unlimited. Never negative. */
export function runsLeft(mode: ModeDef, runsUsed: number): number | null {
  return mode.maxRuns === null ? null : Math.max(0, mode.maxRuns - Math.max(0, runsUsed));
}

/**
 * Seconds to compare against par for the SRS. Interview and Contest solves get the mode's multiplier as slack
 * (writing your own tests and working without autocomplete costs time), so 25% more elapsed time still counts as
 * the same speed. Standard and Guided are unchanged.
 */
export function creditedSeconds(mode: ModeDef, seconds: number): number {
  return mode.multiplier > 1 ? seconds / mode.multiplier : seconds;
}

/** A Guided win never advances mastery (it counts as assisted); other modes defer to the item rules. */
export const modeAssists = (mode: ModeDef): boolean => !mode.countsForMastery;
