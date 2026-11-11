import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline, shade } from "./grid";

/** Window Woods tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const WOODS_TILE = 16;

// Palette slots.
const L = 1, // outline
  G1 = 2, G2 = 3, G3 = 4, G4 = 5, // grass dark->light
  D1 = 6, D2 = 7, D3 = 8, // dirt path dark->light
  P1 = 9, P2 = 10, P3 = 11, P4 = 12, // pine needles dark->light
  T1 = 13, T2 = 14, T3 = 15, // bark dark->light
  W1 = 16, W2 = 17, W3 = 18, // pond water dark->light
  FO = 19, // foam / glint
  GL1 = 20, GL2 = 21, GL3 = 22, // glass pane dark->light
  FR1 = 23, FR2 = 24, // window frame wood dark, light
  SH = 25, // light-shaft yellow
  FL1 = 26, FL2 = 27, FL3 = 28, // flowers: red, yellow, white
  MU1 = 29, MU2 = 30, // mushroom cap, stem
  LF1 = 31, LF2 = 32; // autumn leaf orange, gold

export const WOODS_PALETTE = [
  "", "#16201a",
  "#2c6a3a", "#3a8247", "#52a35a", "#7cc470",
  "#7a5a36", "#9a7648", "#bd9a64",
  "#14482e", "#1d6339", "#2a8044", "#46a258",
  "#5a3b22", "#7c5430", "#a0743f",
  "#285f8c", "#3a80b0", "#69b0d6",
  "#eaf9ff",
  "#6fa8b8", "#a6dbe6", "#e2f8fb",
  "#6b4424", "#a8743a",
  "#fff3a8",
  "#d9483f", "#f2c94c", "#f6f1e6",
  "#d9483f", "#efe4cc",
  "#d9772f", "#e8b53c",
];

export const WOODS_TILE_NAMES = [
  "grass", "grass2", "path", "pathEdge", "pine", "windowPane", "stump", "tallGrass",
  "flowers", "log", "mushroom", "pond", "leaves", "lightShaft",
] as const;
export type WoodsTileName = (typeof WOODS_TILE_NAMES)[number];

/** Tiles that block the player. Pond water, pines, standing windows, stumps and logs are solid. */
export const WOODS_SOLID: ReadonlySet<WoodsTileName> = new Set<WoodsTileName>([
  "pine", "windowPane", "stump", "log", "pond",
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
      g.set(x, y, r < 0.12 ? G1 : r > 0.9 ? G4 : G3);
    }
  // short blade ticks: dark stem with a light tip
  for (let i = 0; i < 4; i++) {
    const x = 1 + Math.floor(hash(i, 1, seed) * 13), y = 2 + Math.floor(hash(i, 2, seed) * 12);
    g.set(x, y, G2); g.set(x, y - 1, G4);
  }
}

function path(g: Grid, seed: number): void {
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.1 ? D1 : r > 0.9 ? D3 : D2);
    }
  // pebbles with a lit top
  for (let i = 0; i < 3; i++) {
    const x = 1 + Math.floor(hash(i, 4, seed) * 12), y = 2 + Math.floor(hash(i, 5, seed) * 11);
    g.set(x, y, D3); g.set(x + 1, y, D3); g.set(x, y + 1, D1); g.set(x + 1, y + 1, D1);
  }
}

function pathEdge(g: Grid): void {
  grassBase(g, 12);
  // dirt path comes in from the bottom with a ragged grass lip on top
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const edge = 6 + Math.round(Math.sin(x * 0.8) * 1.3);
      if (y > edge) g.set(x, y, hash(x, y, 14) < 0.12 ? D1 : y > 13 && hash(x, y, 15) > 0.85 ? D3 : D2);
      if (y === edge) g.set(x, y, G1);
    }
}

