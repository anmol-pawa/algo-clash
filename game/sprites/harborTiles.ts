import { Frame, Grid, SpriteSheet, ellipse, fillRect, outline, shade } from "./grid";

/** Hashwood Harbor tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const HARBOR_TILE = 16;

// Palette slots.
const L = 1, // outline
  SD1 = 2, SD2 = 3, SD3 = 4, // sand dark->light
  CB1 = 5, CB2 = 6, CB3 = 7, // cobble stone dark->light
  PK1 = 8, PK2 = 9, PK3 = 10, // dock plank dark->light
  NL = 11, // nail
  WT1 = 12, WT2 = 13, WT3 = 14, WT4 = 15, // harbor water dark->light, 15 = foam
  CR1 = 16, CR2 = 17, CR3 = 18, // crate wood dark->light
  BR1 = 19, BR2 = 20, BR3 = 21, // barrel wood dark->light
  IR1 = 22, IR2 = 23, // iron band dark, light
  LP1 = 24, LP2 = 25, // lantern glass amber, glow
  WL1 = 26, WL2 = 27, WL3 = 28, // warehouse wall dark->light (blue-grey)
  RF1 = 29, RF2 = 30, // roof tile terracotta dark, light
  NT1 = 31, NT2 = 32, // fishing net dark, light
  HL1 = 33, HL2 = 34, HL3 = 35, // boat hull dark->light
  SL1 = 36, SL2 = 37, // sail cream shade, light
  RP = 38; // rope

export const HARBOR_PALETTE = [
  "", "#161c24",
  "#b89a62", "#d2b87e", "#e6d19a",
  "#5b6068", "#7c828a", "#a3a9b0",
  "#5a3d26", "#7d5736", "#a07848",
  "#c9c3b4",
  "#1f5f86", "#2f7fa8", "#55a8c9", "#e6fbff",
  "#7a5230", "#a37244", "#c99a62",
  "#6b4228", "#8d5d38", "#b07f4e",
  "#3b3f48", "#8a909b",
  "#d98d2b", "#ffd77a",
  "#3f4d63", "#566884", "#7a8fae",
  "#a9482f", "#cf6b46",
  "#2f4a3a", "#5f8a6a",
  "#7a2f2a", "#a8453a", "#d06a58",
  "#d7cfb8", "#f3edda",
  "#d6b46a",
];

export const HARBOR_TILE_NAMES = [
  "sand", "sand2", "cobble", "planks", "dockEdge", "water", "shore", "crate", "barrel",
  "bollard", "lamp", "boat", "warehouse", "lockers", "netRack", "door",
] as const;
export type HarborTileName = (typeof HARBOR_TILE_NAMES)[number];

/** Tiles that block the player. Sand, cobble, planks and the shore edge are walkable. */
export const HARBOR_SOLID: ReadonlySet<HarborTileName> = new Set<HarborTileName>([
  "water", "crate", "barrel", "bollard", "lamp", "boat", "warehouse", "lockers", "netRack",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function sandBase(g: Grid, seed: number): void {
  for (let y = 0; y < HARBOR_TILE; y++)
    for (let x = 0; x < HARBOR_TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.1 ? SD1 : r > 0.9 ? SD3 : SD2);
    }
  for (let i = 0; i < 2; i++) { // little shell flecks
    const x = 2 + Math.floor(hash(i, 3, seed) * 12), y = 2 + Math.floor(hash(i, 4, seed) * 12);
    g.set(x, y, WT4); g.set(x + 1, y, SD3);
  }
}

function cobble(g: Grid): void {
  fillRect(g, 0, 0, 16, 16, CB1);
  // 3 staggered rows of rounded stones
  for (let row = 0; row < 4; row++) {
    const y = row * 4, off = row % 2 ? 3 : 0;
    for (let x = -off; x < 16; x += 6) {
      fillRect(g, x + 1, y, 5, 3, CB2);
      fillRect(g, x + 1, y, 5, 1, CB3);
      g.set(x + 1, y + 2, CB1); g.set(x + 5, y + 1, CB1);
    }
  }
}

function planks(g: Grid): void {
  for (let row = 0; row < 4; row++) {
    const y = row * 4;
    fillRect(g, 0, y, 16, 4, PK2);
    fillRect(g, 0, y, 16, 1, PK3);
    fillRect(g, 0, y + 3, 16, 1, PK1);
    const joint = 4 + ((row * 7) % 9);
    fillRect(g, joint, y, 1, 3, PK1);
    g.set(joint - 2, y + 1, NL); g.set(joint + 2, y + 1, NL);
    for (let x = 0; x < 16; x++) if (hash(x, y, 21) > 0.88) g.set(x, y + 1 + (x % 2), PK1);
  }
}

function dockEdge(g: Grid, frame: number): void {
  water(g, frame);
  fillRect(g, 0, 0, 16, 9, PK2);
  fillRect(g, 0, 0, 16, 1, PK3);
  fillRect(g, 0, 4, 16, 1, PK1); fillRect(g, 0, 5, 16, 1, PK3);
  g.set(3, 2, NL); g.set(11, 2, NL);
  fillRect(g, 0, 8, 16, 1, PK1);
  for (const x of [2, 11]) { fillRect(g, x, 9, 3, 4, PK1); fillRect(g, x, 9, 1, 4, PK2); } // pilings
  for (let x = 0; x < 16; x++) g.set(x, 9, hash(x, 9, 4) < 0.5 ? WT1 : g.get(x, 9)); // shadow under deck
  fillRect(g, 0, 13, 16, 1, WT4); // foam line
}

function water(g: Grid, frame: number): void {
  const ramp = [WT1, WT2, WT3];
  for (let y = 0; y < HARBOR_TILE; y++)
    for (let x = 0; x < HARBOR_TILE; x++) {
      const wave = Math.sin((x + frame * 4) * 0.5 + y * 0.9);
      g.set(x, y, ramp[shade(0.5 + wave * 0.28, x, y, ramp.length)]);
    }
  for (let i = 0; i < 3; i++) { // glints drift sideways
    const y = 2 + i * 5, x = (Math.floor(hash(i, 7, 9) * 10) + frame * 3) % 14;
    g.set(x, y, WT4); g.set(x + 1, y, WT4);
  }
}

function shore(g: Grid, frame: number): void {
  // sand on top, surf line sliding up and down the beach
  sandBase(g, 5);
  const edge = 8 + (frame % 2 ? 1 : 0) + (frame === 2 ? 1 : 0);
  for (let y = edge; y < 16; y++)
    for (let x = 0; x < 16; x++) g.set(x, y, y > edge + 2 ? WT2 : WT3);
  for (let x = 0; x < 16; x++) {
    const wob = Math.round(Math.sin(x * 0.8 + frame) * 1);
    g.set(x, edge + wob, WT4);
    g.set(x, edge + wob - 1, SD3);
    if (hash(x, frame, 8) > 0.7) g.set(x, edge + 3, WT4);
  }
}

function crate(g: Grid): void {
  sandBase(g, 6);
  fillRect(g, 2, 3, 12, 11, L);
  fillRect(g, 3, 4, 10, 9, CR2);
  fillRect(g, 3, 4, 10, 1, CR3);
  fillRect(g, 3, 12, 10, 1, CR1);
  for (let i = 0; i < 9; i++) { g.set(3 + i, 4 + i, CR1); g.set(12 - i, 4 + i, CR1); } // X brace
  fillRect(g, 3, 4, 1, 9, CR3); fillRect(g, 12, 4, 1, 9, CR1);
  g.set(4, 5, NL); g.set(11, 5, NL); g.set(4, 11, NL); g.set(11, 11, NL);
  fillRect(g, 3, 14, 12, 1, SD1); // ground shadow
}

function barrel(g: Grid): void {
  sandBase(g, 7);
  ellipse(g, 8, 9, 5, 6, BR2);
  fillRect(g, 3, 4, 10, 11, BR2);
  ellipse(g, 8, 4, 4, 1, BR3); // lid
  fillRect(g, 3, 5, 2, 9, BR3);
  fillRect(g, 11, 5, 2, 9, BR1);
  for (const y of [6, 11]) { fillRect(g, 3, y, 10, 1, IR1); g.set(5, y, IR2); g.set(9, y, IR2); }
  fillRect(g, 7, 5, 1, 9, BR1); // stave seam
  outline(g, L);
  fillRect(g, 3, 15, 11, 1, SD1);
}

function bollard(g: Grid): void {
  planks(g);
  fillRect(g, 5, 4, 6, 9, L);
  fillRect(g, 6, 5, 4, 7, IR1);
  fillRect(g, 6, 5, 1, 7, IR2);
  ellipse(g, 8, 4, 4, 2, L); ellipse(g, 8, 4, 3, 1, IR2);
  // coiled rope round the neck
  for (const y of [7, 9]) { fillRect(g, 5, y, 6, 1, RP); g.set(10, y, PK1); g.set(5, y + 1, PK1); }
  fillRect(g, 11, 10, 3, 1, RP); fillRect(g, 13, 11, 1, 3, RP);
}

function lamp(g: Grid, frame: number): void {
  planks(g);
  fillRect(g, 7, 6, 2, 9, L); fillRect(g, 7, 6, 1, 9, IR2); fillRect(g, 8, 6, 1, 9, IR1);
  fillRect(g, 5, 14, 6, 1, L);
  // lantern cage with a flickering flame
  fillRect(g, 4, 1, 8, 7, L);
  fillRect(g, 5, 2, 6, 5, LP1);
  fillRect(g, 6, 3 + (frame % 2), 4, 3 - (frame % 2), LP2);
  fillRect(g, 7, 2, 2, 1, LP2);
  fillRect(g, 4, 0, 8, 1, IR1);
  g.set(5, 2, IR2); g.set(10, 2, IR2);
}

function boat(g: Grid, frame: number): void {
  water(g, frame);
  const bob = frame % 2;
  fillRect(g, 7, 0 + bob, 1, 8, L); // mast
  for (let y = 1; y < 8; y++) { // sail
    const w = Math.min(5, Math.ceil(y * 0.8));
    for (let x = 8; x < 8 + w; x++) g.set(x, y + bob, x - 8 > w - 2 ? SL1 : SL2);
  }
  fillRect(g, 1, 9 + bob, 14, 3, L);
  fillRect(g, 2, 9 + bob, 12, 2, HL2);
  fillRect(g, 2, 9 + bob, 12, 1, HL3);
  fillRect(g, 3, 11 + bob, 10, 1, HL1);
  fillRect(g, 4, 12 + bob, 8, 1, L);
  g.set(5, 10 + bob, L); g.set(8, 10 + bob, L); g.set(11, 10 + bob, L); // portholes
  for (let x = 1; x < 15; x++) g.set(x, 13 + bob, WT4); // wake foam
}

function warehouse(g: Grid): void {
  fillRect(g, 0, 0, 16, 16, WL2);
  for (let x = 0; x < 16; x += 4) fillRect(g, x, 5, 1, 11, WL1); // plank seams
  fillRect(g, 0, 5, 16, 1, WL3);
  // terracotta roof band with shingle scallops
  fillRect(g, 0, 0, 16, 5, RF1);
  for (let x = 0; x < 16; x++) {
    g.set(x, 0, RF2);
    for (const y of [1, 3]) if ((x + y) % 4 < 2) g.set(x, y, RF2);
  }
  fillRect(g, 0, 4, 16, 1, L);
  // two shuttered windows
  for (const x of [2, 10]) {
    fillRect(g, x, 8, 4, 5, L); fillRect(g, x + 1, 9, 2, 3, LP1); g.set(x + 1, 9, LP2);
    fillRect(g, x - 1, 8, 1, 5, WL1); fillRect(g, x + 4, 8, 1, 5, WL1);
  }
  fillRect(g, 0, 15, 16, 1, WL1);
}

function lockers(g: Grid): void {
  // the hash-table wall: a grid of numbered buckets, some padlocked
  fillRect(g, 0, 0, 16, 16, L);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 2; c++) {
      const x = 1 + c * 7, y = 1 + r * 7;
      fillRect(g, x, y, 7, 7, WL2);
      fillRect(g, x, y, 7, 1, WL3); fillRect(g, x, y, 1, 7, WL3);
      fillRect(g, x, y + 6, 7, 1, WL1); fillRect(g, x + 6, y, 1, 7, WL1);
      fillRect(g, x + 2, y + 2, 3, 2, L); // slot for a number plate
      fillRect(g, x + 3, y + 2, 1, 1, NL);
      if ((r + c) % 2 === 0) { fillRect(g, x + 2, y + 4, 3, 2, IR1); g.set(x + 3, y + 4, IR2); } // padlock
      else { g.set(x + 3, y + 4, LP2); g.set(x + 4, y + 5, LP1); } // key hanging
    }
}

