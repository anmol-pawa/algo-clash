import type { Rng } from "../content/rng";
import type { Card, ParsonsCard } from "./types";

/** Pick up to `n` distinct cards, preferring ones not in `seen`; shuffled. */
export function pickDeck(cards: readonly Card[], n: number, rng: Rng, seen: ReadonlySet<string> = new Set()): Card[] {
  const fresh = rng.shuffle(cards.filter((c) => !seen.has(c.id)));
  const rest = rng.shuffle(cards.filter((c) => seen.has(c.id)));
  return [...fresh, ...rest].slice(0, n);
}

/** Shuffled order of a Parsons card's lines; never the solved order (unless every line is identical). */
export function parsonsShuffle(card: ParsonsCard, rng: Rng): string[] {
  const solved = card.lines.join("\n");
  for (let tries = 0; tries < 50; ++tries) {
    const s = rng.shuffle(card.lines);
    if (s.join("\n") !== solved) return s;
  }
  return [...card.lines].reverse();
}

/** XP for a concept card: 10 base, +5 on the first try, +1 per streak step (cap +5). Wrong answers give 2 for trying. */
export function cardXp(correct: boolean, firstTry: boolean, streak: number): number {
  if (!correct) return 2;
  return 10 + (firstTry ? 5 : 0) + Math.min(5, Math.max(0, streak));
}
