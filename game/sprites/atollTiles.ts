import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline, shade } from "./grid";

/** Array Atoll tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const ATOLL_TILE = 16;

// Palette slots.
const L = 1, // outline
  S1 = 2, S2 = 3, S3 = 4, S4 = 5, // sand dark->light
  WS = 6, // wet sand (shoreline)
  SH1 = 7, SH2 = 8, SH3 = 9, SH4 = 10, // shallows dark->light, 10 = foam
  DP1 = 11, DP2 = 12, DP3 = 13, // deep water
  PL1 = 14, PL2 = 15, PL3 = 16, PL4 = 17, // palm leaf dark->light
  TR1 = 18, TR2 = 19, // palm trunk dark, light
  BW1 = 20, BW2 = 21, BW3 = 22, // boardwalk plank dark->light
  NL = 23, // nail / post highlight
  SC1 = 24, SC2 = 25, SC3 = 26, // shell pink dark->light
  RK1 = 27, RK2 = 28, RK3 = 29, // rock dark->light
  CR1 = 30, CR2 = 31, // coral red, coral light
  SG = 32; // seagrass

export const ATOLL_PALETTE = [
  "", "#1a1420",
  "#c9a766", "#dcc084", "#ebd6a0", "#f6e8bd",
  "#b8955a",
  "#2a7fa8", "#3d9cc4", "#6cc3df", "#e9fbff",
  "#1b4f86", "#2368a3", "#2f82bd",
  "#1d5a35", "#2b7a43", "#3f9a55", "#6cc06e",
  "#6b4a2a", "#9a6e3e",
  "#6a4326", "#8f6238", "#b58650",
  "#f4efe2",
  "#c8607a", "#e88ba0", "#ffc4d0",
  "#5b5f6e", "#7c8194", "#a3a8ba",
  "#d9483f", "#ff8a73",
  "#3f8a5a",
];

export const ATOLL_TILE_NAMES = [
  "sand", "sand2", "wetSand", "shallows", "deepWater", "palm", "boardwalk", "boardwalkPost",
  "shell", "rock", "coral", "tidePool", "seagrass", "driftwood",
] as const;
export type AtollTileName = (typeof ATOLL_TILE_NAMES)[number];

/** Tiles that block the player. Shallows are wadeable; deep water, palms, rocks and coral are not. */
export const ATOLL_SOLID: ReadonlySet<AtollTileName> = new Set<AtollTileName>([
  "deepWater", "palm", "rock", "coral", "boardwalkPost", "driftwood",
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
      g.set(x, y, r < 0.1 ? S1 : r > 0.92 ? S4 : S3);
    }
  // ripple marks: short dark dashes with a light lip, like wind-combed sand
  for (let i = 0; i < 3; i++) {
    const x = 1 + Math.floor(hash(i, 1, seed) * 10), y = 2 + Math.floor(hash(i, 2, seed) * 12);
    g.set(x, y, S2); g.set(x + 1, y, S2); g.set(x + 2, y, S2); g.set(x + 1, y - 1, S4); g.set(x + 2, y - 1, S4);
  }
}

function wetSand(g: Grid): void {
  sandBase(g, 3);
  for (let y = 0; y < ATOLL_TILE; y++)
    for (let x = 0; x < ATOLL_TILE; x++) {
      const edge = 5 + Math.round(Math.sin(x * 0.7) * 1.4);
      if (y >= edge) g.set(x, y, y === edge ? S1 : hash(x, y, 9) < 0.15 ? S1 : WS);
    }
}

function waterGrid(frame: number, ramp: number[], foam: number, glints: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  for (let y = 0; y < ATOLL_TILE; y++)
    for (let x = 0; x < ATOLL_TILE; x++) {
      const wave = Math.sin((x + frame * 4) * 0.5 + y * 0.9);
      g.set(x, y, ramp[shade(0.45 + wave * 0.25, x, y, ramp.length)]);
    }
  for (let i = 0; i < glints; i++) {
    const x = (Math.floor(hash(i, 7, 5) * 12) + frame * 2) % 14, y = 2 + i * Math.floor(14 / glints);
    g.set(x, y, foam); g.set(x + 1, y, foam);
  }
  return g;
}

