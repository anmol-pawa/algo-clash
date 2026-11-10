import { Frame, Grid, SpriteSheet, fillRect, shade } from "./grid";

/** Array Atoll tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const ATOLL_TILE = 16;

const L = 1,
  SA1 = 2, SA2 = 3, SA3 = 4, SA4 = 5, // sand dark -> light
  WA1 = 6, // shallow water ramp starts here (6..8)
  DE1 = 9, // deep water ramp starts here (9..11)
  FM = 12, // foam
  PL1 = 13, PL2 = 14, PL3 = 15, // palm frond dark -> light (16 = lightest)
  TR1 = 17, TR2 = 18, // palm trunk
  RK1 = 19, RK2 = 20, RK3 = 21, // rock
  CO1 = 22, CO2 = 23, CO3 = 24, // coral
  BW1 = 25, BW2 = 26, BW3 = 27, // boardwalk planks
  TH1 = 28, TH2 = 29, TH3 = 30, // hut thatch
  HW1 = 31, HW2 = 32, // hut wall bamboo
  DR1 = 33, DR2 = 34, // hut door
  GL1 = 35, GL2 = 36, // window glass
  SH1 = 37, SH2 = 38, // shell pink, white
  DG1 = 39, DG2 = 40; // dune grass

export const ATOLL_PALETTE = [
  "", "#1a1420",
  "#d2b57a", "#e6cc92", "#f2dcab", "#fbeec6",
  "#1f6fb0", "#2f93cf", "#6cc3e8",
  "#13417a", "#1b5c9e", "#2a7ac0",
  "#f2fbff",
  "#2c7a46", "#3d9b55", "#5ab86a", "#86d98a",
  "#6b4a2a", "#9a6c3c",
  "#5c5f73", "#80849a", "#a8adc2",
  "#c8506a", "#ec7a8a", "#ffb0b4",
  "#7a5230", "#a87a46", "#c89c62",
  "#a8802c", "#cfa843", "#ecd070",
  "#8a6a3a", "#b8924f",
  "#5e3a22", "#8a5a34",
  "#35507a", "#a7d4f2",
  "#f0a0b8", "#fff4f0",
  "#6f9a3c", "#9cc24f",
];

export const ATOLL_TILE_NAMES = [
  "sand", "sand2", "shells", "dune", "shore", "water", "deepWater", "tidePool", "palm", "rock", "coral",
  "boardwalk", "post", "hutWall", "hutRoof", "hutDoor", "hutWindow", "sign",
] as const;
export type AtollTileName = (typeof ATOLL_TILE_NAMES)[number];

/** Atoll tiles that block the player. */
export const ATOLL_SOLID: ReadonlySet<AtollTileName> = new Set<AtollTileName>([
  "water", "deepWater", "palm", "rock", "coral", "post", "hutWall", "hutRoof", "hutWindow", "sign",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function sandBase(g: Grid, seed: number): void {
  for (let y = 0; y < ATOLL_TILE; y++)
    for (let x = 0; x < ATOLL_TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.1 ? SA1 : r < 0.2 ? SA4 : r < 0.35 ? SA2 : SA3);
    }
  // wind ripples in the sand
  for (let i = 0; i < 2; i++) {
    const y = 4 + i * 7 + Math.floor(hash(i, 3, seed) * 2), x0 = Math.floor(hash(i, 4, seed) * 5);
    for (let x = 0; x < 9; x++) g.set(x0 + x, y + (x % 4 < 2 ? 0 : 1), SA2);
  }
}

function waterTile(frame: number, base: number, glints: number, seed: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  for (let y = 0; y < ATOLL_TILE; y++)
    for (let x = 0; x < ATOLL_TILE; x++) {
      const wave = Math.sin((x + frame * 4) * 0.55 + y * 0.85);
      g.set(x, y, base + shade(0.5 + wave * 0.28, x, y, 3));
    }
  for (let i = 0; i < glints; i++) {
    const x = (Math.floor(hash(i, 7, seed) * 11) + frame * 3) % 14, y = 2 + i * 5;
    g.set(x, y, FM); g.set(x + 1, y, FM);
  }
  return g;
}

/** Sand above, a foam line that surges up and down, then shallow water below. */
function shore(frame: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  const surge = [0, 1, 2, 1][frame % 4];
  for (let x = 0; x < ATOLL_TILE; x++) {
    const edge = 5 + surge + Math.round(Math.sin(x * 0.7 + frame) * 1.2);
    for (let y = 0; y < ATOLL_TILE; y++) {
      if (y < edge - 1) g.set(x, y, hash(x, y, 31) < 0.15 ? SA2 : SA3);
      else if (y === edge - 1) g.set(x, y, SA1); // wet sand line
      else if (y === edge) g.set(x, y, FM);
      else g.set(x, y, WA1 + shade(0.35 + (y - edge) / 14 + Math.sin(x * 0.8 + frame) * 0.1, x, y, 3));
    }
  }
  return g;
}

function tidePool(frame: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  sandBase(g, 12);
  for (let y = 3; y < 14; y++)
    for (let x = 1; x < 15; x++) {
      const dx = (x - 7.5) / 7, dy = (y - 8.5) / 5;
      const d = dx * dx + dy * dy;
      if (d <= 1) g.set(x, y, d > 0.72 ? RK2 : WA1 + shade(0.5 + Math.sin(x * 0.9 + y + frame * 2) * 0.3, x, y, 3));
    }
  g.set(5 + (frame % 2) * 4, 7, FM); g.set(9 - (frame % 2) * 3, 9, FM);
  g.set(7, 5, CO3); g.set(8, 4, CO2); // a little coral head peeks out
  return g;
}

function palm(g: Grid, sway: number): void {
  sandBase(g, 6);
  // curved trunk
  for (let y = 7; y < 15; y++) { const x = 7 + (y > 11 ? 0 : y > 9 ? 1 : 2); fillRect(g, x, y, 2, 1, y % 3 ? TR2 : TR1); g.set(x + 2, y, L); g.set(x - 1, y, L); }
  fillRect(g, 5, 14, 6, 1, TR1);
  // fronds fanning out, tips bob with the breeze
  const frond = (dx: number, dy: number, tipY: number) => {
    for (let t = 0; t <= 6; t++) {
      const x = 9 + Math.round((dx * t) / 6), y = 6 + Math.round((dy * t) / 6) + Math.round((t * t * 0.07)) + (t > 4 ? tipY : 0);
      g.set(x, y, PL1 + Math.min(3, 3 - Math.floor(t / 2))); g.set(x, y + 1, PL2);
    }
  };
  const bob = sway ? 1 : 0;
  frond(-8, -1, bob); frond(8, -1, bob); frond(-6, -4, 0); frond(6, -4, 0); frond(0, -5, 0);
  fillRect(g, 8, 5, 3, 3, PL3);
  fillRect(g, 7, 8, 2, 2, TR2);
  g.set(10, 8, TR2);
}

function rock(g: Grid): void {
  sandBase(g, 8);
  const blob = (cx: number, cy: number, rx: number, ry: number) => {
    for (let y = -ry; y <= ry; y++)
      for (let x = -rx; x <= rx; x++)
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) g.set(cx + x, cy + y, RK1 + shade(0.7 - (x + y * 1.4) / 14, cx + x, cy + y, 3));
  };
  blob(8, 10, 7, 4);
  blob(5, 8, 4, 4); blob(11, 8, 4, 3);
  // outline only the rock
  for (let y = 0; y < ATOLL_TILE; y++) for (let x = 0; x < ATOLL_TILE; x++) {
    const isRock = (a: number, b: number) => g.get(a, b) >= RK1 && g.get(a, b) <= RK3;
    if (!isRock(x, y) && (isRock(x - 1, y) || isRock(x + 1, y) || isRock(x, y - 1) || isRock(x, y + 1))) g.set(x, y, L);
  }
  fillRect(g, 6, 7, 2, 1, RK3); fillRect(g, 11, 6, 2, 1, RK3);
}

