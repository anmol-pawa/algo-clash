/** Pure timeline of the evolution scene (white-silhouette morph). No DOM; the scene just draws this state. */
export const EVOLVE_MS = { intro: 1200, morph: 2400, flash: 400, reveal: 1400 } as const;
export const EVOLVE_TOTAL_MS = EVOLVE_MS.intro + EVOLVE_MS.morph + EVOLVE_MS.flash + EVOLVE_MS.reveal;

export type EvolvePhase = "intro" | "morph" | "flash" | "reveal" | "done";

export interface EvolveState {
  phase: EvolvePhase;
  /** which sprite to draw: the old form, the new form, or the matching white silhouettes */
  sprite: "old" | "new";
  white: boolean;
  /** 0..1 white overlay (the flash) */
  flash: number;
  /** sprite scale multiplier (pulses while morphing) */
  scale: number;
  /** 0..1 progress of the expanding rings and sparkles */
  burst: number;
}

/** Silhouette flips between old and new at a rate that speeds up: the Pokémon-style "blink morph" feel, original timing. */
export function flipAt(morphT: number): "old" | "new" {
  // morphT in 0..1. Flip k happens at time f(k) with shrinking gaps; an odd flip count means "new".
  let flips = 0;
  let gap = 0.2, at = 0.2;
  while (at < morphT && flips < 40) { flips++; gap *= 0.8; at += gap; }
  return flips % 2 === 0 ? "old" : "new";
}

export function evolveState(tMs: number, reduceMotion = false): EvolveState {
  if (reduceMotion || tMs >= EVOLVE_TOTAL_MS) return { phase: "done", sprite: "new", white: false, flash: 0, scale: 1, burst: 1 };
  const t = Math.max(0, tMs);
  const { intro, morph, flash, reveal } = EVOLVE_MS;
  if (t < intro) return { phase: "intro", sprite: "old", white: false, flash: 0, scale: 1, burst: 0 };
  if (t < intro + morph) {
    const m = (t - intro) / morph;
    // From a third of the way in the sprite is a white silhouette that flips between the two forms.
    const white = m > 0.25;
    return {
      phase: "morph",
      sprite: white ? flipAt((m - 0.25) / 0.75) : "old",
      white,
      flash: 0,
      scale: 1 + (white ? 0.06 * Math.sin(m * 40) : 0) + m * 0.08,
      burst: m,
    };
  }
  if (t < intro + morph + flash) {
    const f = (t - intro - morph) / flash;
    return { phase: "flash", sprite: "new", white: true, flash: f < 0.5 ? f * 2 : 2 - f * 2, scale: 1.1, burst: 1 };
  }
  const r = (t - intro - morph - flash) / reveal;
  return { phase: "reveal", sprite: "new", white: r < 0.15, flash: 0, scale: 1.1 - 0.1 * Math.min(1, r * 2), burst: r };
}