function shallows(frame: number): Grid {
  const g = waterGrid(frame, [SH1, SH2, SH3], SH4, 3);
  // sandy bed shows through as light speckles that drift the other way
  for (let i = 0; i < 4; i++) g.set((Math.floor(hash(i, 3, 8) * 14) + 16 - frame) % 16, 1 + i * 4, S4);
  return g;
}

function deepWater(frame: number): Grid {
  return waterGrid(frame, [DP1, DP2, DP3], SH3, 2);
}

function palm(g: Grid): void {
  sandBase(g, 6);
  // curved trunk
  const trunk: Array<[number, number]> = [[7, 15], [7, 14], [7, 13], [7, 12], [8, 11], [8, 10], [8, 9], [8, 8]];
  for (const [x, y] of trunk) { g.set(x, y, TR1); g.set(x + 1, y, TR2); }
  for (let y = 10; y < 15; y += 2) { g.set(7, y, L); g.set(8, y + 1, L); }
  // fronds radiating from the crown at (9,7), each a short ramp from dark base to bright tip
  const fronds: Array<Array<[number, number]>> = [
    [[8, 6], [6, 5], [4, 5], [2, 6], [1, 8]],
    [[10, 6], [12, 5], [14, 6], [15, 8]],
    [[8, 5], [6, 3], [5, 1]],
    [[10, 5], [12, 3], [13, 1]],
    [[9, 5], [9, 3], [9, 1]],
  ];
  for (const f of fronds)
    f.forEach(([x, y], i) => {
      const c = [PL1, PL2, PL3, PL4, PL4][Math.min(i, 4)];
      g.set(x, y, c); g.set(x, y + 1, PL1); g.set(x, y - 1, PL3);
      if (i > 0) { g.set(x + 1, y, PL2); g.set(x - 1, y, PL2); g.set(x + 1, y + 1, PL1); }
      if (i > 0 && i < 4) g.set(x, y + 2, PL1);
    });
  g.set(9, 7, TR1); g.set(10, 7, TR2); g.set(9, 8, TR1); // coconut cluster
  outline(g, L);
}

function boardwalk(g: Grid, post: boolean): void {
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    fillRect(g, 0, y, 16, 3, BW2);
    fillRect(g, 0, y, 16, 1, BW3);
    fillRect(g, 0, y + 3, 16, 1, BW1);
    // staggered plank ends
    const cut = (row % 2) * 8 + 4;
    g.set(cut, y, BW1); g.set(cut, y + 1, BW1); g.set(cut, y + 2, BW1);
    g.set(cut - 3, y + 1, NL); g.set(cut + 3, y + 1, NL);
  }
  if (post) {
    fillRect(g, 5, 2, 6, 13, L);
    fillRect(g, 6, 3, 4, 11, BW2);
    fillRect(g, 6, 3, 1, 11, BW3); fillRect(g, 9, 3, 1, 11, BW1);
    fillRect(g, 5, 1, 6, 2, L); fillRect(g, 6, 2, 4, 1, BW3);
    fillRect(g, 3, 5, 2, 1, L); fillRect(g, 11, 5, 2, 1, L); // rope stubs
    g.set(7, 6, NL);
  }
}

function shell(g: Grid): void {
  sandBase(g, 7);
  // scallop fan with ribs
  for (let y = 4; y < 13; y++)
    for (let x = 2; x < 14; x++) {
      const dx = (x - 7.5) / 5.8, dy = (y - 12) / 8;
      if (dx * dx + dy * dy <= 1 && y <= 12) g.set(x, y, SC1 + shade(0.72 - (x - 2) / 20 - (y - 4) / 14, x, y, 3));
    }
  for (const x of [5, 7, 9, 11]) for (let y = 6; y < 12; y++) g.set(x, y, SC1);
  fillRect(g, 5, 12, 6, 2, SC2); fillRect(g, 6, 13, 4, 1, SC1); // hinge
  outline(g, L);
}

