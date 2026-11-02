import { Frame, Grid, SpriteSheet, fillRect, outline, shade } from "./grid";

/** Mainville tileset: 16x16 tiles, palette-index grids, deterministic (no Math.random). */
export const TILE = 16;

// Palette slots.
const L = 1, // outline
  G1 = 2, G2 = 3, G3 = 4, G4 = 5, // grass dark->light
  P1 = 6, P2 = 7, P3 = 8, // path dark->light
  W1 = 9, W4 = 12, // water dark (W1..W1+2 ramp, indices 9-11), W4 foam
  T1 = 13, T2 = 14, T3 = 15, T4 = 16, // foliage dark->light
  B1 = 17, B2 = 18, // bark dark, light
  R1 = 19, R2 = 20, R3 = 21, // roof red dark->light
  H1 = 22, H2 = 23, // house wall dark, mid (24 = light, unused)
  D1 = 25, D2 = 26, // door wood dark, light
  GL1 = 27, GL2 = 28, // window glass dark, light
  F1 = 29, F2 = 30, F3 = 31, // flower red, yellow, white
  S1 = 32, S2 = 33, // sign/fence wood
  LB1 = 34, LB2 = 35, LB3 = 36; // lab roof teal dark->light

export const TILE_PALETTE = [
  "", "#1a1420",
  "#3c8a3a", "#4ea348", "#63b957", "#82d06c",
  "#b59a63", "#cdb57c", "#e2cf99",
  "#2b6fb5", "#3a8ad0", "#63aae6", "#c9ecff",
  "#1f5a2e", "#2b7a38", "#3d9a47", "#62bb5c",
  "#5a3a22", "#7e5733",
  "#a8362c", "#cf4a3a", "#ee6c52",
  "#d9c7a0", "#ecdcb8", "#f7edd2",
  "#5e3a22", "#8a5a34",
  "#35507a", "#a7d4f2",
  "#e0463c", "#f4cf45", "#ffffff",
  "#8a6a3e", "#b48c52",
  "#1f6f75", "#2f9a9a", "#58c4be",
];

export const TILE_NAMES = [
  "grass", "grass2", "flowers", "path", "pathEdge", "water", "tree", "bush", "fence", "sign",
  "wallHouse", "roofHouse", "doorHouse", "windowHouse", "wallLab", "roofLab", "doorLab", "tallGrass",
] as const;
export type TileName = (typeof TILE_NAMES)[number];

/** Which tiles block the player (used by the overworld in B2). */
export const SOLID: ReadonlySet<TileName> = new Set<TileName>([
  "water", "tree", "bush", "fence", "sign", "wallHouse", "roofHouse", "windowHouse", "wallLab", "roofLab",
]);

const hash = (x: number, y: number, s: number): number => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

function grassBase(g: Grid, seed: number): void {
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.1 ? G2 : r < 0.16 ? G4 : G3);
    }
  // darker tufts so the field has rhythm
  for (let i = 0; i < 3; i++) {
    const x = 2 + Math.floor(hash(i, 1, seed) * 11), y = 3 + Math.floor(hash(i, 2, seed) * 10);
    g.set(x, y, G1); g.set(x, y - 1, G2); g.set(x + 1, y, G2);
  }
}

function flowers(g: Grid): void {
  grassBase(g, 3);
  const spots: Array<[number, number, number]> = [[3, 4, F1], [10, 3, F2], [6, 10, F3], [12, 11, F1], [2, 12, F2]];
  for (const [x, y, c] of spots) {
    g.set(x, y, c); g.set(x - 1, y, c); g.set(x + 1, y, c); g.set(x, y - 1, c); g.set(x, y + 1, F2 === c ? F1 : F2);
    g.set(x, y + 2, G1);
  }
}

function path(g: Grid, seed: number): void {
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const r = hash(x, y, seed);
      g.set(x, y, r < 0.12 ? P1 : r > 0.9 ? P3 : P2);
    }
  for (let i = 0; i < 4; i++) {
    const x = 1 + Math.floor(hash(i, 5, seed) * 13), y = 1 + Math.floor(hash(i, 6, seed) * 13);
    g.set(x, y, P1); g.set(x + 1, y, P1); g.set(x, y + 1, P3);
  }
}