function pine(g: Grid): void {
  grassBase(g, 3);
  fillRect(g, 7, 12, 3, 3, T2); fillRect(g, 7, 12, 1, 3, T3); fillRect(g, 9, 12, 1, 3, T1); g.set(8, 15, T1); // trunk
  // three stacked boughs, each wider and lit from the upper left
  const tiers: Array<[number, number, number]> = [[1, 3, 2], [4, 7, 4], [8, 11, 6]];
  for (const [y0, y1, half] of tiers)
    for (let y = y0; y <= y1; y++) {
      const w = Math.max(1, Math.round(half * ((y - y0 + 1) / (y1 - y0 + 1)) + 1));
      for (let x = 8 - w; x <= 8 + w; x++) {
        const lit = (x - (8 - w)) / (2 * w + 1) < 0.35;
        g.set(x, y, y === y1 || x === 8 - w || x === 8 + w ? P1 : lit ? P4 : x > 8 + w - 3 ? P2 : P3);
      }
    }
  g.set(5, 8, P4); g.set(8, 4, P4); g.set(10, 10, P1); g.set(11, 11, P1);
  outline(g, L);
}

function windowPane(g: Grid): void {
  grassBase(g, 4);
  // free-standing glass window frame planted in the turf: the region's namesake landmark
  fillRect(g, 2, 1, 12, 14, L);
  fillRect(g, 3, 2, 10, 12, FR1);
  fillRect(g, 3, 2, 10, 1, FR2); fillRect(g, 3, 2, 1, 12, FR2);
  for (const [px, py] of [[4, 3], [9, 3], [4, 8], [9, 8]] as const) {
    fillRect(g, px, py, 3, 4, GL2);
    fillRect(g, px, py, 3, 1, GL3); fillRect(g, px, py, 1, 4, GL3);
    fillRect(g, px + 2, py + 3, 1, 1, GL1);
  }
  g.set(5, 4, FO); g.set(10, 4, FO); g.set(5, 9, FO); // glints
  fillRect(g, 2, 14, 12, 1, G1);
}

function stump(g: Grid): void {
  grassBase(g, 5);
  ellipse(g, 8, 11, 6, 3, T1); // trunk wall shadow
  fillRect(g, 3, 8, 10, 4, T2); fillRect(g, 3, 8, 2, 4, T3); fillRect(g, 11, 8, 2, 4, T1);
  ellipse(g, 8, 8, 5, 3, T3); // cut top
  // growth rings
  for (const [rx, ry, c] of [[3, 2, T2], [1, 1, T3]] as const)
    for (let a = 0; a < 24; a++) g.set(8 + Math.round(Math.cos(a / 24 * 6.28) * rx), 8 + Math.round(Math.sin(a / 24 * 6.28) * ry), c);
  g.set(8, 8, T1);
  outline(g, L);
}

function tallGrass(g: Grid, sway: number): void {
  grassBase(g, 6);
  // dense blades that lean left/right as the wind passes; draws the encounter patch
  for (let x = 0; x < WOODS_TILE; x += 2)
    for (let y = 3; y < WOODS_TILE; y++) {
      const off = Math.round(Math.sin(y * 0.5 + sway * 3 + x * 0.7) * (1 - y / 20) * 1.6);
      const c = y < 6 ? G4 : y < 10 ? G3 : G2;
      g.set(x + off, y, c);
      if (y > 5 && x % 4 === 0) g.set(x + off + 1, y, G1);
    }
}

function flowers(g: Grid): void {
  grassBase(g, 7);
  const spots: Array<[number, number, number]> = [[3, 4, FL1], [10, 3, FL3], [6, 10, FL2], [12, 11, FL1], [2, 13, FL3]];
  for (const [x, y, c] of spots) {
    g.set(x, y, c); g.set(x - 1, y, c); g.set(x + 1, y, c); g.set(x, y - 1, c); g.set(x, y + 1, c);
    g.set(x, y, FL2 === c ? FL1 : FL2); // bright centre
    g.set(x, y + 2, G2);
  }
}

