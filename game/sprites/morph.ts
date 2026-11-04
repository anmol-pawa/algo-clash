import { Grid } from "./grid";

const BAYER4 = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
];

/** Palette index used for the white flash (shared by the creature palettes). */
export const FLASH = 14;

export interface MorphStep { grid: Grid; ms: number }

const sil = (src: Grid): Grid => {
  const o = new Grid(src.w, src.h);
  for (let i = 0; i < src.d.length; i++) o.d[i] = src.d[i] ? FLASH : 0;
  return o;
};

/**
 * Evolution sequence between two same-palette sprites: the old form pulses to white, its silhouette
 * dissolves (ordered dither) into the union with the new silhouette, then into the new silhouette
 * alone, and the new form's colours fade back in. Pure: returns grids and per-step durations.
 */
export function evolutionSteps(from: Grid, to: Grid): MorphStep[] {
  const white = sil(from);
  const target = sil(to);
  const steps: MorphStep[] = [
    { grid: from, ms: 400 },
    { grid: white, ms: 140 },
    { grid: from, ms: 140 },
    { grid: white, ms: 110 },
    { grid: from, ms: 110 },
    { grid: white, ms: 90 },
  ];
  // white from -> white to, in 6 dithered levels
  for (let level = 1; level <= 6; level++) {
    const o = new Grid(from.w, from.h);
    const t = level / 7;
    for (let y = 0; y < from.h; y++) for (let x = 0; x < from.w; x++) {
      const a = white.get(x, y), b = target.get(x, y);
      const useTarget = BAYER4[y & 3][x & 3] / 16 < t;
      o.set(x, y, useTarget ? b : a);
    }
    steps.push({ grid: o, ms: 90 });
  }
  steps.push({ grid: target, ms: 220 });
  // colour fade-in: reveal the new form through the dither
  for (let level = 1; level <= 4; level++) {
    const o = new Grid(to.w, to.h);
    const t = level / 5;
    for (let y = 0; y < to.h; y++) for (let x = 0; x < to.w; x++)
      o.set(x, y, BAYER4[y & 3][x & 3] / 16 < t ? to.get(x, y) : target.get(x, y));
    steps.push({ grid: o, ms: 110 });
  }
  steps.push({ grid: to, ms: 600 });
  return steps;
}
