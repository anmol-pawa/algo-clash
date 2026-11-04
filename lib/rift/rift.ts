/**
 * Daily Rift planner (GDD §6.3). Pure and deterministic: the same UTC day + same save + same catalog
 * always yields the same five rooms. No DOM, no clock (callers pass `now`).
 */
import { makeRng } from "../content/rng";
import { dueItems, tierIndex, tierOf } from "../srs";
import type { ProblemMastery } from "../save/schema";

export type RoomKind = "reviews" | "blitz" | "fresh" | "debug" | "bonus";
export const ROOM_KINDS: readonly RoomKind[] = ["reviews", "blitz", "fresh", "debug", "bonus"];

/** The slice of problem metadata the planner needs. */
export interface RiftProblem {
  id: string;
  region: string;
  difficulty: "E" | "M" | "H";
  prerequisites: string[];
}
/** The slice of card metadata the planner needs. `debug` marks Team Undefined compile/bug-hunt cards. */
export interface RiftCard {
  id: string;
  region: string;
  debug?: boolean;
}
export interface RiftCatalog {
  problems: RiftProblem[];
  cards: RiftCard[];
}

export interface RiftItem {
  type: "problem" | "card";
  id: string;
}
export interface RiftRoom {
  kind: RoomKind;
  optional: boolean;
  items: RiftItem[];
}
export interface RiftPlan {
  day: string;
  seed: number;
  rooms: RiftRoom[];
}

export const MAX_REVIEWS = 4;
export const BLITZ_SIZE = 5;

/** UTC calendar day `YYYY-MM-DD`. */
export function dayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Whole days from `a` to `b` (both `YYYY-MM-DD`). */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86_400_000);
}

