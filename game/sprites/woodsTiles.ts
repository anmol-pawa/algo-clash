import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline, shade } from "./grid";

/** Window Woods tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const WOODS_TILE = 16;

// Palette slots.
const L = 1, // outline
  G1 = 2, G2 = 3, G3 = 4, G4 = 5, // grass dark->light
  PN1 = 6, PN2 = 7, PN3 = 8, PN4 = 9, // pine needles dark->light
  TK1 = 10, TK2 = 11, TK3 = 12, // bark dark->light
  DT1 = 13, DT2 = 14, DT3 = 15, // dirt path dark->light
  GL1 = 16, GL2 = 17, GL3 = 18, GL4 = 19, // glass pane: shadow, tint, light, glint
  FR1 = 20, FR2 = 21, // window frame wood dark, light
  WT1 = 22, WT2 = 23, WT3 = 24, WT4 = 25, // stream dark->light, 25 = foam
  RK1 = 26, RK2 = 27, RK3 = 28, // stone dark->light
  MS1 = 29, MS2 = 30, // mushroom cap red, spot cream
  FL1 = 31, FL2 = 32, // fern frond mid, light
  LF1 = 33, LF2 = 34; // fallen leaves amber, orange

export const WOODS_PALETTE = [
  "", "#16201a",
  "#2f6b3a", "#3b8346", "#4c9d54", "#6dba66",
  "#12452c", "#1b5e3a", "#26784a", "#3d9a5c",
  "#5a3d26", "#7d5736", "#a07848",
  "#8a6a42", "#a88557", "#c6a572",
  "#4a7a8c", "#7fb6c9", "#b7e0ee", "#f2fdff",
  "#6b4a2c", "#9a7040",
  "#2b6f8e", "#3f93b3", "#6cbad3", "#e8fbff",
  "#585e56", "#7b8278", "#a1a89a",
  "#c8433a", "#f6ead2",
  "#58b05c", "#8fd681",
  "#d19a3a", "#e3732e",
];

export const WOODS_TILE_NAMES = [
  "grass", "grass2", "path", "pathEdge", "pine", "glassPane", "stump", "fern",
  "stream", "bridge", "mushroom", "boulder", "leafPile", "fence",
] as const;
export type WoodsTileName = (typeof WOODS_TILE_NAMES)[number];

/** Tiles that block the player. Ferns, leaf piles, paths and the bridge are walkable. */
export const WOODS_SOLID: ReadonlySet<WoodsTileName> = new Set<WoodsTileName>([
  "pine", "glassPane", "stump", "stream", "boulder", "fence",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function grassBase(g: Grid, seed: number): void {
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.12 ? G1 : r > 0.9 ? G4 : G2);
    }
  // short blades: a dark base pixel with a light tip above it
  for (let i = 0; i < 5; i++) {
    const x = 1 + Math.floor(hash(i, 1, seed) * 13), y = 3 + Math.floor(hash(i, 2, seed) * 12);
    g.set(x, y, G1); g.set(x, y - 1, G3); g.set(x + 1, y - 2, G4);
  }
}

function dirtBase(g: Grid, seed: number): void {
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.12 ? DT1 : r > 0.9 ? DT3 : DT2);
    }
  for (let i = 0; i < 3; i++) { // pebbles
    const x = 2 + Math.floor(hash(i, 4, seed) * 11), y = 2 + Math.floor(hash(i, 5, seed) * 11);
    g.set(x, y, RK2); g.set(x + 1, y, RK3);
  }
}

function pathEdge(g: Grid): void {
  dirtBase(g, 3);
  for (let x = 0; x < WOODS_TILE; x++) {
    const edge = 3 + Math.round(Math.sin(x * 0.9) * 1.2);
    for (let y = 0; y <= edge; y++) g.set(x, y, y === edge ? G1 : hash(x, y, 5) < 0.12 ? G1 : G2);
    if (hash(x, 2, 4) > 0.6) g.set(x, edge + 1, G3);
  }
}