function coral(g: Grid, frame: number): void {
  for (let y = 0; y < ATOLL_TILE; y++) for (let x = 0; x < ATOLL_TILE; x++) g.set(x, y, WA1 + shade(0.35 + Math.sin(x * 0.6 + y * 0.8 + frame * 2) * 0.2, x, y, 3));
  // branching coral fan
  const branch = (x0: number, h: number, c: number) => {
    for (let y = 0; y < h; y++) { const x = x0 + Math.round(Math.sin(y * 0.8 + x0) * 0.8); g.set(x, 14 - y, c); g.set(x + 1, 14 - y, CO1 + (y % 2 ? 1 : 0)); }
    g.set(x0 - 1, 14 - h, CO3); g.set(x0 + 2, 14 - h + 1, CO3);
  };
  branch(4, 9, CO2); branch(7, 12, CO3); branch(10, 8, CO2); branch(13, 6, CO1);
  fillRect(g, 3, 14, 12, 1, CO1);
  for (let k = 0; k < 3; k++) g.set(5 + k * 4, 2 + ((frame + k) % 3), FM); // bubbles
}

function boardwalk(g: Grid): void {
  for (let y = 0; y < ATOLL_TILE; y++) {
    const row = Math.floor(y / 4);
    for (let x = 0; x < ATOLL_TILE; x++) g.set(x, y, y % 4 === 3 ? BW1 : (row + Math.floor(x / 8)) % 2 ? BW2 : BW3);
  }
  for (let y = 0; y < ATOLL_TILE; y += 4) { g.set((y * 3) % 14 + 1, y + 1, BW1); g.set((y * 5) % 13 + 2, y, BW1); }
  for (const x of [1, 14]) for (const y of [1, 5, 9, 13]) g.set(x, y, L); // nail heads
}

function post(g: Grid, frame: number): void {
  for (let y = 0; y < ATOLL_TILE; y++) for (let x = 0; x < ATOLL_TILE; x++) g.set(x, y, WA1 + shade(0.45 + Math.sin(x * 0.55 + y * 0.85 + frame * 3) * 0.25, x, y, 3));
  fillRect(g, 6, 1, 5, 14, TR1); fillRect(g, 6, 1, 2, 14, TR2); fillRect(g, 5, 1, 1, 14, L); fillRect(g, 11, 1, 1, 14, L);
  fillRect(g, 6, 0, 5, 1, L); fillRect(g, 5, 14, 7, 1, FM); // wave ring at the waterline
  fillRect(g, 6, 4, 5, 1, CO2); // rope wrap
}