/** Path with a grassy, ragged top edge (the path continues below). */
function pathEdge(g: Grid): void {
  path(g, 9);
  for (let x = 0; x < TILE; x++) {
    const h = 2 + Math.floor(hash(x, 0, 11) * 3);
    for (let y = 0; y < h; y++) g.set(x, y, y === h - 1 ? G1 : G3);
    g.set(x, h, P1);
  }
}

function water(frame: number): Grid {
  const g = new Grid(TILE, TILE);
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const wave = Math.sin((x + frame * 4) * 0.5 + y * 0.9);
      g.set(x, y, shade(0.45 + wave * 0.25, x, y, 3) + W1);
    }
  // foam glints drift horizontally per frame
  for (let i = 0; i < 3; i++) {
    const x = (Math.floor(hash(i, 7, 2) * 12) + frame * 2) % 14, y = 2 + i * 5;
    g.set(x, y, W4); g.set(x + 1, y, W4);
  }
  return g;
}

function tree(g: Grid): void {
  // trunk
  fillRect(g, 6, 11, 4, 4, B1); fillRect(g, 6, 11, 2, 4, B2);
  fillRect(g, 5, 14, 6, 1, B1);
  // canopy: layered blobs with a light upper-left
  const blob = (cx: number, cy: number, r: number) => {
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++)
        if (x * x + y * y <= r * r + r / 2) {
          const t = 0.62 - (x + y) / (r * 3.2);
          g.set(cx + x, cy + y, T1 + shade(t, cx + x, cy + y, 4));
        }
  };
  blob(8, 5, 5); blob(4, 7, 3); blob(12, 7, 3); blob(8, 8, 4);
  outline(g, L);
}

function bush(g: Grid): void {
  grassBase(g, 5);
  for (let y = 4; y < 14; y++)
    for (let x = 1; x < 15; x++) {
      const dx = (x - 7.5) / 7, dy = (y - 9.5) / 5;
      if (dx * dx + dy * dy <= 1) g.set(x, y, T1 + shade(0.65 - (x - 2) / 22 - (y - 4) / 14, x, y, 4));
    }
  for (const [x, y] of [[5, 7], [9, 6], [11, 9]] as const) g.set(x, y, F1);
  // outline only the bush body (not the grass)
  const bg = new Grid(TILE, TILE);
  for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) if (g.get(x, y) >= T1 && g.get(x, y) <= T4) bg.set(x, y, 1);
  const edge = new Grid(TILE, TILE);
  for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++)
    if (!bg.get(x, y) && (bg.get(x - 1, y) || bg.get(x + 1, y) || bg.get(x, y - 1) || bg.get(x, y + 1))) edge.set(x, y, 1);
  for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) if (edge.get(x, y)) g.set(x, y, L);
}

function fence(g: Grid): void {
  grassBase(g, 7);
  fillRect(g, 0, 6, 16, 2, S2); fillRect(g, 0, 7, 16, 1, S1);
  fillRect(g, 0, 10, 16, 2, S2); fillRect(g, 0, 11, 16, 1, S1);
  for (const x of [1, 12]) { fillRect(g, x, 4, 3, 10, S2); fillRect(g, x + 2, 4, 1, 10, S1); fillRect(g, x, 4, 3, 1, L); }
  fillRect(g, 0, 5, 16, 1, L); fillRect(g, 0, 12, 16, 1, L);
}

function sign(g: Grid): void {
  grassBase(g, 8);
  fillRect(g, 7, 9, 2, 6, S1);
  fillRect(g, 2, 2, 12, 8, S2); fillRect(g, 2, 9, 12, 1, S1); fillRect(g, 13, 2, 1, 8, S1);
  for (const y of [4, 6]) fillRect(g, 4, y, 8, 1, S1);
  fillRect(g, 2, 1, 12, 1, L); fillRect(g, 1, 2, 1, 8, L); fillRect(g, 14, 2, 1, 8, L); fillRect(g, 2, 10, 12, 1, L);
}

