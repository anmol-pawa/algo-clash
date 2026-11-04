/**
 * Spaced-repetition scheduler and mastery states (GDD §6.2). Pure and deterministic: no DOM, no clock
 * (callers pass `at`), no randomness. State lives in the save's `ProblemMastery` record.
 */
import type { MasteryState, ProblemMastery } from "../save/schema";

export const DAY_MS = 86_400_000;

/** The six player-facing tiers, in order. Legacy save states ("solved", "rusty") are normalised on read. */
export const TIERS = ["unseen", "seen", "learning", "practiced", "mastered", "ingrained"] as const;
export type Tier = (typeof TIERS)[number];

/** Review intervals in days: learning 1, practiced 3 then 7, mastered 16, ingrained 35 and growing (capped). */
export const INTERVALS = { learning: 1, practiced3: 3, practiced7: 7, mastered: 16, ingrained: 35, ingrainedCap: 180 } as const;

/** An ingrained solve needs the item first solved at least this long ago. */
export const INGRAIN_AFTER_DAYS = 30;

export interface SolveEvent {
  /** Epoch ms of the attempt. */
  at: number;
  /** True for an accepted solve; false for a failed attempt (WA/TLE/RE/CE or giving up). */
  solved: boolean;
  /** An editorial read, more than 2 hints, or Guided mode makes a solve assisted (never advances). */
  assisted: boolean;
  /** Wall time spent, in seconds. */
  seconds: number;
  /** The problem's par time in seconds. */
  parSeconds: number;
  /** Solved from a blank editor (no skeleton, no approach card): needed for Ingrained. */
  fromBlank?: boolean;
}

export function tierOf(m: Pick<ProblemMastery, "state" | "solves">): Tier {
  switch (m.state) {
    case "solved": // legacy v0 imports: one solve, nothing else is known
      return "learning";
    case "rusty": // legacy placeholder: it was learned once, treat as practiced and let rust re-derive
      return "practiced";
    default:
      return (TIERS as readonly string[]).includes(m.state) ? (m.state as Tier) : "unseen";
  }
}

export const tierIndex = (t: Tier): number => TIERS.indexOf(t);

export function emptyMastery(): ProblemMastery {
  return { state: "unseen", solves: 0, due: 0, intervalDays: 0, ease: 2.5, lastSolvedAt: 0 };
}

/** Number of spaced, unassisted solves implied by a tier (also the floor after a lapse). */
const TIER_SPACED: Record<Tier, number> = { unseen: 0, seen: 0, learning: 1, practiced: 2, mastered: 3, ingrained: 4 };

function spacedOf(m: ProblemMastery): number {
  return Math.max(m.spacedSolves ?? 0, TIER_SPACED[tierOf(m)]);
}

function intervalFor(tier: Tier, spaced: number, prevDays: number): number {
  switch (tier) {
    case "learning":
      return INTERVALS.learning;
    case "practiced":
      return spaced >= 3 ? INTERVALS.practiced7 : INTERVALS.practiced3;
    case "mastered":
      return INTERVALS.mastered;
    case "ingrained":
      return Math.min(INTERVALS.ingrainedCap, Math.max(INTERVALS.ingrained, Math.round(prevDays * 1.5)));
    default:
      return 0;
  }
}

/** Encountering a problem (opening its battle) without solving it. Unseen becomes Seen, nothing else changes. */
export function markSeen(m: ProblemMastery): ProblemMastery {
  return tierOf(m) === "unseen" ? { ...m, state: "seen" } : m;
}

/**
 * Applies one attempt and returns the new record (the input is never mutated).
 *
 * - Assisted solves never advance a tier. They reschedule the item for one day later.
 * - An unassisted solve before the item is due (cramming) is recorded but does not advance or reschedule.
 * - A failed attempt on a learned item is a lapse: the tier drops one step and the item is due in a day.
 */
export function applyAttempt(m0: ProblemMastery, ev: SolveEvent): ProblemMastery {
  const tier = tierOf(m0);
  const m: ProblemMastery = { ...m0 };
  const spaced = spacedOf(m0);

  if (!ev.solved) {
    if (tierIndex(tier) <= tierIndex("learning")) {
      return tier === "unseen" ? { ...m, state: "seen" } : m;
    }
    const lower = TIERS[tierIndex(tier) - 1];
    return { ...m, state: lower, spacedSolves: Math.min(spaced, TIER_SPACED[lower]), intervalDays: INTERVALS.learning, due: ev.at + DAY_MS };
  }

  m.solves = m0.solves + 1;
  m.lastSolvedAt = ev.at;

  if (ev.assisted) {
    // An assisted solve of an unseen item still counts as an encounter.
    if (tier === "unseen") m.state = "seen";
    m.due = ev.at + DAY_MS;
    m.intervalDays = Math.min(m0.intervalDays || INTERVALS.learning, INTERVALS.learning);
    return m;
  }

  const firstUnassisted = tierIndex(tier) < tierIndex("learning");
  const isDue = m0.due > 0 && ev.at >= m0.due;
  if (!firstUnassisted && !isDue) return { ...m, firstSolvedAt: m0.firstSolvedAt ?? ev.at }; // cramming: no credit
  m.firstSolvedAt = m0.firstSolvedAt && m0.firstSolvedAt > 0 ? m0.firstSolvedAt : ev.at;

  const count = firstUnassisted ? 1 : spaced + 1;
  const underTwicePar = ev.parSeconds > 0 && ev.seconds < 2 * ev.parSeconds;
  const underPar = ev.parSeconds > 0 && ev.seconds < ev.parSeconds;
  const oldEnough = ev.at - m.firstSolvedAt >= INGRAIN_AFTER_DAYS * DAY_MS;

  let next: Tier;
  if (count <= 1) next = "learning";
  else if (count === 2) next = "practiced";
  else if (tier === "ingrained") next = "ingrained";
  else if (tier === "mastered" && ev.fromBlank && underPar && oldEnough) next = "ingrained";
  else if (underTwicePar) next = "mastered";
  else next = "practiced";
  // Never move down on a good solve (e.g. a slow solve of a mastered item keeps it mastered).
  if (tierIndex(tier) > tierIndex(next)) next = tier;

  m.state = next;
  m.spacedSolves = count;
  m.intervalDays = intervalFor(next, count, m0.intervalDays);
  m.due = ev.at + m.intervalDays * DAY_MS;
  return m;
}

/** Items to review right now, most overdue first. Unseen/seen items have nothing scheduled and are skipped. */
export function dueItems(mastery: Record<string, ProblemMastery>, now: number): string[] {
  return Object.entries(mastery)
    .filter(([, m]) => m.due > 0 && m.due <= now && tierIndex(tierOf(m)) >= tierIndex("learning"))
    .sort((a, b) => a[1].due - b[1].due || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}

export type { MasteryState };
