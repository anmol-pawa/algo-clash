// Pure timeline for the evolution scene: a white-silhouette morph between two forms.

export interface EvolutionFrame {
  /** which form to draw */
  form: "old" | "new";
  /** draw as a flat white silhouette */
  white: boolean;
  /** 0..1 strength of the glow rings around the creature */
  glow: number;
  /** 0..1 progress of the final white → colour reveal (only in the last phase) */
  reveal: number;
  done: boolean;
}

export const CHARGE_MS = 700;
export const FLICKER_MS = 2300;
export const HOLD_MS = 300;
export const REVEAL_MS = 500;
export const EVOLUTION_MS = CHARGE_MS + FLICKER_MS + HOLD_MS + REVEAL_MS;

/** Flicker half-period shrinks from 280 ms to 50 ms (accelerating swaps, like a handheld evolve). */
export function flickerPeriod(p: number): number {
  return 280 - 230 * Math.min(1, Math.max(0, p));
}

export function evolutionFrame(t: number): EvolutionFrame {
  if (t >= EVOLUTION_MS) return { form: "new", white: false, glow: 0, reveal: 1, done: true };
  if (t < CHARGE_MS) {
    // old form, strobing white in the last part of the charge
    const white = t > CHARGE_MS * 0.5 && Math.floor(t / 90) % 2 === 0;
    return { form: "old", white, glow: t / CHARGE_MS * 0.5, reveal: 0, done: false };
  }
  const f = t - CHARGE_MS;
  if (f < FLICKER_MS) {
    // integrate the accelerating period to find which swap we're in
    let acc = 0, n = 0;
    while (acc < f) { acc += flickerPeriod(acc / FLICKER_MS); n++; }
    return { form: n % 2 === 0 ? "old" : "new", white: true, glow: 0.5 + 0.5 * (f / FLICKER_MS), reveal: 0, done: false };
  }
  const h = f - FLICKER_MS;
  if (h < HOLD_MS) return { form: "new", white: true, glow: 1, reveal: 0, done: false };
  const r = (h - HOLD_MS) / REVEAL_MS;
  return { form: "new", white: r < 0.5, glow: 1 - r, reveal: r, done: false };
}