function wall(g: Grid, base: number, mid: number, dark: number, seam: number): void {
  fillRect(g, 0, 0, 16, 16, base);
  fillRect(g, 0, 15, 16, 1, dark);
  for (let y = 3; y < 16; y += 4) fillRect(g, 0, y, 16, 1, seam);
  for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 ? 4 : 0; x < 16; x += 8) fillRect(g, x + 3, y, 1, 3, mid);
}

function roof(g: Grid, d: number, m: number, l: number): void {
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const row = y % 4;
      g.set(x, y, row === 0 ? l : row === 3 ? d : m);
      if (((x + (Math.floor(y / 4) % 2) * 4) % 8) === 0 && row !== 0) g.set(x, y, d);
    }
}

function door(g: Grid, frameBase: number, frameShade: number): void {
  wall(g, frameBase, frameBase, frameShade, frameShade);
  fillRect(g, 3, 0, 10, 16, L);
  fillRect(g, 4, 1, 8, 15, D2);
  fillRect(g, 4, 1, 1, 15, D1); fillRect(g, 11, 1, 1, 15, D1);
  fillRect(g, 5, 3, 6, 5, D1); fillRect(g, 6, 4, 4, 3, D2);
  fillRect(g, 5, 10, 6, 5, D1); fillRect(g, 6, 11, 4, 3, D2);
  g.set(10, 9, F2); // knob
}

function windowTile(g: Grid): void {
  wall(g, H2, H1, H1, H1);
  fillRect(g, 3, 3, 10, 9, L);
  fillRect(g, 4, 4, 8, 7, GL2);
  fillRect(g, 4, 4, 8, 2, GL1); // sky reflection top
  fillRect(g, 4, 7, 8, 1, L); fillRect(g, 7, 4, 1, 7, L);
  g.set(5, 8, F3); g.set(5, 9, F3); // glint
  fillRect(g, 2, 12, 12, 2, S2); fillRect(g, 2, 13, 12, 1, S1);
}

function tallGrass(g: Grid, sway: number): void {
  grassBase(g, 4);
  for (let x = 1; x < 16; x += 3)
    for (let k = 0; k < 2; k++) {
      const bx = x + k, lean = sway && (x + k) % 2 ? 1 : 0;
      for (let y = 4; y < 15; y++) {
        const off = y < 8 ? lean : 0;
        g.set(bx + off, y, y < 7 ? T4 : y < 11 ? T3 : T2);
      }
      g.set(bx, 15, T1);
    }
}

function build(name: TileName, frame: number): Grid {
  const g = new Grid(TILE, TILE);
  switch (name) {
    case "grass": grassBase(g, 1); break;
    case "grass2": grassBase(g, 2); break;
    case "flowers": flowers(g); break;
    case "path": path(g, 4); break;
    case "pathEdge": pathEdge(g); break;
    case "water": return water(frame);
    case "tree": grassBase(g, 6); tree(g); break;
    case "bush": bush(g); break;
    case "fence": fence(g); break;
    case "sign": sign(g); break;
    case "wallHouse": wall(g, H2, H1, H1, H1); break;
    case "roofHouse": roof(g, R1, R2, R3); break;
    case "doorHouse": door(g, H2, H1); break;
    case "windowHouse": windowTile(g); break;
    case "wallLab": wall(g, LB2, LB1, LB1, LB1); fillRect(g, 0, 0, 16, 1, LB3); break;
    case "roofLab": roof(g, LB1, LB2, LB3); break;
    case "doorLab": door(g, LB2, LB1); break;
    case "tallGrass": tallGrass(g, frame); break;
  }
  return g;
}

const ANIMATED: Partial<Record<TileName, number>> = { water: 4, tallGrass: 2 };

export function buildTileset(): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  for (const n of TILE_NAMES) {
    const count = ANIMATED[n] ?? 1;
    anims[n] = Array.from({ length: count }, (_, f) => ({ grid: build(n, f), ox: 0, oy: 0, alpha: 1 }));
    frameMs[n] = n === "water" ? 350 : 500;
  }
  return { w: TILE, h: TILE, palette: TILE_PALETTE, anims, frameMs };
}