/** FNV-1a over the day string: the daily seed. */
export function seedForDay(day: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < day.length; ++i) {
    h ^= day.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const regionNum = (r: string): number => Number.parseInt(r.replace(/\D/g, ""), 10) || 0;
const learned = (m: ProblemMastery | undefined): boolean => !!m && tierIndex(tierOf(m)) >= tierIndex("learning");

export function planRift(day: string, mastery: Record<string, ProblemMastery>, catalog: RiftCatalog, now: number): RiftPlan {
  const seed = seedForDay(day);
  const rng = makeRng(seed);
  const byId = new Map(catalog.problems.map((p) => [p.id, p]));
  const used = new Set<string>();
  const take = (id: string) => used.add(id);

  // Room 1: due reviews, interleaved across regions (round-robin over regions, most overdue first inside each).
  const due = dueItems(mastery, now).filter((id) => byId.has(id));
  const perRegion = new Map<string, string[]>();
  for (const id of due) {
    const r = byId.get(id)!.region;
    perRegion.set(r, [...(perRegion.get(r) ?? []), id]);
  }
  const regions = [...perRegion.keys()].sort((a, b) => regionNum(a) - regionNum(b));
  const reviews: RiftItem[] = [];
  for (let round = 0; reviews.length < MAX_REVIEWS && regions.some((r) => perRegion.get(r)![round]); ++round) {
    for (const r of regions) {
      const id = perRegion.get(r)![round];
      if (id && reviews.length < MAX_REVIEWS) {
        reviews.push({ type: "problem", id });
        take(id);
      }
    }
  }

  // Room 2: recognition blitz. Non-debug cards, spread over regions the player has touched (else all).
  const touchedRegions = new Set(Object.keys(mastery).map((id) => byId.get(id)?.region).filter((r): r is string => !!r));
  const plain = catalog.cards.filter((c) => !c.debug);
  const pool = plain.filter((c) => touchedRegions.has(c.region));
  const blitzPool = rng.shuffle((pool.length >= BLITZ_SIZE ? pool : plain).map((c) => c.id).sort());
  const blitz = blitzPool.slice(0, BLITZ_SIZE).map((id): RiftItem => ({ type: "card", id }));

  // Room 3: one fresh problem at the frontier: unsolved, prerequisites learned, lowest region, easiest first.
  const rank = { E: 0, M: 1, H: 2 } as const;
  const frontier = catalog.problems
    .filter((p) => !learned(mastery[p.id]) && !used.has(p.id) && p.prerequisites.every((q) => learned(mastery[q])))
    .sort((a, b) => regionNum(a.region) - regionNum(b.region) || rank[a.difficulty] - rank[b.difficulty] || a.id.localeCompare(b.id));
  const topRegion = frontier[0]?.region;
  const nearest = frontier.filter((p) => p.region === topRegion && p.difficulty === frontier[0].difficulty);
  const fresh = nearest.length ? rng.pick(nearest) : undefined;
  if (fresh) take(fresh.id);

  // Room 4: Team Undefined debugging encounter (a bug-hunt card, seeded pick).
  const debugCards = catalog.cards.filter((c) => c.debug).map((c) => c.id).sort();
  const debug = debugCards.length ? [{ type: "card" as const, id: rng.pick(debugCards) }] : [];

  // Room 5 (optional): bonus hard the player has not learned, prerequisites met if possible.
  const hards = catalog.problems.filter((p) => p.difficulty === "H" && !learned(mastery[p.id]) && !used.has(p.id));
  const ready = hards.filter((p) => p.prerequisites.every((q) => learned(mastery[q])));
  const bonusPick = (ready.length ? ready : hards).sort((a, b) => a.id.localeCompare(b.id));
  const bonus = bonusPick.length ? [{ type: "problem" as const, id: rng.pick(bonusPick).id }] : [];

  return {
    day,
    seed,
    rooms: [
      { kind: "reviews", optional: false, items: reviews },
      { kind: "blitz", optional: false, items: blitz },
      { kind: "fresh", optional: false, items: fresh ? [{ type: "problem", id: fresh.id }] : [] },
      { kind: "debug", optional: false, items: debug },
      { kind: "bonus", optional: true, items: bonus },
    ],
  };
}

/** Rooms with no items are skipped (nothing due on day one, say) and count as cleared. */
export const playableRooms = (plan: RiftPlan): number[] => plan.rooms.flatMap((r, i) => (r.items.length ? [i] : []));

export interface StreakState {
  streakDays: number;
  lastPlayedDay: string;
}

/**
 * The streak grows by one when a Rift is completed on the day after the last completion, restarts at 1 after a
 * gap, and is unchanged for a second completion on the same day. A miss costs only the counter (GDD §6.3).
 */
export function advanceStreak(s: StreakState, today: string): StreakState {
  if (s.lastPlayedDay === today) return s;
  const gap = s.lastPlayedDay ? daysBetween(s.lastPlayedDay, today) : Infinity;
  return { streakDays: gap === 1 ? s.streakDays + 1 : 1, lastPlayedDay: today };
}

/** What the counter shows today: a stale streak (more than a day since the last Rift) reads as 0. */
export function visibleStreak(s: StreakState, today: string): number {
  return s.lastPlayedDay && daysBetween(s.lastPlayedDay, today) <= 1 ? s.streakDays : 0;
}

export interface RiftReward {
  bits: number;
  xp: number;
}
const ROOM_BITS: Record<RoomKind, number> = { reviews: 20, blitz: 10, fresh: 25, debug: 15, bonus: 40 };

/** Rewards scale with completion: per cleared room, a +10 % per streak day bonus (cap +50 %), and a full-clear bonus. */
export function riftReward(plan: RiftPlan, cleared: readonly number[], streakDays: number): RiftReward {
  const set = new Set(cleared);
  let bits = 0;
  for (const i of set) if (plan.rooms[i]) bits += ROOM_BITS[plan.rooms[i].kind];
  const required = plan.rooms.flatMap((r, i) => (!r.optional && r.items.length ? [i] : []));
  if (required.every((i) => set.has(i))) bits += 25;
  bits = Math.round(bits * (1 + Math.min(0.5, 0.1 * Math.max(0, streakDays - 1))));
  return { bits, xp: bits * 2 };
}

/** Save-flag key holding the cleared-room bitmask for a day. */
export const riftFlagKey = (day: string): string => `rift:${day}:cleared`;
export const clearedFromMask = (mask: number): number[] => ROOM_KINDS.flatMap((_, i) => (mask & (1 << i) ? [i] : []));
export const maskWith = (mask: number, room: number): number => mask | (1 << room);
