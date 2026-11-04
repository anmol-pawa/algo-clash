/** Rust (GDD §6.2): an overdue item rusts its move icon and its Structling, and caps the type multiplier. */
import { DAY_MS, tierIndex, tierOf } from "./scheduler";
import type { ProblemMastery } from "../save/schema";

export type RustLevel = 0 | 1 | 2;

/** The highest type multiplier a rusty move may apply until it is reviewed. */
export const RUST_MULTIPLIER_CAP = 1.25;

/** Whole days overdue (0 when nothing is scheduled or it is not yet due). */
export function overdueDays(m: ProblemMastery, now: number): number {
  if (m.due <= 0 || tierIndex(tierOf(m)) < tierIndex("learning") || now <= m.due) return 0;
  return Math.floor((now - m.due) / DAY_MS);
}

/**
 * 0 = fresh, 1 = a light patina (overdue, but by less than half an interval or two days),
 * 2 = heavy rust. Any overdue item with a due date in the past is at least level 1, even by minutes.
 */
export function rustLevel(m: ProblemMastery, now: number): RustLevel {
  if (m.due <= 0 || tierIndex(tierOf(m)) < tierIndex("learning") || now <= m.due) return 0;
  const days = overdueDays(m, now);
  const grace = Math.max(2, Math.floor((m.intervalDays || 1) / 2));
  return days < grace ? 1 : 2;
}

/** Caps a type multiplier while the move is rusty. Reviewing the item (a solve that is due) clears it. */
export function capMultiplier(multiplier: number, rust: RustLevel): number {
  return rust > 0 ? Math.min(multiplier, RUST_MULTIPLIER_CAP) : multiplier;
}