function rock(g: Grid): void {
  sandBase(g, 8);
  ellipse(g, 8, 9, 6, 5, RK2);
  ellipse(g, 6, 7, 3, 2, RK3); // lit upper-left
  for (let x = 3; x < 14; x++) g.set(x, 13, RK1);
  g.set(10, 9, RK1); g.set(11, 10, RK1); g.set(10, 10, RK1);
  g.set(9, 6, SG); g.set(10, 6, SG); g.set(10, 5, SG); // moss
  outline(g, L);
}

function coral(g: Grid): void {
  sandBase(g, 9);
  // branching staghorn: trunk + forks
  const stem = (x: number, y0: number, y1: number, c: number) => { for (let y = y0; y <= y1; y++) { g.set(x, y, c); g.set(x + 1, y, CR1); } };
  stem(7, 8, 14, CR2);
  stem(4, 5, 10, CR2); stem(10, 4, 10, CR2); stem(12, 7, 11, CR2);
  for (let k = 0; k < 3; k++) { g.set(5 + k, 10 - Math.floor(k / 2), CR2); g.set(8 + k, 9 + (k > 1 ? 1 : 0), CR2); }
  for (const [x, y] of [[4, 4], [10, 3], [12, 6], [7, 7]] as const) { g.set(x, y, SC3); g.set(x + 1, y, SC3); }
  outline(g, L);
}

function tidePool(g: Grid, frame: number): void {
  sandBase(g, 10);
  const pool = waterGrid(frame, [SH1, SH2, SH3], SH4, 2);
  for (let y = 0; y < ATOLL_TILE; y++)
    for (let x = 0; x < ATOLL_TILE; x++) {
      const dx = (x - 7.5) / 6.6, dy = (y - 8) / 4.6;
      const d = dx * dx + dy * dy;
      if (d <= 1) g.set(x, y, pool.get(x, y));
      if (d > 0.78 && d <= 1.1) g.set(x, y, d > 1 ? RK1 : RK2);
    }
  g.set(5, 8, SC3); g.set(11, 9, CR2); // starfish-ish bits
}

function seagrass(g: Grid, sway: number): void {
  const w = waterGrid(sway * 2, [SH1, SH2, SH3], SH4, 2);
  for (let i = 0; i < w.d.length; i++) g.d[i] = w.d[i];
  for (let x = 2; x < 15; x += 4)
    for (let y = 5; y < 16; y++) {
      const off = Math.round(Math.sin(y * 0.6 + sway * 2 + x) * 1);
      g.set(x + off, y, y < 8 ? PL4 : y < 12 ? PL3 : SG);
    }
}

function driftwood(g: Grid): void {
  sandBase(g, 11);
  for (let x = 1; x < 15; x++) {
    const y = 8 + Math.round(Math.sin(x * 0.45) * 1.2);
    fillRect(g, x, y - 2, 1, 5, x % 4 === 0 ? TR1 : TR2);
    g.set(x, y - 2, BW3); g.set(x, y + 2, TR1);
  }
  g.set(13, 5, TR2); g.set(13, 4, TR2); g.set(12, 4, TR2); // snapped branch
  outline(g, L);
}

function build(name: AtollTileName, frame: number): Grid {
  const g = new Grid(ATOLL_TILE, ATOLL_TILE);
  switch (name) {
    case "sand": sandBase(g, 1); break;
    case "sand2": sandBase(g, 2); break;
    case "wetSand": wetSand(g); break;
    case "shallows": return shallows(frame);
    case "deepWater": return deepWater(frame);
    case "palm": palm(g); break;
    case "boardwalk": boardwalk(g, false); break;
    case "boardwalkPost": boardwalk(g, true); break;
    case "shell": shell(g); break;
    case "rock": rock(g); break;
    case "coral": coral(g); break;
    case "tidePool": tidePool(g, frame); break;
    case "seagrass": seagrass(g, frame); break;
    case "driftwood": driftwood(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<AtollTileName, number>> = { shallows: 4, deepWater: 4, tidePool: 4, seagrass: 2 };

export function buildAtollTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of ATOLL_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "seagrass" ? 500 : 350;
  }
  return { w: ATOLL_TILE, h: ATOLL_TILE, palette: ATOLL_PALETTE, anims, frameMs };
}
