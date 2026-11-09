/** Scaffolding modes (GDD §6.5): the honest difficulty dial. Pure data and rules, no DOM. */

export type ScaffoldMode = "guided" | "standard" | "interview" | "contest";

export const SCAFFOLD_MODES: readonly ScaffoldMode[] = ["guided", "standard", "interview", "contest"];

export interface ModeRules {
  id: ScaffoldMode;
  label: string;
  blurb: string;
  /** Editor starts from a skeleton plus an approach card instead of the bare signature. */
  skeleton: boolean;
  autocomplete: boolean;
  snippets: boolean;
  /** "unlimited" (Guided), "ladder" (3 rungs, Hint Tokens) or "none". */
  hints: "unlimited" | "ladder" | "none";
  /** Max presses of Run (visible tests); Infinity when unlimited. Submit is never capped (a wrong Submit already costs hearts). */
  maxRuns: number;
  /** The player must write and pass their own tests before Submit unlocks. */
  ownTests: boolean;
  /** Wall-clock limit for the whole fight in seconds, or null. */
  timerSeconds: number | null;
  /** Whether a win advances mastery at all. */
  countsForMastery: boolean;
  /** Multiplier on the mastery gain (Interview and Contest are harder than Standard). */
  masteryWeight: number;
}

export const MODE_RULES: Readonly<Record<ScaffoldMode, ModeRules>> = {
  guided: {
    id: "guided", label: "Guided", blurb: "Unlimited free hints. The win is assisted: it does not count for mastery.",
    skeleton: true, autocomplete: true, snippets: true, hints: "unlimited", maxRuns: Infinity, ownTests: false,
    timerSeconds: null, countsForMastery: false, masteryWeight: 0,
  },
  standard: {
    id: "standard", label: "Standard", blurb: "Signature only, autocomplete on, the 3-hint ladder.",
    skeleton: false, autocomplete: true, snippets: true, hints: "ladder", maxRuns: Infinity, ownTests: false,
    timerSeconds: null, countsForMastery: true, masteryWeight: 1,
  },
  interview: {
    id: "interview", label: "Interview", blurb: "No autocomplete or snippets, 6 runs, write your own tests first.",
    skeleton: false, autocomplete: false, snippets: false, hints: "none", maxRuns: 6, ownTests: true,
    timerSeconds: null, countsForMastery: true, masteryWeight: 1.25,
  },
  contest: {
    id: "contest", label: "Contest", blurb: "Interview rules on a 45-minute clock.",
    skeleton: false, autocomplete: false, snippets: false, hints: "none", maxRuns: 6, ownTests: true,
    timerSeconds: 45 * 60, countsForMastery: true, masteryWeight: 1.25,
  },
};

export function isScaffoldMode(x: unknown): x is ScaffoldMode {
  return typeof x === "string" && (SCAFFOLD_MODES as readonly string[]).includes(x);
}

/** Coerce an untrusted (stored) value to a mode; Standard is the default. */
export function sanitizeMode(raw: unknown): ScaffoldMode {
  return isScaffoldMode(raw) ? raw : "standard";
}

export interface RunBudget {
  used: number;
  left: number;
  allowed: boolean;
}

/** Run-button budget after `used` presses. */
export function runBudget(mode: ScaffoldMode, used: number): RunBudget {
  const max = MODE_RULES[mode].maxRuns;
  const left = Math.max(0, max - used);
  return { used, left, allowed: left > 0 };
}

/** Seconds left on the contest clock (null when the mode has none), never below 0. */
export function timeLeft(mode: ScaffoldMode, elapsedSeconds: number): number | null {
  const t = MODE_RULES[mode].timerSeconds;
  return t === null ? null : Math.max(0, t - Math.max(0, elapsedSeconds));
}

/** Submit lock: Interview and Contest require the own-test requirement to be met first. */
export function submitAllowed(mode: ScaffoldMode, ownTestsPassed: number, ownTestsNeeded = MIN_OWN_TESTS): boolean {
  return !MODE_RULES[mode].ownTests || ownTestsPassed >= ownTestsNeeded;
}

export const MIN_OWN_TESTS = 3;
