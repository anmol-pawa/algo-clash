/** Aggregates per-problem mastery into pattern mastery and Structling levels (GDD §6.1, §6.2). */
import type { ProblemMastery } from "../save/schema";
import { tierOf, type Tier } from "./scheduler";
import { rustLevel } from "./rust";

/** Credit per tier on a 0..1 scale. */
export const TIER_SCORE: Record<Tier, number> = { unseen: 0, seen: 0.1, learning: 0.3, practiced: 0.55, mastered: 0.85, ingrained: 1 };

/** Weights towards harder problems, as the GDD asks. */
export const DIFFICULTY_WEIGHT = { E: 1, M: 2, H: 3 } as const;
export type Difficulty = keyof typeof DIFFICULTY_WEIGHT;

/** Score of one item: its tier credit, reduced a fifth per rust level step (heavy rust loses 40 %). */
export function itemScore(m: ProblemMastery | undefined, now: number): number {
  if (!m) return 0;
  return TIER_SCORE[tierOf(m)] * (1 - 0.2 * rustLevel(m, now));
}

export interface PatternItem {
  id: string;
  difficulty: Difficulty;
}

/** Weighted mean of item scores in a pattern, 0..1. An empty pattern is 0. */
export function patternMastery(items: readonly PatternItem[], mastery: Record<string, ProblemMastery>, now: number): number {
  let num = 0;
  let den = 0;
  for (const it of items) {
    const w = DIFFICULTY_WEIGHT[it.difficulty];
    num += w * itemScore(mastery[it.id], now);
    den += w;
  }
  return den === 0 ? 0 : num / den;
}

/** A Structling's level is the average mastery of its equipped moves times 10 (GDD §6.1), 0..10, one decimal. */
export function structlingLevel(moveIds: readonly string[], mastery: Record<string, ProblemMastery>, now: number): number {
  if (moveIds.length === 0) return 0;
  const avg = moveIds.reduce((s, id) => s + itemScore(mastery[id], now), 0) / moveIds.length;
  return Math.round(avg * 100) / 10;
}