function log(g: Grid): void {
  grassBase(g, 8);
  fillRect(g, 1, 5, 14, 7, T2);
  fillRect(g, 1, 5, 14, 2, T3); fillRect(g, 1, 10, 14, 2, T1);
  for (const x of [4, 8, 12]) { g.set(x, 7, T1); g.set(x, 8, T1); g.set(x + 1, 6, T3); }
  ellipse(g, 2, 8, 2, 3, T3); g.set(2, 8, T1); g.set(1, 8, T2); // sawn end with a ring
  g.set(10, 4, G4); g.set(11, 4, G3); g.set(12, 4, G3); // moss on top
  outline(g, L);
}

function mushroom(g: Grid): void {
  grassBase(g, 9);
  fillRect(g, 7, 9, 3, 5, MU2); fillRect(g, 9, 9, 1, 5, T3);
  ellipse(g, 8, 8, 5, 3, MU1);
  fillRect(g, 3, 9, 11, 1, MU1);
  for (const [x, y] of [[5, 6], [8, 5], [10, 7], [7, 8]] as const) { g.set(x, y, MU2); g.set(x + 1, y, MU2); }
  outline(g, L);
}

function pond(g: Grid, frame: number): void {
  const ramp = [W1, W2, W3];
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const wave = Math.sin((x + frame * 4) * 0.5 + y * 0.8);
      g.set(x, y, ramp[shade(0.45 + wave * 0.25, x, y, 3)]);
    }
  for (let i = 0; i < 2; i++) {
    const x = (Math.floor(hash(i, 7, 5) * 11) + frame * 2) % 14, y = 3 + i * 7;
    g.set(x, y, FO); g.set(x + 1, y, FO);
  }
  // lily pad that bobs one pixel
  const bob = frame % 2;
  ellipse(g, 11, 11 + bob, 2, 1, G3); g.set(12, 11 + bob, W1); g.set(10, 10 + bob, G4);
  // reedy bank on the top edge
  for (let x = 0; x < WOODS_TILE; x++) g.set(x, 0, hash(x, 0, 3) < 0.5 ? G2 : G1);
}

function leaves(g: Grid): void {
  path(g, 20);
  for (const [x, y, c] of [[2, 3, LF1], [3, 3, LF2], [9, 6, LF2], [10, 6, LF1], [10, 7, LF1], [5, 11, LF1], [6, 11, LF2], [13, 12, LF2], [12, 2, LF1]] as const)
    g.set(x, y, c);
}

function lightShaft(g: Grid): void {
  grassBase(g, 10);
  // slanting sun shaft through the canopy: lighten grass along diagonal bands
  for (let y = 0; y < WOODS_TILE; y++)
    for (let x = 0; x < WOODS_TILE; x++) {
      const d = (x + y) % 16;
      if (d < 4) g.set(x, y, d < 2 && hash(x, y, 11) < 0.55 ? SH : G4);
    }
}

function build(name: WoodsTileName, frame: number): Grid {
  const g = new Grid(WOODS_TILE, WOODS_TILE);
  switch (name) {
    case "grass": grassBase(g, 1); break;
    case "grass2": grassBase(g, 2); break;
    case "path": path(g, 1); break;
    case "pathEdge": pathEdge(g); break;
    case "pine": pine(g); break;
    case "windowPane": windowPane(g); break;
    case "stump": stump(g); break;
    case "tallGrass": tallGrass(g, frame); break;
    case "flowers": flowers(g); break;
    case "log": log(g); break;
    case "mushroom": mushroom(g); break;
    case "pond": pond(g, frame); break;
    case "leaves": leaves(g); break;
    case "lightShaft": lightShaft(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<WoodsTileName, number>> = { pond: 4, tallGrass: 2 };

export function buildWoodsTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of WOODS_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "tallGrass" ? 500 : 350;
  }
  return { w: WOODS_TILE, h: WOODS_TILE, palette: WOODS_PALETTE, anims, frameMs };
}