function netRack(g: Grid): void {
  sandBase(g, 9);
  fillRect(g, 1, 2, 2, 13, L); fillRect(g, 13, 2, 2, 13, L); // posts
  fillRect(g, 1, 2, 1, 13, PK3); fillRect(g, 13, 2, 1, 13, PK3);
  fillRect(g, 1, 1, 14, 2, L); fillRect(g, 2, 1, 12, 1, PK2); // crossbeam
  for (let y = 3; y < 14; y++)
    for (let x = 3; x < 13; x++) {
      const knot = (x + y) % 3 === 0 && (x - y + 16) % 3 === 0;
      const strand = (x + y) % 3 === 0 || (x - y + 16) % 3 === 0;
      if (knot) g.set(x, y, NT2); else if (strand) g.set(x, y, NT1);
    }
  g.set(5, 12, SL2); g.set(9, 10, SL2); // dried fish glints
}

function door(g: Grid): void {
  warehouse(g);
  fillRect(g, 3, 6, 10, 10, L);
  fillRect(g, 4, 7, 8, 9, PK2);
  fillRect(g, 4, 7, 1, 9, PK3); fillRect(g, 11, 7, 1, 9, PK1);
  fillRect(g, 7, 7, 2, 9, L);
  fillRect(g, 4, 9, 8, 1, IR1); fillRect(g, 4, 13, 8, 1, IR1);
  g.set(6, 11, LP2); g.set(9, 11, LP2); // knockers
  fillRect(g, 3, 5, 10, 1, RF2); // lintel
}

function build(name: HarborTileName, frame: number): Grid {
  const g = new Grid(HARBOR_TILE, HARBOR_TILE);
  switch (name) {
    case "sand": sandBase(g, 1); break;
    case "sand2": sandBase(g, 2); break;
    case "cobble": cobble(g); break;
    case "planks": planks(g); break;
    case "dockEdge": dockEdge(g, frame); break;
    case "water": water(g, frame); break;
    case "shore": shore(g, frame); break;
    case "crate": crate(g); break;
    case "barrel": barrel(g); break;
    case "bollard": bollard(g); break;
    case "lamp": lamp(g, frame); break;
    case "boat": boat(g, frame); break;
    case "warehouse": warehouse(g); break;
    case "lockers": lockers(g); break;
    case "netRack": netRack(g); break;
    case "door": door(g); break;
  }
  return g;
}

const ANIMATED: Partial<Record<HarborTileName, number>> = { water: 4, dockEdge: 4, shore: 3, boat: 4, lamp: 2 };

export function buildHarborTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of HARBOR_TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "lamp" ? 450 : 350;
  }
  return { w: HARBOR_TILE, h: HARBOR_TILE, palette: HARBOR_PALETTE, anims, frameMs };
}
