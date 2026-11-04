/** Mart items and the economy rules from GDD §6.6. Pure data and helpers, no DOM. */

export type ItemId = "hint-token" | "debug-lens" | "complexity-compass" | "rematch-ticket";

export interface ItemDef {
  id: ItemId;
  name: string;
  price: number;
  /** Max a player can carry, so Bits cannot be hoarded into trivialising a problem. */
  maxOwned: number;
  blurb: string;
  /** What using it does to mastery credit for that attempt. */
  mastery: "none" | "assisted" | "one-tier-less";
  /** Only usable in these scaffolding modes (undefined = any). */
  modes?: readonly ("guided" | "standard" | "interview" | "contest")[];
}

export const ITEMS: readonly ItemDef[] = [
  { id: "hint-token", name: "Hint Token", price: 30, maxOwned: 20, blurb: "Opens one rung of the hint ladder. Rung 3 gives away the key insight, so the win counts as assisted.", mastery: "none", modes: ["standard"] },
  { id: "debug-lens", name: "Debug Lens", price: 80, maxOwned: 5, blurb: "Reveals one failing input from a Wrong Answer. Marks the problem assisted.", mastery: "assisted", modes: ["standard", "interview", "contest"] },
  { id: "complexity-compass", name: "Complexity Compass", price: 60, maxOwned: 5, blurb: "Shows the target time complexity. Mastery gain for that solve is one tier lower.", mastery: "one-tier-less", modes: ["standard", "interview", "contest"] },
  { id: "rematch-ticket", name: "Rematch Ticket", price: 50, maxOwned: 10, blurb: "Replay a solved problem at once, without waiting for it to come due. Gives normal credit; nothing is skipped.", mastery: "none" },
];

export const itemById = (id: string): ItemDef | undefined => ITEMS.find((i) => i.id === id);

export type Inventory = Record<string, number>;
export interface Wallet {
  bits: number;
  inventory: Inventory;
}

export type PurchaseResult = { ok: true; wallet: Wallet } | { ok: false; reason: "unknown-item" | "poor" | "full" };

export function buyItem(w: Wallet, id: string, qty = 1): PurchaseResult {
  const def = itemById(id);
  if (!def || !Number.isInteger(qty) || qty < 1) return { ok: false, reason: "unknown-item" };
  const owned = w.inventory[id] ?? 0;
  if (owned + qty > def.maxOwned) return { ok: false, reason: "full" };
  const cost = def.price * qty;
  if (w.bits < cost) return { ok: false, reason: "poor" };
  return { ok: true, wallet: { bits: w.bits - cost, inventory: { ...w.inventory, [id]: owned + qty } } };
}

/** Consumes one item. Returns null when none is owned. */
export function spendItem(inv: Inventory, id: string): Inventory | null {
  const owned = inv[id] ?? 0;
  if (owned < 1) return null;
  const next = { ...inv, [id]: owned - 1 };
  if (next[id] === 0) delete next[id];
  return next;
}