function pine(g: Grid): void {
  grassBase(g, 6);
  fillRect(g, 7, 12, 3, 4, TK2); fillRect(g, 7, 12, 1, 4, TK3); fillRect(g, 9, 12, 1, 4, TK1);
  // three drooping tiers of needles, each wider than the one above; lit from the left
  const tiers: Array<[number, number, number]> = [[1, 4, 3], [4, 8, 5], [8, 13, 7]]; // [top y, bottom y, max half width]
  for (const [y0, y1, maxHalf] of tiers)
    for (let y = y0; y <= y1; y++) {
      const half = Math.max(1, Math.round(((y - y0 + 1) / (y1 - y0 + 1)) * maxHalf));
      for (let x = 8 - half; x <= 8 + half; x++) {
        const t = (x - (8 - half)) / (2 * half); // 0 lit side .. 1 shade side
        const band = t < 0.3 ? 2 : t < 0.7 ? 1 : 0;
        g.set(x, y, Math.max(PN1, Math.min(PN4, PN1 + band + (y === y0 ? 1 : 0) - (y === y1 ? 1 : 0))));
      }
    }
  g.set(8, 0, PN3); g.set(8, 1, PN4);
  outline(g, L);
}

function glassPane(g: Grid): void {
  grassBase(g, 7);
  // a standing window: four panes in a timber frame on two stakes
  fillRect(g, 2, 1, 12, 12, L);
  fillRect(g, 3, 2, 10, 10, FR1);
  for (const [x, y] of [[4, 3], [8, 3], [4, 7], [8, 7]] as const) {
    fillRect(g, x, y, 4, 4, GL2);
    fillRect(g, x, y, 4, 1, GL3);
    fillRect(g, x, y + 3, 4, 1, GL1);
    g.set(x, y + 1, GL4); g.set(x + 1, y, GL4); // glint corner
  }
  fillRect(g, 3, 2, 10, 1, FR2); // top rail light
  fillRect(g, 7, 2, 1, 10, FR2); // centre mullion light edge
  fillRect(g, 3, 6, 10, 1, FR2);
  fillRect(g, 3, 13, 2, 3, TK2); fillRect(g, 11, 13, 2, 3, TK2);
  g.set(3, 13, TK3); g.set(11, 13, TK3);
}

function stump(g: Grid): void {
  grassBase(g, 8);
  ellipse(g, 8, 11, 6, 3, TK1);
  fillRect(g, 3, 8, 11, 4, TK2);
  fillRect(g, 3, 8, 2, 4, TK3);
  ellipse(g, 8, 8, 5, 3, DT3);
  ellipse(g, 8, 8, 3, 2, DT2);
  ellipse(g, 8, 8, 1, 1, DT1); // growth rings
  g.set(12, 11, TK1); g.set(11, 12, TK1);
  outline(g, L);
}

function fern(g: Grid, sway: number): void {
  grassBase(g, 9);
  // tall undergrowth (wild encounters): fanned fronds that sway between frames
  for (let x = 2; x < 15; x += 3) {
    const lean = Math.round(Math.sin(sway * Math.PI + x) * 1);
    for (let y = 4; y < 16; y++) {
      const spread = Math.floor((16 - y) / 4);
      g.set(x + lean, y, y < 8 ? FL2 : FL1);
      if (y % 3 === 1) { g.set(x + lean - spread, y, FL1); g.set(x + lean + spread, y, FL2); }
    }
  }
  for (let x = 1; x < 15; x += 2) g.set(x, 15, G1);
}

function stream(g: Grid, frame: number): void {
  const ramp = [WT1, WT2, WT3];
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const wave = Math.sin((y + frame * 4) * 0.55 + x * 0.8);
      g.set(x, y, ramp[shade(0.45 + wave * 0.25, x, y, ramp.length)]);
    }
  for (let i = 0; i < 3; i++) {
    const y = (Math.floor(hash(i, 7, 5) * 12) + frame * 3) % 15, x = 2 + i * 5;
    g.set(x, y, WT4); g.set(x, y + 1, WT4);
  }
}

