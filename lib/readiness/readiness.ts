/**
 * Readiness Report (GDD §1 gates, §9). Pure: no DOM, no clock (callers pass `now`).
 * Everything here is derived from the save, the attempt log and the bundled catalog; nothing is stored.
 */
import type { Attempt, CoreSave } from "../save/schema";
import { dueItems, patternMastery, type Difficulty } from "../srs";
import { emptyProgress, scrollStatus } from "../forge/progress";
import { MASTERY_ACCURACY, MASTERY_MIN_SEEN, type ScoutProgress } from "../recognition/progress";

export interface ReadinessProblem {
  id: string;
  difficulty: Difficulty;
  patterns: string[];
  parSeconds: number;
}
export interface ReadinessScroll {
  id: string;
  parSeconds: number;
}
export interface ReadinessPattern {
  id: string;
  name: string;
}

export interface ReadinessInput {
  core: CoreSave;
  attempts: readonly Attempt[];
  problems: readonly ReadinessProblem[];
  scrolls: readonly ReadinessScroll[];
  patterns: readonly ReadinessPattern[];
  scout: ScoutProgress;
  now: number;
}

/** GDD §1 thresholds. The sample sizes are the targets the player works towards. */
export const GATES = {
  mediumSample: 20,
  mediumRate: 0.8,
  mediumMinutes: 25,
  hardSample: 10,
  hardRate: 0.4,
  hardMinutes: 45,
  mocksNeeded: 3,
} as const;

export type GateId = "recognition" | "medium" | "hard" | "templates" | "mocks";

export interface Gate {
  id: GateId;
  label: string;
  /** 0..1, capped. */
  progress: number;
  passed: boolean;
  /** One line of honest detail ("9 of 16 mediums solved unassisted under 25 min"). */
  detail: string;
}

export interface RadarSpoke {
  pattern: string;
  name: string;
  /** 0..1 weighted, rust-adjusted mastery. */
  value: number;
}

export interface TimeVsPar {
  difficulty: Difficulty;
  /** Median of seconds / par over accepted attempts, null with none. 1.0 = exactly on par. */
  medianRatio: number | null;
  samples: number;
}

export interface CauseCount {
  cause: string;
  count: number;
}

export interface NextAction {
  /** Where to send the player. */
  href: string;
  title: string;
  why: string;
}

export interface ReadinessReport {
  gates: Gate[];
  radar: RadarSpoke[];
  timeVsPar: TimeVsPar[];
  causes: CauseCount[];
  accepted: number;
  attemptsTotal: number;
  dueReviews: number;
  next: NextAction;
  /** Share of gates passed, 0..1. */
  readiness: number;
}

const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

