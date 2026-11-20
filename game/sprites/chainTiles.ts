import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline } from "./grid";

/** Chainlink Caves tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const CHAIN_TILE = 16;

// Palette slots.
const L = 1, // outline
  RK1 = 2, RK2 = 3, RK3 = 4, // cave rock dark->light (violet-grey)
  FL1 = 5, FL2 = 6, FL3 = 7, // cave floor dark->light (warm earth)
  IR1 = 8, IR2 = 9, IR3 = 10, // iron chain dark->light
  JD1 = 11, JD2 = 12, JD3 = 13, // jade glow dark->light (matches the Matriarch)
  GD1 = 14, GD2 = 15, GD3 = 16, // gold link ring dark->light
  CY1 = 17, CY2 = 18, CY3 = 19, // crystal dark->light
  WT1 = 20, WT2 = 21, WT3 = 22, // underground water dark->light
  VD1 = 23, VD2 = 24, // void / deep dark
  WD1 = 25, WD2 = 26, WD3 = 27, // plank wood dark->light
  FR1 = 28, FR2 = 29, FR3 = 30, // lantern flame
  MS = 31; // moss fleck

export const CHAIN_PALETTE = [
  "", "#120f1a",
  "#3a3450", "#544c70", "#7a6f9a",
  "#5a4a3c", "#7a6650", "#9c8668",
  "#4a4f5c", "#7a8294", "#aeb6c6",
  "#1d6b5a", "#34a984", "#7ce3b4",
  "#8a5a1a", "#cc9430", "#f4d060",
  "#2c6a8c", "#4fb0d8", "#c4f0ff",
  "#1c3f5e", "#2c6a92", "#6fb4d8",
  "#0a0812", "#1a1626",
  "#4a2f1c", "#6e4a2c", "#8e6a40",
  "#b23a2a", "#e8782e", "#ffd25a",
  "#58704a",
];

export const CHAIN_TILE_NAMES = [
  "floor", "floor2", "linkpath", "nodepad", "wall", "void", "stalag", "crystal",
  "chains", "lantern", "pool", "bridge", "ring", "boulder", "stairs", "door",
] as const;
export type ChainTileName = (typeof CHAIN_TILE_NAMES)[number];

/** Tiles that block the player. Floors, link path, node pads, bridge and stairs are walkable. */
export const CHAIN_SOLID: ReadonlySet<ChainTileName> = new Set<ChainTileName>([
  "wall", "void", "stalag", "crystal", "chains", "lantern", "pool", "ring", "boulder",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function floor(g: Grid, seed: number): void {
  fillRect(g, 0, 0, 16, 16, FL2);
  for (let i = 0; i < 14; i++) {
    const x = Math.floor(hash(i, 1, seed) * 16), y = Math.floor(hash(i, 2, seed) * 16);
    g.set(x, y, hash(i, 3, seed) < 0.55 ? FL1 : FL3);
  }
  // a few pebble clusters
  for (let i = 0; i < 2; i++) {
    const x = 1 + Math.floor(hash(i, 4, seed) * 13), y = 1 + Math.floor(hash(i, 5, seed) * 13);
    g.set(x, y, FL3); g.set(x + 1, y, FL3); g.set(x, y + 1, FL1);
  }
  if (seed === 2) { g.set(4, 11, MS); g.set(5, 11, MS); g.set(4, 12, MS); }
}

function linkpath(g: Grid): void {
  // a walkway laid out as a chain of oval iron links lying flat, end to end
  fillRect(g, 0, 0, 16, 16, FL1);
  for (let i = 0; i < 2; i++) {
    const x = i * 8;
    fillRect(g, x, 3, 8, 10, L);
    fillRect(g, x + 1, 4, 6, 8, i ? IR2 : IR3);
    fillRect(g, x + 1, 4, 6, 1, IR3);
    fillRect(g, x + 2, 6, 4, 4, FL1); // hole of the link
    fillRect(g, x + 2, 6, 4, 1, L);
    fillRect(g, x + 1, 11, 6, 1, IR1);
  }
  fillRect(g, 0, 0, 16, 2, FL2); fillRect(g, 0, 14, 16, 2, FL2);
}

function nodepad(g: Grid, frame: number): void {
  floor(g, 1);
  // a node of the chain: gold ring around a pulsing jade core with a "next" arrow
  ellipse(g, 8, 8, 6, 6, L);
  ellipse(g, 8, 8, 5, 5, GD2);
  ellipse(g, 8, 8, 4, 4, FL1);
  const core = frame % 2 ? JD3 : JD2;
  ellipse(g, 8, 8, 3, 3, JD1);
  ellipse(g, 8, 8, 2, 2, core);
  g.set(8, 7, JD3);
  fillRect(g, 12, 7, 3, 2, GD3); g.set(15, 7, GD3); g.set(14, 6, GD3); g.set(14, 9, GD3); // arrow stub
  g.set(5, 4, GD3); g.set(4, 5, GD3);
}

function wall(g: Grid): void {
  // cave rock face with ragged strata
  fillRect(g, 0, 0, 16, 16, RK2);
  for (const [y, c] of [[3, RK1], [7, RK3], [11, RK1]] as const) {
    for (let x = 0; x < 16; x++) {
      const dy = Math.floor(hash(x, y, 9) * 2);
      g.set(x, y + dy, c);
    }
  }
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(hash(i, 6, 3) * 16), y = Math.floor(hash(i, 7, 3) * 16);
    g.set(x, y, hash(i, 8, 3) < 0.5 ? RK1 : RK3);
  }
  fillRect(g, 0, 15, 16, 1, L);
}

function voidTile(g: Grid): void {
  fillRect(g, 0, 0, 16, 16, VD1);
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(hash(i, 1, 11) * 16), y = Math.floor(hash(i, 2, 11) * 16);
    g.set(x, y, VD2);
  }
}

