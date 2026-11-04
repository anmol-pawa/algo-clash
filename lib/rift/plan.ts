/**
 * The Daily Rift planner (GDD §6.3). Same day + same save + same pool gives the same five rooms on every device;
 * a new day (or new mastery state) gives a different dungeon. Pure and deterministic.
 */
import { makeRng, type Rng } from "../content/rng";
import type { Difficulty } from "../content/types";
import type { ProblemMastery } from "../save/schema";
import { dueItems, tierIndex, tierOf } from "../srs/scheduler";
import { hashSeed } from "./day";
import { ROOM_ORDER, type RiftItem, type RiftPlan, type RiftPool, type RiftRoom, type RoomId } from "./types";

export const REVIEW_ROOM_SIZE = 4;
export const BLITZ_SIZE = 5;

const DIFF_RANK: Record<Difficulty, number> = { E: 0, M: 1, H: 2 };
const rankOf = (it: RiftItem): number => DIFF_RANK[it.difficulty ?? "E"];

const learned = (m: ProblemMastery | undefined): boolean => !!m && tierIndex(tierOf(m)) >= tierIndex("learning");
const untouched = (m: ProblemMastery | undefined): boolean => !m || tierIndex(tierOf(m)) <= tierIndex("seen");

/** Round-robin across regions so a review room never feels like one topic. Input order is kept within a region. */
export function interleaveByRegion(items: readonly RiftItem[]): RiftItem[] {
  const buckets = new Map<string, RiftItem[]>();
  for (const it of items) {
    const b = buckets.get(it.region);
    if (b) b.push(it);
    else buckets.set(it.region, [it]);
  }
  const lists = [...buckets.values()];
  const out: RiftItem[] = [];
  for (let i = 0; out.length < items.length; ++i) {
    for (const l of lists) if (i < l.length) out.push(l[i]);
  }
  return out;
}

function reviewItems(pool: RiftPool, mastery: Record<string, ProblemMastery>, now: number, rng: Rng): RiftItem[] {
  const byId = new Map<string, RiftItem>();
  for (const it of [...pool.problems, ...pool.scrolls]) byId.set(it.id, it);
  const due = dueItems(mastery, now).flatMap((id) => (byId.has(id) ? [byId.get(id) as RiftItem] : []));
  // Most overdue first per region, but take the most overdue handful and interleave them.
  const picked = interleaveByRegion(due.slice(0, REVIEW_ROOM_SIZE * 3)).slice(0, REVIEW_ROOM_SIZE);
  if (picked.length > 0) return picked;
  // Nothing due: a gentle warm-up on things still in the Learning tier, so a quiet day is not an empty one.
  const warm = [...byId.values()].filter((it) => tierOf(mastery[it.id] ?? { state: "unseen", solves: 0 }) === "learning");
  return rng.shuffle(warm).slice(0, 2);
}

function blitzItems(pool: RiftPool, rng: Rng): RiftItem[] {
  return interleaveByRegion(rng.shuffle(pool.cards)).slice(0, BLITZ_SIZE);
}

/** The easiest unfinished problem whose prerequisites are learned; ties broken by the seeded RNG. */
function frontierItem(pool: RiftPool, mastery: Record<string, ProblemMastery>, rng: Rng): RiftItem | undefined {
  const open = pool.problems.filter((p) => untouched(mastery[p.id]) && (p.prerequisites ?? []).every((q) => learned(mastery[q])));
  if (open.length === 0) return undefined;
  const best = Math.min(...open.map(rankOf));
  return rng.pick(open.filter((p) => rankOf(p) === best));
}

function debugItem(pool: RiftPool, mastery: Record<string, ProblemMastery>, rng: Rng): RiftItem | undefined {
  if (pool.debug.length === 0) return undefined;
  const fresh = pool.debug.filter((d) => !learned(mastery[d.id]));
  return rng.pick(fresh.length > 0 ? fresh : pool.debug);
}

/** A hard the player has not mastered (a medium when no hard is left), different from the frontier problem. */
function bonusItem(pool: RiftPool, mastery: Record<string, ProblemMastery>, rng: Rng, exclude: ReadonlySet<string>): RiftItem | undefined {
  const open = pool.problems.filter((p) => !exclude.has(p.id) && tierIndex(tierOf(mastery[p.id] ?? { state: "unseen", solves: 0 })) < tierIndex("mastered"));
  const hards = open.filter((p) => p.difficulty === "H");
  const mediums = open.filter((p) => p.difficulty === "M");
  const pickFrom = hards.length > 0 ? hards : mediums;
  return pickFrom.length > 0 ? rng.pick(pickFrom) : undefined;
}

const ROOM_TEXT: Record<RoomId, { title: string; blurb: string; optional: boolean }> = {
  reviews: { title: "Rust Hall", blurb: "Old moves are getting rusty. Clear them before they fade.", optional: false },
  blitz: { title: "Blitz Gate", blurb: "Five quick recognitions: name the pattern, pick the structure.", optional: false },
  frontier: { title: "The Frontier", blurb: "One fresh problem, right at the edge of what you know.", optional: false },
  debug: { title: "Team Undefined Den", blurb: "Something is broken. Find the bug and fix it.", optional: false },
  bonus: { title: "Treasure Vault", blurb: "Optional. A hard problem guards extra Bits.", optional: true },
};

/** Deterministic plan for one day. `now` decides which reviews are due; `day` seeds the draw. */
export function buildRift(day: string, now: number, mastery: Record<string, ProblemMastery>, pool: RiftPool): RiftPlan {
  const seed = hashSeed(`algo-clash-rift:${day}`);
  // Each room draws from its own stream so a change in one room's pool never reshuffles the others.
  const rngFor = (id: RoomId): Rng => makeRng(seed ^ hashSeed(id));
  const frontier = frontierItem(pool, mastery, rngFor("frontier"));
  const debug = debugItem(pool, mastery, rngFor("debug"));
  const itemsByRoom: Record<RoomId, RiftItem[]> = {
    reviews: reviewItems(pool, mastery, now, rngFor("reviews")),
    blitz: blitzItems(pool, rngFor("blitz")),
    frontier: frontier ? [frontier] : [],
    debug: debug ? [debug] : [],
    bonus: [],
  };
  const bonus = bonusItem(pool, mastery, rngFor("bonus"), new Set(frontier ? [frontier.id] : []));
  if (bonus) itemsByRoom.bonus = [bonus];
  const rooms: RiftRoom[] = ROOM_ORDER.map((id, index) => ({
    id,
    index,
    ...ROOM_TEXT[id],
    items: itemsByRoom[id],
    empty: itemsByRoom[id].length === 0,
  }));
  return { day, seed, rooms };
}
