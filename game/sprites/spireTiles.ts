import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline } from "./grid";

/** Stackspire tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const SPIRE_TILE = 16;

// Palette slots.
const L = 1, // outline
  FL1 = 2, FL2 = 3, FL3 = 4, // flagstone dark->light (warm grey)
  SL1 = 5, SL2 = 6, SL3 = 7, // slate slab dark->light (blue-grey, matches the Sentinel)
  BZ1 = 8, BZ2 = 9, BZ3 = 10, // bronze dark->light
  RN1 = 11, RN2 = 12, // rune glow teal dark, light
  BK1 = 13, BK2 = 14, BK3 = 15, // tower brick dark->light
  SK1 = 16, SK2 = 17, SK3 = 18, // dusk sky low->high
  CL1 = 19, CL2 = 20, // cloud shade, light
  CR1 = 21, CR2 = 22, CR3 = 23, // crate wood dark->light
  FR1 = 24, FR2 = 25, FR3 = 26, // flame red, orange, yellow
  BN1 = 27, BN2 = 28, // banner red dark, light
  WD1 = 29, WD2 = 30, // door wood dark, light
  MS = 31; // moss fleck

export const SPIRE_PALETTE = [
  "", "#14171f",
  "#6e6a66", "#8f8a84", "#b3ada4",
  "#3d4658", "#566179", "#7886a3",
  "#7a4a1e", "#b0702c", "#e0a24a",
  "#1f7f86", "#6fe3d0",
  "#5a3a3a", "#7d5050", "#a06c68",
  "#2c2f5a", "#4b4f86", "#8a7fb0",
  "#6b6a92", "#c9c6e0",
  "#6a4628", "#92623a", "#b98652",
  "#b23a2a", "#e8782e", "#ffd25a",
  "#8c2430", "#c4404a",
  "#4a2f1c", "#6e4a2c",
  "#58704a",
];

export const SPIRE_TILE_NAMES = [
  "floor", "floor2", "rune", "path", "wall", "slabs", "pillar", "torch", "banner", "sky",
  "ledge", "crates", "statue", "stairs", "tower", "door",
] as const;
export type SpireTileName = (typeof SPIRE_TILE_NAMES)[number];

/** Tiles that block the player. Floors, path, rune pads and stairs are walkable. */
export const SPIRE_SOLID: ReadonlySet<SpireTileName> = new Set<SpireTileName>([
  "wall", "slabs", "pillar", "torch", "sky", "ledge", "crates", "statue", "tower",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function floor(g: Grid, seed: number): void {
  fillRect(g, 0, 0, 16, 16, FL2);
  // 2x2 big flagstones with mortar lines and a few chips
  fillRect(g, 0, 7, 16, 1, FL1); fillRect(g, 0, 15, 16, 1, FL1);
  fillRect(g, 7, 0, 1, 7, FL1); fillRect(g, 3, 8, 1, 7, FL1); fillRect(g, 12, 8, 1, 7, FL1);
  fillRect(g, 0, 0, 7, 1, FL3); fillRect(g, 8, 0, 8, 1, FL3);
  fillRect(g, 0, 8, 3, 1, FL3); fillRect(g, 4, 8, 8, 1, FL3); fillRect(g, 13, 8, 3, 1, FL3);
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(hash(i, 1, seed) * 16), y = Math.floor(hash(i, 2, seed) * 16);
    if (g.get(x, y) === FL2) g.set(x, y, hash(i, 3, seed) < 0.5 ? FL1 : FL3);
  }
  if (seed === 2) { g.set(5, 4, MS); g.set(6, 4, MS); g.set(5, 5, MS); } // a patch of moss
}

function rune(g: Grid, frame: number): void {
  floor(g, 1);
  // an inscribed square with a pulsing glyph: "push" arrow pointing up
  fillRect(g, 2, 2, 12, 12, SL1);
  fillRect(g, 3, 3, 10, 10, SL2);
  fillRect(g, 3, 3, 10, 1, SL3);
  const glow = frame % 2 ? RN2 : RN1;
  fillRect(g, 7, 4, 2, 8, glow);
  g.set(6, 5, glow); g.set(9, 5, glow); g.set(5, 6, glow); g.set(10, 6, glow);
  fillRect(g, 5, 12, 6, 1, RN1);
  g.set(2, 2, BZ2); g.set(13, 2, BZ2); g.set(2, 13, BZ2); g.set(13, 13, BZ2);
}

function path(g: Grid): void {
  // worn stone stack-courses: horizontal slabs of alternating tint
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    fillRect(g, 0, y, 16, 3, row % 2 ? SL2 : SL1);
    fillRect(g, 0, y, 16, 1, row % 2 ? SL3 : SL2);
    fillRect(g, 0, y + 3, 16, 1, L);
    const j = 3 + ((row * 5) % 10);
    fillRect(g, j, y, 1, 3, L);
  }
}