export function median(xs: readonly number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/** An attempt counts as unassisted when no hints were used and it was not flagged assisted or played Guided. */
export function isUnassistedAttempt(a: Attempt): boolean {
  return a.verdict === "AC" && a.hintsUsed === 0 && a.assisted !== true && a.mode !== "learn";
}

/** Distinct problems of a difficulty solved unassisted within `limitSeconds`. */
export function solvedWithin(attempts: readonly Attempt[], problems: readonly ReadinessProblem[], difficulty: Difficulty, limitSeconds: number): number {
  const ids = new Set(problems.filter((p) => p.difficulty === difficulty).map((p) => p.id));
  const done = new Set<string>();
  for (const a of attempts) if (ids.has(a.problemId) && isUnassistedAttempt(a) && a.seconds <= limitSeconds) done.add(a.problemId);
  return done.size;
}

export function computeGates(input: ReadinessInput): Gate[] {
  const { core, attempts, problems, scrolls, scout } = input;

  const seenPart = clamp01(scout.seen / MASTERY_MIN_SEEN);
  const recognition: Gate = {
    id: "recognition",
    label: "Pattern recognition",
    progress: scout.mastered ? 1 : seenPart * clamp01(scout.accuracy / MASTERY_ACCURACY),
    passed: scout.mastered,
    detail: `${scout.seen} of ${MASTERY_MIN_SEEN} statements seen, ${Math.round(scout.accuracy * 100)}% right in time (need ${Math.round(MASTERY_ACCURACY * 100)}%)`,
  };

  const need = (sample: number, rate: number): number => Math.ceil(sample * rate);
  const solveGate = (id: "medium" | "hard", label: string, d: Difficulty, sample: number, rate: number, minutes: number): Gate => {
    const target = need(sample, rate);
    const solved = solvedWithin(attempts, problems, d, minutes * 60);
    return {
      id,
      label,
      progress: clamp01(solved / target),
      passed: solved >= target,
      detail: `${solved} of ${target} ${id === "medium" ? "mediums" : "hards"} solved unassisted under ${minutes} min (target: ${Math.round(rate * 100)}% of a ${sample}-problem sample)`,
    };
  };

  let ingrained = 0;
  for (const s of scrolls) if (scrollStatus(core.forge[s.id] ?? emptyProgress(), s.parSeconds) === "ingrained") ingrained++;
  const templates: Gate = {
    id: "templates",
    label: "Core templates",
    progress: scrolls.length === 0 ? 0 : ingrained / scrolls.length,
    passed: scrolls.length > 0 && ingrained === scrolls.length,
    detail: `${ingrained} of ${scrolls.length} scrolls Ingrained`,
  };

  const streak = typeof core.flags["mocks:streak"] === "number" ? Math.max(0, Math.floor(core.flags["mocks:streak"])) : 0;
  const mocks: Gate = {
    id: "mocks",
    label: "Mock interviews",
    progress: clamp01(streak / GATES.mocksNeeded),
    passed: streak >= GATES.mocksNeeded,
    detail: `${Math.min(streak, GATES.mocksNeeded)} of ${GATES.mocksNeeded} consecutive mocks rated Hire or better (the Interview Tower opens later)`,
  };

  return [
    recognition,
    solveGate("medium", "Medium solve rate", "M", GATES.mediumSample, GATES.mediumRate, GATES.mediumMinutes),
    solveGate("hard", "Hard solve rate", "H", GATES.hardSample, GATES.hardRate, GATES.hardMinutes),
    templates,
    mocks,
  ];
}

/** Per-pattern strength for every pattern that has at least one shipped problem. */
export function computeRadar(input: ReadinessInput): RadarSpoke[] {
  const { core, problems, patterns, now } = input;
  const spokes: RadarSpoke[] = [];
  for (const pat of patterns) {
    const items = problems.filter((p) => p.patterns.includes(pat.id)).map((p) => ({ id: p.id, difficulty: p.difficulty }));
    if (items.length === 0) continue;
    spokes.push({ pattern: pat.id, name: pat.name, value: patternMastery(items, core.mastery, now) });
  }
  return spokes;
}

export function computeTimeVsPar(attempts: readonly Attempt[], problems: readonly ReadinessProblem[]): TimeVsPar[] {
  const byId = new Map(problems.map((p) => [p.id, p]));
  return (["E", "M", "H"] as const).map((difficulty) => {
    const ratios: number[] = [];
    for (const a of attempts) {
      const p = byId.get(a.problemId);
      if (p && p.difficulty === difficulty && a.verdict === "AC" && p.parSeconds > 0) ratios.push(a.seconds / p.parSeconds);
    }
    return { difficulty, medianRatio: median(ratios), samples: ratios.length };
  });
}

/** Histogram of why submissions failed: the debrief's cause tag when there is one, otherwise the verdict. Most common first. */
export function computeCauses(attempts: readonly Attempt[]): CauseCount[] {
  const counts = new Map<string, number>();
  for (const a of attempts) {
    if (a.verdict === "AC") continue;
    const key = a.cause && a.cause.trim() ? a.cause.trim() : a.verdict;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].map(([cause, count]) => ({ cause, count })).sort((a, b) => b.count - a.count || a.cause.localeCompare(b.cause));
}

/** One recommended thing to do next, in a fixed priority order so the advice is stable and explainable. */
export function nextBestAction(input: ReadinessInput, gates: readonly Gate[], radar: readonly RadarSpoke[], dueReviews: number): NextAction {
  if (dueReviews > 0) {
    return { href: "/rift/", title: `Clear ${dueReviews} due review${dueReviews === 1 ? "" : "s"}`, why: "Rusty skills lose mastery; reviews are the cheapest gain you can make." };
  }
  const g = (id: GateId): Gate => gates.find((x) => x.id === id)!;
  if (!g("recognition").passed) {
    return { href: "/scout/", title: "Run a Scout School blitz", why: "Recognising the pattern comes before writing code, and this gate is still open." };
  }
  const attempted = new Set(input.attempts.map((a) => a.problemId));
  const weak = [...radar].sort((a, b) => a.value - b.value)[0];
  if (weak && weak.value < 0.6) {
    return { href: "/rift/", title: `Practise ${weak.name}`, why: `It is your weakest pattern (${Math.round(weak.value * 100)}% strength). Clear a Rift room that uses it.` };
  }
  if (!g("templates").passed) {
    return { href: "/forge/", title: "Inscribe a scroll in the Forge", why: "Templates written from memory under par are a readiness gate." };
  }
  if (!g("medium").passed) {
    return { href: "/rift/", title: "Solve a medium unassisted", why: "Interview mode with no hints is what the medium gate counts." };
  }
  if (!g("hard").passed) {
    return { href: "/rift/", title: "Attempt a hard", why: "The hard gate needs unassisted solves under 45 minutes." };
  }
  if (!g("mocks").passed) {
    return { href: "/rift/", title: "Practise in Interview mode", why: "Mock interviews need steady timed practice with your own tests." };
  }
  return attempted.size === 0
    ? { href: "/play/", title: "Start your first battle", why: "Nothing to measure yet." }
    : { href: "/rift/", title: "Keep the streak going", why: "Every gate is open. Daily reviews keep it that way." };
}

export function computeReadiness(input: ReadinessInput): ReadinessReport {
  const gates = computeGates(input);
  const radar = computeRadar(input);
  const dueReviews = dueItems(input.core.mastery, input.now).length;
  const accepted = input.attempts.filter((a) => a.verdict === "AC").length;
  return {
    gates,
    radar,
    timeVsPar: computeTimeVsPar(input.attempts, input.problems),
    causes: computeCauses(input.attempts),
    accepted,
    attemptsTotal: input.attempts.length,
    dueReviews,
    next: nextBestAction(input, gates, radar, dueReviews),
    readiness: gates.filter((g) => g.passed).length / gates.length,
  };
}