function stalag(g: Grid): void {
  floor(g, 2);
  // two stalagmite cones
  for (const [cx, base, h] of [[5, 14, 11], [11, 14, 7]] as const) {
    for (let y = 0; y < h; y++) {
      const half = Math.max(0, Math.floor(((y + 1) / h) * 3.2));
      fillRect(g, cx - half - 1, base - h + y, 2 * half + 3, 1, L);
    }
    for (let y = 0; y < h; y++) {
      const half = Math.max(0, Math.floor(((y + 1) / h) * 3.2));
      fillRect(g, cx - half, base - h + y, 2 * half + 1, 1, RK2);
      g.set(cx - half, base - h + y, RK3);
      g.set(cx + half, base - h + y, RK1);
    }
  }
  fillRect(g, 2, 14, 12, 1, L);
}

function crystal(g: Grid, frame: number): void {
  floor(g, 1);
  // a glowing crystal cluster that shimmers
  const shimmer = frame % 2;
  for (const [x, w, top] of [[3, 3, 5], [6, 4, 1], [10, 3, 6]] as const) {
    fillRect(g, x - 1, top - 1, w + 2, 15 - top, L);
    fillRect(g, x, top, w, 14 - top, CY2);
    fillRect(g, x, top, 1, 14 - top, CY3);
    fillRect(g, x + w - 1, top, 1, 14 - top, CY1);
  }
  g.set(7, 3, CY3); g.set(7, 4, CY3); g.set(11, 8, CY3);
  g.set(shimmer ? 5 : 12, 3, CY3);
  g.set(shimmer ? 8 : 4, 9, CY3);
  fillRect(g, 3, 14, 11, 1, L);
}

function chains(g: Grid, frame: number): void {
  // hanging chains in front of rock; they sway one pixel
  wall(g);
  for (const [x, ph] of [[4, 0], [9, 1], [13, 0]] as const) {
    const sway = (frame + ph) % 2;
    for (let y = 0; y < 16; y++) {
      const cx = x + (y > 8 ? sway : 0);
      const link = y % 4;
      if (link === 0 || link === 3) g.set(cx - 1, y, L);
      g.set(cx, y, link < 2 ? IR3 : IR1);
      if (link === 0 || link === 3) g.set(cx + 1, y, L);
    }
  }
  fillRect(g, 0, 0, 16, 1, L);
}

function lantern(g: Grid, frame: number): void {
  floor(g, 2);
  // iron post with a hanging lantern
  fillRect(g, 7, 6, 2, 8, L); fillRect(g, 7, 7, 1, 7, IR3); fillRect(g, 8, 7, 1, 7, IR1);
  fillRect(g, 4, 13, 8, 2, L); fillRect(g, 5, 13, 6, 1, IR2);
  fillRect(g, 4, 2, 8, 6, L); fillRect(g, 5, 3, 6, 4, FR1);
  const h = 2 + (frame % 2);
  ellipse(g, 8, 5, 2, h, FR2);
  fillRect(g, 7, 4, 2, 2, FR3);
  fillRect(g, 4, 2, 8, 1, GD2); fillRect(g, 4, 7, 8, 1, GD1); // frame bars
  fillRect(g, 7, 1, 2, 1, GD3); // hook
}

