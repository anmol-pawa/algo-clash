/**
 * Items, the Mart and the inventory (GDD §6.6). Pure functions over `CoreSave`: no DOM, no clock.
 * Rule: nothing purchasable advances mastery or skips content.
 */
import type { CoreSave, ProblemMastery } from "../save/schema";
import { TIERS, tierIndex, tierOf } from "../srs/scheduler";
import { ASSISTED_HINT_COUNT } from "./hints";

export type ItemId = "hint-token" | "debug-lens" | "complexity-compass" | "rematch-ticket";

export interface ItemDef {
  id: ItemId;
  name: string;
  /** Price in Bits at the Mart. */
  price: number;
  /** Max a trainer can carry. */
  cap: number;
  /** What it does, in the Mart's words. */
  blurb: string;
  /** The honest cost to mastery, shown before use. */
  cost: string;
}

export const ITEMS: readonly ItemDef[] = [
  { id: "hint-token", name: "Hint Token", price: 15, cap: 30, blurb: "Reveals the next rung of the hint ladder: Nudge, Approach, then Key insight.", cost: "Each hint costs 15% foe damage. The Key insight (3rd) makes the win assisted." },
  { id: "debug-lens", name: "Debug Lens", price: 40, cap: 10, blurb: "Reveals one failing input, even in Interview mode.", cost: "The win counts as assisted: no mastery advance." },
  { id: "complexity-compass", name: "Complexity Compass", price: 30, cap: 10, blurb: "Shows the target time complexity before you code.", cost: "Mastery gain from this win is reduced by one tier." },
  { id: "rematch-ticket", name: "Rematch Ticket", price: 25, cap: 10, blurb: "Brings a fainted problem back right now instead of tomorrow.", cost: "None, but it does not skip the review: you still have to solve it." },
];

export const itemDef = (id: string): ItemDef | undefined => ITEMS.find((i) => i.id === id);

/** Every new trainer starts with this kit so the first hints are free of Bits pressure. */
export const STARTER_KIT: Readonly<Partial<Record<ItemId, number>>> = { "hint-token": 3 };
const STARTER_FLAG = "items.starterKit";

export const countOf = (core: CoreSave, id: ItemId): number => core.inventory[id] ?? 0;

/** Grants the starter kit exactly once. */
export function grantStarterKit(core: CoreSave): CoreSave {
  if (core.flags[STARTER_FLAG]) return core;
  const inventory = { ...core.inventory };
  for (const [id, n] of Object.entries(STARTER_KIT)) inventory[id] = Math.min(itemDef(id)?.cap ?? n, (inventory[id] ?? 0) + (n ?? 0));
  return { ...core, inventory, flags: { ...core.flags, [STARTER_FLAG]: true } };
}

export type BuyResult = { ok: true; core: CoreSave; spent: number } | { ok: false; reason: "unknown" | "bits" | "cap" | "qty" };

/** Buys `qty` of an item. Refuses (without partial effects) when short of Bits or over the carry cap. */
export function buy(core: CoreSave, id: string, qty = 1): BuyResult {
  const def = itemDef(id);
  if (!def) return { ok: false, reason: "unknown" };
  if (!Number.isInteger(qty) || qty < 1) return { ok: false, reason: "qty" };
  const have = countOf(core, def.id);
  if (have + qty > def.cap) return { ok: false, reason: "cap" };
  const cost = def.price * qty;
  if (core.profile.bits < cost) return { ok: false, reason: "bits" };
  return {
    ok: true,
    spent: cost,
    core: { ...core, profile: { ...core.profile, bits: core.profile.bits - cost }, inventory: { ...core.inventory, [def.id]: have + qty } },
  };
}

/** Uses one item; returns null when none is held. */
export function consume(core: CoreSave, id: ItemId): CoreSave | null {
  const have = countOf(core, id);
  if (have < 1) return null;
  return { ...core, inventory: { ...core.inventory, [id]: have - 1 } };
}

/** What a battle used, to decide how the win counts. */
export interface Assistance {
  hintsUsed: number;
  lens: boolean;
  compass: boolean;
  editorialRead: boolean;
  guided: boolean;
}

export const NO_ASSISTANCE: Assistance = { hintsUsed: 0, lens: false, compass: false, editorialRead: false, guided: false };

/** True when the win must not advance mastery (GDD §6.2, §6.6). The Compass is a separate, milder penalty. */
export function isAssisted(a: Assistance): boolean {
  return a.editorialRead || a.guided || a.lens || a.hintsUsed >= ASSISTED_HINT_COUNT;
}

/**
 * Complexity Compass: the tier gained by this win is cut by one. `before` is the record ahead of the solve,
 * `after` what the scheduler produced. Only tier advances are reduced; everything else (solves, due) stands.
 */
export function applyCompassPenalty(before: ProblemMastery, after: ProblemMastery): ProblemMastery {
  const b = tierIndex(tierOf(before));
  const a = tierIndex(tierOf(after));
  if (a <= b) return after;
  const reduced = Math.max(b, a - 1);
  return { ...after, state: TIERS[reduced] };
}

/** Rematch Ticket: the problem is due now. Returns null for a problem the trainer has never met. */
export function rematchNow(core: CoreSave, problemId: string, now: number): CoreSave | null {
  const m = core.mastery[problemId];
  if (!m) return null;
  return { ...core, mastery: { ...core.mastery, [problemId]: { ...m, due: Math.min(m.due || now, now) } } };
}

/** Spends one Rematch Ticket on `problemId`. Null when none is held or the problem has no mastery record. */
export function spendRematchTicket(core: CoreSave, problemId: string, now: number): CoreSave | null {
  const spent = consume(core, "rematch-ticket");
  return spent ? rematchNow(spent, problemId, now) : null;
}