function wall(g: Grid): void {
  // brick curtain wall with battlement shadow
  fillRect(g, 0, 0, 16, 16, BK2);
  for (let row = 0; row < 4; row++) {
    const y = row * 4, off = row % 2 ? 4 : 0;
    fillRect(g, 0, y + 3, 16, 1, BK1);
    for (let x = -off; x < 16; x += 8) { fillRect(g, x + 7, y, 1, 3, BK1); fillRect(g, x, y, 7, 1, BK3); }
  }
  fillRect(g, 0, 15, 16, 1, L);
}

function slabs(g: Grid): void {
  // the namesake: a stack of four slate slabs narrowing upward (push order)
  floor(g, 3);
  const widths = [14, 12, 10, 8];
  for (let i = 0; i < 4; i++) {
    const w = widths[i], x = 8 - w / 2, y = 11 - i * 3;
    fillRect(g, x - 1, y - 1, w + 2, 4, L);
    fillRect(g, x, y, w, 2, SL2);
    fillRect(g, x, y, w, 1, SL3);
    fillRect(g, x, y + 2, w, 1, SL1);
    g.set(x + 1, y + 1, BZ3); g.set(x + w - 2, y + 1, BZ2); // bronze corner studs
  }
  fillRect(g, 3, 14, 10, 1, FL1);
}

function pillar(g: Grid): void {
  floor(g, 1);
  fillRect(g, 3, 1, 10, 14, L);
  fillRect(g, 4, 2, 8, 12, SL2);
  fillRect(g, 4, 2, 2, 12, SL3); fillRect(g, 10, 2, 2, 12, SL1);
  fillRect(g, 3, 1, 10, 2, BZ2); fillRect(g, 3, 1, 10, 1, BZ3); // capital
  fillRect(g, 3, 13, 10, 2, BZ1);
  for (const y of [5, 8, 11]) fillRect(g, 4, y, 8, 1, SL1); // drum joints
}

function torch(g: Grid, frame: number): void {
  floor(g, 2);
  fillRect(g, 7, 7, 2, 7, L); fillRect(g, 7, 8, 1, 6, BZ3); fillRect(g, 8, 8, 1, 6, BZ1);
  fillRect(g, 4, 13, 8, 2, L); fillRect(g, 5, 13, 6, 1, BZ2);
  fillRect(g, 5, 5, 6, 3, L); fillRect(g, 6, 6, 4, 1, BZ2); // brazier bowl
  const h = 4 - (frame % 2);
  ellipse(g, 8, 4, 3, h, FR1);
  ellipse(g, 8, 4, 2, h - 1, FR2);
  fillRect(g, 7, 3 + (frame % 2), 2, 2, FR3);
}

function banner(g: Grid, frame: number): void {
  wall(g);
  fillRect(g, 2, 1, 12, 1, BZ2); // rod
  fillRect(g, 3, 2, 10, 11, L);
  fillRect(g, 4, 2, 8, 10, BN1);
  fillRect(g, 4, 2, 2, 10, BN2);
  // pennant tail that sways between two notch positions
  const n = frame % 2;
  for (let x = 4; x < 12; x++) { const dip = Math.abs(x - (7 + n)) < 1 ? 0 : 3; fillRect(g, x, 12 - dip + 1, 1, 1 + dip, BN1); }
  // emblem: a three-slab stack
  fillRect(g, 6, 4, 4, 1, BZ3); fillRect(g, 5, 6, 6, 1, BZ3); fillRect(g, 4, 8, 8, 1, BZ3);
}

function sky(g: Grid, frame: number): void {
  for (let y = 0; y < 16; y++) fillRect(g, 0, y, 16, 1, y < 5 ? SK3 : y < 11 ? SK2 : SK1);
  for (let i = 0; i < 4; i++) { // stars
    const x = Math.floor(hash(i, 5, 7) * 16), y = Math.floor(hash(i, 6, 7) * 5);
    g.set(x, y, CL2);
  }
  const cx = (frame * 3 + 2) % 16; // cloud drifts across tiles
  for (const [dx, w, y] of [[0, 6, 9], [2, 8, 8], [1, 5, 10]] as const) {
    for (let x = 0; x < w; x++) g.set((cx + dx + x) % 16, y, y === 8 ? CL2 : CL1);
  }
}

function ledge(g: Grid): void {
  // parapet lip at the world edge, sky below
  sky(g, 0);
  fillRect(g, 0, 0, 16, 7, FL2);
  fillRect(g, 0, 0, 16, 1, FL3);
  fillRect(g, 0, 6, 16, 1, FL1);
  fillRect(g, 0, 7, 16, 2, L);
  for (let x = 1; x < 16; x += 5) fillRect(g, x, 9, 3, 3, SL1); // brackets
}

