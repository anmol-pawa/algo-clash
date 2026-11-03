// Frame-animated pixel move effects (pure grids, no DOM). 32x32, 5 frames each.
// Palette index: 0 transparent, 1 outline, 2 shadow, 3 mid, 4 light, 5 white.
import { Grid, ellipse } from "@/game/sprites/grid";
import { EFFECT_FRAMES, type EffectKind } from "@/lib/battle/stagefx";

export const EFFECT_SIZE = 32;

export const EFFECT_PALETTES: Record<EffectKind, string[]> = {
  slash: ["", "#2a3350", "#8fb6d9", "#cfe6f7", "#f2f9ff", "#ffffff"],
  burst: ["", "#6b2a12", "#e8742c", "#ffb13b", "#ffe27a", "#fffbe6"],
  bolt: ["", "#2a1a5e", "#7a4fd6", "#b48cff", "#e3d2ff", "#ffffff"],
};

function line(g: Grid, x0: number, y0: number, x1: number, y1: number, thick: number, c: number): void {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n);
    const r = Math.max(0, Math.floor(thick / 2));
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + 1) g.set(x + dx, y + dy, c);
  }
}

/** Draw a line with an outline, a body and a bright core. */
function glowLine(g: Grid, x0: number, y0: number, x1: number, y1: number, thick: number): void {
  line(g, x0, y0, x1, y1, thick + 2, 1);
  line(g, x0, y0, x1, y1, thick, 3);
  if (thick >= 2) line(g, x0, y0, x1, y1, thick - 1, 4);
  line(g, x0, y0, x1, y1, Math.max(0, thick - 3), 5);
}

function slashFrame(i: number): Grid {
  const g = new Grid(EFFECT_SIZE, EFFECT_SIZE);
  const t = Math.min(1, (i + 1) / 3); // sweep grows over the first three frames
  const fade = i >= 3;
  for (const off of [-6, 0, 6]) {
    const len = 24 * t;
    const drift = fade ? (i - 2) * 3 : 0; // the trail slides away as it fades
    const x0 = 4 + off * 0.4 + drift, y0 = 4 - off * 0.4 + 8 + drift * 0.9;
    const x1 = 4 + off * 0.4 + len, y1 = 4 - off * 0.4 + 8 + len * 0.9;
    glowLine(g, x0, y0 + off * 0.6, x1, y1 + off * 0.6, fade ? 1 : off === 0 ? 3 : 2);
  }
  return g;
}

function burstFrame(i: number): Grid {
  const g = new Grid(EFFECT_SIZE, EFFECT_SIZE);
  const cx = 16, cy = 16;
  const grow = [0.35, 0.7, 1, 0.85, 0.55][i];
  const rays = 8;
  for (let k = 0; k < rays; k++) {
    const a = (k / rays) * Math.PI * 2 + (i % 2) * 0.2;
    const r0 = 3 * grow, r1 = (k % 2 ? 9 : 14) * grow;
    glowLine(g, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, k % 2 ? 1 : 2);
  }
  const rr = Math.max(1, Math.round(5 * grow));
  ellipse(g, cx, cy, rr + 1, rr + 1, 1);
  ellipse(g, cx, cy, rr, rr, 3);
  ellipse(g, cx, cy, Math.max(1, rr - 2), Math.max(1, rr - 2), 5);
  return g;
}

function boltFrame(i: number): Grid {
  const g = new Grid(EFFECT_SIZE, EFFECT_SIZE);
  const flicker = [0, 2, -1, 3, 0][i];
  const pts = [[18 + flicker, 0], [11 - flicker, 11], [20, 13], [9 + flicker, 31]];
  const shown = i === 4 ? 2 : pts.length - 1;
  for (let k = 0; k < shown; k++) glowLine(g, pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], i === 4 ? 1 : 2);
  if (i >= 1 && i <= 3) ellipse(g, 10, 29, 3 + (i === 2 ? 1 : 0), 2, 4);
  return g;
}

const BUILDERS: Record<EffectKind, (i: number) => Grid> = { slash: slashFrame, burst: burstFrame, bolt: boltFrame };

/** All frames of an effect, built deterministically. */
export function effectFrames(kind: EffectKind): Grid[] {
  return Array.from({ length: EFFECT_FRAMES }, (_, i) => BUILDERS[kind](i));
}
