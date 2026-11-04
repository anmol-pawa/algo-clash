/**
 * The seeded Daily Rift plan (GDD §6.3): five rooms.
 * 1 due reviews (interleaved across patterns), 2 recognition blitz, 3 one fresh problem at the frontier,
 * 4 Team Undefined debugging encounter, 5 optional bonus hard.
 * Same day + same save state => same plan, on every device.
 */
import type { ProblemMastery } from "../save/schema";
import { makeRng } from "../content/rng";
import { hashString } from "./day";
import { dueItems, tierIndex, tierOf } from "../srs/scheduler";

export type RoomKind = "review" | "blitz" | "fresh" | "debug" | "bonus";
export const ROOM_KINDS: readonly RoomKind[] = ["review", "blitz", "fresh", "debug", "bonus"];

export interface RiftProblem {
  id: string;
  difficulty: "E" | "M" | "H";
  /** Primary pattern id. */
  pattern: string;
  /** Problem ids that must be solved before this one. */
  prerequisites: string[];
}

export interface RiftInput {
  /** Local calendar day, "YYYY-MM-DD". */
  day: string;
  now: number;
  mastery: Record<string, ProblemMastery>;
  problems: readonly RiftProblem[];
  /** Recognition-blitz card ids (a pool; the plan picks `BLITZ_SIZE`). */
  blitzCards: readonly string[];
  /** Team Undefined debugging encounter ids. */
  debugEncounters: readonly string[];
}

export interface RiftRoom {
  kind: RoomKind;
  /** Problem ids, card ids or encounter ids depending on `kind`. Empty when there is nothing to do (the room is skipped). */
  items: string[];
  optional: boolean;
}

export interface RiftPlan {
  day: string;
  rooms: RiftRoom[];
}

export const MAX_REVIEWS = 4;
export const BLITZ_SIZE = 5;

/** Most-overdue reviews first, but no two in a row from the same pattern when avoidable (interleaving). */
export function pickReviews(due: readonly RiftProblem[], max: number): RiftProblem[] {
  const pool = [...due];
  const out: RiftProblem[] = [];
  while (out.length < max && pool.length > 0) {
    const last = out.length ? out[out.length - 1].pattern : "";
    const idx = pool.findIndex((p) => p.pattern !== last);
    out.push(...pool.splice(idx === -1 ? 0 : idx, 1));
  }
  return out;
}

const solved = (m?: ProblemMastery): boolean => !!m && tierIndex(tierOf(m)) >= tierIndex("learning");

/** Frontier: unsolved problems whose prerequisites are all solved, easiest difficulty first (then catalogue order). */
export function frontier(problems: readonly RiftProblem[], mastery: Record<string, ProblemMastery>): RiftProblem[] {
  const order = { E: 0, M: 1, H: 2 } as const;
  return problems
    .filter((p) => !solved(mastery[p.id]) && p.prerequisites.every((q) => solved(mastery[q])))
    .map((p, i) => ({ p, i }))
    .sort((a, b) => order[a.p.difficulty] - order[b.p.difficulty] || a.i - b.i)
    .map((x) => x.p);
}

export function planRift(input: RiftInput): RiftPlan {
  const rng = makeRng(hashString(`rift:${input.day}`));
  const byId = new Map(input.problems.map((p) => [p.id, p] as const));

  const dueProblems = dueItems(input.mastery, input.now)
    .map((id) => byId.get(id))
    .filter((p): p is RiftProblem => !!p);
  const reviews = pickReviews(dueProblems, MAX_REVIEWS);

  const blitz = rng.shuffle(input.blitzCards).slice(0, BLITZ_SIZE);

  const front = frontier(input.problems, input.mastery).filter((p) => !reviews.includes(p));
  const fresh = front.length ? [front[0]] : [];

  const debug = input.debugEncounters.length ? [rng.pick(input.debugEncounters)] : [];

  // Bonus: a hard problem (unsolved first, otherwise a solved one to re-test), never one already in the Rift.
  const taken = new Set([...reviews, ...fresh].map((p) => p.id));
  const hards = input.problems.filter((p) => p.difficulty === "H" && !taken.has(p.id));
  const unsolvedHards = hards.filter((p) => !solved(input.mastery[p.id]));
  const bonusPool = unsolvedHards.length ? unsolvedHards : hards;
  const bonus = bonusPool.length ? [rng.pick(bonusPool)] : [];

  return {
    day: input.day,
    rooms: [
      { kind: "review", items: reviews.map((p) => p.id), optional: false },
      { kind: "blitz", items: blitz, optional: false },
      { kind: "fresh", items: fresh.map((p) => p.id), optional: false },
      { kind: "debug", items: debug, optional: false },
      { kind: "bonus", items: bonus.map((p) => p.id), optional: true },
    ],
  };
}