function crates(g: Grid): void {
  floor(g, 1);
  // two stacked crates: a visible LIFO pile
  for (const [x, y, w] of [[2, 8, 12], [4, 2, 8]] as const) {
    fillRect(g, x, y, w, 6, L);
    fillRect(g, x + 1, y + 1, w - 2, 4, CR2);
    fillRect(g, x + 1, y + 1, w - 2, 1, CR3);
    fillRect(g, x + 1, y + 4, w - 2, 1, CR1);
    fillRect(g, x + 1, y + 1, 1, 4, CR3);
    g.set(x + 2, y + 2, BZ3); g.set(x + w - 3, y + 2, BZ3);
  }
  fillRect(g, 3, 14, 12, 1, FL1);
}

function statue(g: Grid): void {
  floor(g, 3);
  fillRect(g, 3, 11, 10, 4, L); fillRect(g, 4, 11, 8, 3, SL2); fillRect(g, 4, 11, 8, 1, SL3); // plinth
  fillRect(g, 6, 4, 4, 7, L); fillRect(g, 7, 5, 2, 6, SL3); fillRect(g, 9, 5, 1, 6, SL2); // body
  ellipse(g, 8, 3, 2, 2, L); ellipse(g, 8, 3, 1, 1, SL3); // head
  fillRect(g, 5, 6, 1, 3, SL2); fillRect(g, 10, 6, 1, 3, SL2); // arms
  g.set(8, 1, BN2); // plume
}

function stairs(g: Grid): void {
  for (let i = 0; i < 4; i++) {
    const y = i * 4;
    fillRect(g, 0, y, 16, 4, FL2);
    fillRect(g, 0, y, 16, 1, FL3); // lit tread edge
    fillRect(g, 0, y + 2, 16, 1, FL1); // riser shadow
    fillRect(g, 0, y + 3, 16, 1, L);
  }
}

function tower(g: Grid): void {
  // a round tower segment: brick with arrow-slit windows and a bronze band
  fillRect(g, 0, 0, 16, 16, BK2);
  fillRect(g, 0, 0, 3, 16, BK1); fillRect(g, 13, 0, 3, 16, BK1);
  fillRect(g, 3, 0, 2, 16, BK3);
  for (let row = 0; row < 4; row++) fillRect(g, 0, row * 4 + 3, 16, 1, BK1);
  fillRect(g, 7, 3, 2, 6, L); fillRect(g, 7, 4, 2, 4, SK2); g.set(7, 4, CL2); // arrow slit
  fillRect(g, 0, 11, 16, 2, BZ1); fillRect(g, 0, 11, 16, 1, BZ2);
  outline(g, L);
}

function door(g: Grid): void {
  wall(g);
  fillRect(g, 3, 4, 10, 12, L);
  ellipse(g, 8, 5, 5, 3, L);
  fillRect(g, 4, 5, 8, 11, WD2);
  ellipse(g, 8, 5, 4, 2, WD2);
  fillRect(g, 4, 5, 1, 11, WD1); fillRect(g, 11, 5, 1, 11, WD1);
  fillRect(g, 7, 3, 2, 13, L);
  fillRect(g, 4, 8, 8, 1, BZ1); fillRect(g, 4, 12, 8, 1, BZ1); // iron-bronze straps
  g.set(6, 10, BZ3); g.set(9, 10, BZ3); // ring handles
  fillRect(g, 2, 3, 12, 1, BZ2); // lintel
}

function build(name: SpireTileName, frame: number): Grid {
  const g = new Grid(SPIRE_TILE, SPIRE_TILE);
  switch (name) {
    case "floor": floor(g, 1); break;
    case "floor2": floor(g, 2); break;
    case "rune": rune(g, frame); break;
    case "path": path(g); break;
    case "wall": wall(g); break;
    case "slabs": slabs(g); break;
    case "pillar": pillar(g); break;
    case "torch": torch(g, frame); break;
    case "banner": banner(g, frame); break;
    case "sky": sky(g, frame); break;
    case "ledge": ledge(g); break;
    case "crates": crates(g); break;
    case "statue": statue(g); break;
    case "stairs": stairs(g); break;
    case "tower": tower(g); break;
    case "door": door(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<SpireTileName, number>> = { rune: 2, torch: 2, banner: 2, sky: 4 };

export function buildSpireTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of SPIRE_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "torch" ? 220 : n === "sky" ? 700 : 450;
  }
  return { w: SPIRE_TILE, h: SPIRE_TILE, palette: SPIRE_PALETTE, anims, frameMs };
}