function bridge(g: Grid, frame: number): void {
  stream(g, frame);
  for (let col = 0; col < 4; col++) {
    const x = col * 4;
    fillRect(g, x, 0, 3, 16, TK2);
    fillRect(g, x, 0, 1, 16, TK3);
    fillRect(g, x + 2, 0, 1, 16, TK1);
    g.set(x + 1, 3, FR2); g.set(x + 1, 12, FR2); // nails
  }
  fillRect(g, 0, 0, 16, 1, L); fillRect(g, 0, 15, 16, 1, L);
}

function mushroom(g: Grid): void {
  grassBase(g, 10);
  fillRect(g, 7, 9, 3, 5, MS2); g.set(9, 10, DT3); g.set(9, 12, DT3);
  ellipse(g, 8, 8, 5, 3, MS1);
  fillRect(g, 3, 8, 11, 1, G2); // clip lower half of the cap flat
  for (const [x, y] of [[6, 6], [9, 7], [11, 8], [4, 8]] as const) g.set(x, y, MS2);
  g.set(5, 6, LF2); // highlight
  outline(g, L);
}

function boulder(g: Grid): void {
  grassBase(g, 11);
  ellipse(g, 8, 9, 6, 5, RK2);
  ellipse(g, 6, 7, 3, 2, RK3);
  for (let x = 3; x < 14; x++) g.set(x, 13, RK1);
  g.set(10, 9, RK1); g.set(11, 10, RK1); g.set(10, 10, RK1);
  g.set(8, 5, G3); g.set(9, 5, G3); g.set(9, 4, G4); // moss cap
  outline(g, L);
}

function leafPile(g: Grid): void {
  grassBase(g, 12);
  for (let y = 5; y < 15; y++)
    for (let x = 1; x < 15; x++) {
      const dx = (x - 7.5) / 6.5, dy = (y - 10) / 4.8;
      if (dx * dx + dy * dy <= 1) g.set(x, y, hash(x, y, 13) < 0.5 ? LF1 : LF2);
    }
  for (const [x, y] of [[5, 8], [9, 10], [7, 12], [11, 9]] as const) g.set(x, y, TK2);
  g.set(6, 7, LF2); g.set(10, 8, LF1);
}

function fence(g: Grid): void {
  grassBase(g, 14);
  for (const x of [1, 7, 13]) { fillRect(g, x, 3, 2, 12, L); fillRect(g, x, 4, 2, 10, TK2); g.set(x, 4, TK3); }
  for (const y of [5, 10]) { fillRect(g, 0, y, 16, 3, L); fillRect(g, 0, y + 1, 16, 1, TK3); g.set(8, y + 1, TK2); }
}

function build(name: WoodsTileName, frame: number): Grid {
  const g = new Grid(WOODS_TILE, WOODS_TILE);
  switch (name) {
    case "grass": grassBase(g, 1); break;
    case "grass2": grassBase(g, 2); break;
    case "path": dirtBase(g, 1); break;
    case "pathEdge": pathEdge(g); break;
    case "pine": pine(g); break;
    case "glassPane": glassPane(g); break;
    case "stump": stump(g); break;
    case "fern": fern(g, frame); break;
    case "stream": stream(g, frame); break;
    case "bridge": bridge(g, frame); break;
    case "mushroom": mushroom(g); break;
    case "boulder": boulder(g); break;
    case "leafPile": leafPile(g); break;
    case "fence": fence(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<WoodsTileName, number>> = { stream: 4, bridge: 4, fern: 2 };

export function buildWoodsTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of WOODS_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "fern" ? 500 : 350;
  }
  return { w: WOODS_TILE, h: WOODS_TILE, palette: WOODS_PALETTE, anims, frameMs };
}