function hutWall(g: Grid): void {
  for (let y = 0; y < ATOLL_TILE; y++) for (let x = 0; x < ATOLL_TILE; x++) g.set(x, y, x % 4 === 3 ? HW1 : HW2);
  for (let y = 5; y < ATOLL_TILE; y += 6) fillRect(g, 0, y, 16, 1, HW1);
  fillRect(g, 0, 15, 16, 1, L);
}

function hutRoof(g: Grid): void {
  for (let y = 0; y < ATOLL_TILE; y++) for (let x = 0; x < ATOLL_TILE; x++) {
    const row = y % 4;
    g.set(x, y, row === 0 ? TH3 : row === 3 ? TH1 : TH2);
    if (row && (x + Math.floor(y / 4) * 3) % 5 === 0) g.set(x, y, TH1);
  }
}

function hutDoor(g: Grid): void {
  hutWall(g);
  fillRect(g, 3, 0, 10, 16, L); fillRect(g, 4, 1, 8, 15, DR2);
  fillRect(g, 4, 1, 1, 15, DR1); fillRect(g, 11, 1, 1, 15, DR1);
  for (let y = 3; y < 15; y += 3) fillRect(g, 5, y, 6, 1, DR1);
  fillRect(g, 7, 6, 2, 4, SH1); g.set(7, 6, SH2); // shell knocker
}

function hutWindow(g: Grid): void {
  hutWall(g);
  fillRect(g, 3, 3, 10, 9, L); fillRect(g, 4, 4, 8, 7, GL2); fillRect(g, 4, 4, 8, 2, GL1);
  fillRect(g, 4, 7, 8, 1, L); fillRect(g, 7, 4, 1, 7, L);
  g.set(5, 8, SH2); g.set(5, 9, SH2);
  fillRect(g, 2, 12, 12, 2, BW2); fillRect(g, 2, 13, 12, 1, BW1);
}

function sign(g: Grid): void {
  sandBase(g, 9);
  fillRect(g, 7, 9, 2, 6, BW1);
  fillRect(g, 2, 2, 12, 8, BW3); fillRect(g, 2, 9, 12, 1, BW1); fillRect(g, 13, 2, 1, 8, BW1);
  for (const y of [4, 6]) fillRect(g, 4, y, 8, 1, BW1);
  fillRect(g, 2, 1, 12, 1, L); fillRect(g, 1, 2, 1, 8, L); fillRect(g, 14, 2, 1, 8, L); fillRect(g, 2, 10, 12, 1, L);
  fillRect(g, 5, 11, 1, 1, SH1);
}

function shells(g: Grid): void {
  sandBase(g, 13);
  for (const [x, y, c] of [[3, 4, SH1], [10, 3, SH2], [6, 10, SH2], [12, 11, SH1]] as const) {
    g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c); g.set(x + 1, y + 1, SA2);
    g.set(x, y - 1, L); g.set(x + 1, y - 1, L);
  }
  g.set(8, 7, CO3); g.set(9, 8, CO2); g.set(8, 8, CO3); // starfish bit
}

function dune(g: Grid, frame: number): void {
  sandBase(g, 15);
  for (let x = 1; x < 16; x += 3) for (let k = 0; k < 2; k++) {
    const bx = x + k, lean = frame && (x + k) % 2 ? 1 : 0;
    for (let y = 4; y < 15; y++) g.set(bx + (y < 8 ? lean : 0), y, y < 7 ? DG2 : y < 11 ? DG1 : PL1);
    g.set(bx, 15, PL1);
  }
}

function build(name: AtollTileName, f: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  switch (name) {
    case "sand": sandBase(g, 1); break;
    case "sand2": sandBase(g, 2); break;
    case "shells": shells(g); break;
    case "dune": dune(g, f); break;
    case "shore": return shore(f);
    case "water": return waterTile(f, WA1, 3, 2);
    case "deepWater": return waterTile(f, DE1, 2, 5);
    case "tidePool": return tidePool(f);
    case "palm": palm(g, f); break;
    case "rock": rock(g); break;
    case "coral": coral(g, f); break;
    case "boardwalk": boardwalk(g); break;
    case "post": post(g, f); break;
    case "hutWall": hutWall(g); break;
    case "hutRoof": hutRoof(g); break;
    case "hutDoor": hutDoor(g); break;
    case "hutWindow": hutWindow(g); break;
    case "sign": sign(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<AtollTileName, number>> = {
  water: 4, deepWater: 4, shore: 4, tidePool: 2, coral: 2, post: 2, palm: 2, dune: 2,
};

export function buildAtollTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of ATOLL_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "water" || n === "deepWater" || n === "shore" ? 350 : 500;
  }
  return { w: ATOLL_TILE, h: ATOLL_TILE, palette: ATOLL_PALETTE, anims, frameMs };
}