function pool(g: Grid, frame: number): void {
  fillRect(g, 0, 0, 16, 16, WT2);
  for (let y = 0; y < 16; y += 4) {
    for (let x = 0; x < 16; x++) {
      const wave = (x + y * 2 + frame * 3) % 8;
      if (wave < 2) g.set(x, y + 1, WT3);
      if (wave === 4) g.set(x, y + 2, WT1);
    }
  }
  fillRect(g, 0, 0, 16, 1, RK1); fillRect(g, 0, 15, 16, 1, RK1);
  g.set(frame ? 11 : 4, 7, CY3); // glow-fish glint
}

function bridge(g: Grid): void {
  pool(g, 0);
  fillRect(g, 0, 2, 16, 12, L);
  for (let i = 0; i < 4; i++) {
    const x = i * 4;
    fillRect(g, x, 3, 4, 10, i % 2 ? WD2 : WD3);
    fillRect(g, x, 3, 4, 1, WD3);
    fillRect(g, x, 12, 4, 1, WD1);
    fillRect(g, x + 3, 3, 1, 10, L);
  }
  fillRect(g, 0, 2, 16, 1, IR2); fillRect(g, 0, 13, 16, 1, IR1); // iron rails
}

function ring(g: Grid): void {
  // a big iron ring anchored in the rock face: the chain's first link
  wall(g);
  ellipse(g, 8, 9, 5, 5, L);
  ellipse(g, 8, 9, 4, 4, IR3);
  ellipse(g, 8, 9, 2, 2, RK1);
  fillRect(g, 6, 4, 4, 2, L); fillRect(g, 7, 4, 2, 2, GD2); // anchor stud
  g.set(5, 7, IR3); g.set(6, 6, IR3);
}

function boulder(g: Grid): void {
  floor(g, 1);
  ellipse(g, 8, 9, 6, 5, L);
  ellipse(g, 8, 9, 5, 4, RK2);
  ellipse(g, 7, 8, 3, 2, RK3);
  fillRect(g, 4, 11, 8, 1, RK1);
  g.set(9, 7, RK1); g.set(10, 8, RK1);
  fillRect(g, 3, 14, 10, 1, FL1);
}

function stairs(g: Grid): void {
  // steps cut down into the rock, darker each tread
  for (let i = 0; i < 4; i++) {
    const y = i * 4;
    fillRect(g, 0, y, 16, 4, FL2);
    fillRect(g, 0, y, 16, 1, FL3);
    fillRect(g, 0, y + 2, 16, 1, FL1);
    fillRect(g, 0, y + 3, 16, 1, L);
  }
  fillRect(g, 0, 0, 2, 16, RK1); fillRect(g, 14, 0, 2, 16, RK1);
}

function door(g: Grid): void {
  wall(g);
  // an iron-bound gate with a gold link ring knocker, jade glow above the lintel
  fillRect(g, 3, 4, 10, 12, L);
  ellipse(g, 8, 5, 5, 3, L);
  fillRect(g, 4, 5, 8, 11, IR2);
  ellipse(g, 8, 5, 4, 2, IR2);
  fillRect(g, 4, 5, 1, 11, IR3); fillRect(g, 11, 5, 1, 11, IR1);
  fillRect(g, 7, 3, 2, 13, L);
  fillRect(g, 4, 8, 8, 1, IR1); fillRect(g, 4, 12, 8, 1, IR1);
  ellipse(g, 6, 10, 1, 1, GD3); ellipse(g, 10, 10, 1, 1, GD3);
  fillRect(g, 2, 3, 12, 1, GD2);
  fillRect(g, 6, 1, 4, 1, JD2); g.set(7, 1, JD3); g.set(8, 1, JD3);
  outline(g, L);
}

function build(name: ChainTileName, frame: number): Grid {
  const g = new Grid(CHAIN_TILE, CHAIN_TILE);
  switch (name) {
    case "floor": floor(g, 1); break;
    case "floor2": floor(g, 2); break;
    case "linkpath": linkpath(g); break;
    case "nodepad": nodepad(g, frame); break;
    case "wall": wall(g); break;
    case "void": voidTile(g); break;
    case "stalag": stalag(g); break;
    case "crystal": crystal(g, frame); break;
    case "chains": chains(g, frame); break;
    case "lantern": lantern(g, frame); break;
    case "pool": pool(g, frame); break;
    case "bridge": bridge(g); break;
    case "ring": ring(g); break;
    case "boulder": boulder(g); break;
    case "stairs": stairs(g); break;
    case "door": door(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<ChainTileName, number>> = { nodepad: 2, crystal: 2, chains: 2, lantern: 2, pool: 2 };

export function buildChainTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of CHAIN_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "lantern" ? 220 : n === "pool" ? 600 : 450;
  }
  return { w: CHAIN_TILE, h: CHAIN_TILE, palette: CHAIN_PALETTE, anims, frameMs };
}
