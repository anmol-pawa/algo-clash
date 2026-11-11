import { Frame, Grid, SpriteSheet, ellipse, fillRect, roundedBox, silhouette } from "./grid";

// Hydra of Hashwood (96x96 gym boss, front view). Three heads rise from a barnacled bulk: each head
// wears a coloured bucket-gem on its brow. Two heads carry the SAME gem colour (a collision), and the
// third head hisses the attack. It reads as a hash table: many heads (buckets), shared slots (collisions).
const LINE = 1, T0 = 2, T1 = 3, T2 = 4, T3 = 5; // sea-teal scale ramp (dark -> light)
const B0 = 6, B1 = 7, B2 = 8; // belly plates (sand)
const R0 = 9, R1 = 10; // gem red
const U0 = 11, U1 = 12; // gem blue
const EYE = 13, WHITE = 14, AMBER = 15, FANG = 16, MAW = 17, BARN0 = 18, BARN1 = 19, WATER0 = 20, WATER1 = 21;

export const HYDRA_PALETTE = [
  "", "#0b1f22", "#17484a", "#238a82", "#3ec3a6", "#9af0cf",
  "#8c6a3c", "#c9a265", "#efd9a0",
  "#8a1f2d", "#ee4c5a",
  "#1f4ea0", "#5aa0ff",
  "#2a1408", "#ffffff", "#ffc83a", "#f4f4e8", "#a02838", "#6b6a5c", "#b9b8a4", "#2e6fa8", "#9fd8f4",
];

const SIZE = 96;
const GROUND = 92;

export interface HydraPose {
  dy?: number; // whole-body bob
  sway?: [number, number, number]; // x shift of each head (left, middle, right)
  rise?: [number, number, number]; // y lift of each head
  open?: [boolean, boolean, boolean]; // mouths open
  spit?: 0 | 1 | 2; // water jet from the middle head toward the player
  eyes?: "open" | "closed" | "x" | "wide";
  sink?: number; // rows cut from the bottom (faint)
  white?: boolean;
}

const ramp = [T0, T1, T2, T3];

function neck(g: Grid, bx: number, by: number, hx: number, hy: number, bend: number): void {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, cx = bx + bend, cy = (by + hy) / 2 + 6;
    pts.push([
      Math.round((1 - t) * (1 - t) * bx + 2 * (1 - t) * t * cx + t * t * hx),
      Math.round((1 - t) * (1 - t) * by + 2 * (1 - t) * t * cy + t * t * hy),
    ]);
  }
  for (const [x, y] of pts) ellipse(g, x, y, 7, 7, LINE);
  for (const [x, y] of pts) ellipse(g, x, y, 6, 6, T1);
  for (const [x, y] of pts) ellipse(g, x - 1, y - 1, 4, 4, T2);
  for (const [x, y] of pts) ellipse(g, x - 2, y - 2, 2, 2, T3);
  // belly scutes down the front of the neck
  pts.forEach(([x, y], i) => { if (i % 3 === 0 && i > 2 && i < 23) fillRect(g, x - 2, y, 5, 1, B1); });
}

function head(g: Grid, cx: number, cy: number, open: boolean, gem: [number, number], eyes: string): void {
  roundedBox(g, cx - 12, cy - 9, 24, 17, 7, ramp, LINE); // skull
  roundedBox(g, cx - 9, cy + 2, 18, 9, 4, open ? [MAW, MAW, R0] : ramp, LINE); // jaw
  if (open) {
    fillRect(g, cx - 6, cy + 4, 12, 4, MAW);
    for (const fx of [cx - 6, cx + 4]) { fillRect(g, fx, cy + 3, 2, 3, FANG); }
    fillRect(g, cx - 2, cy + 7, 4, 1, R1); // tongue
  } else {
    fillRect(g, cx - 7, cy + 5, 14, 1, LINE);
    g.set(cx - 7, cy + 6, FANG); g.set(cx + 6, cy + 6, FANG);
  }
  // spines on the crown
  for (const sx of [cx - 7, cx - 1, cx + 5]) { fillRect(g, sx, cy - 13, 3, 4, LINE); fillRect(g, sx + 1, cy - 12, 1, 2, T3); }
  // brow gem (bucket marker)
  roundedBox(g, cx - 3, cy - 8, 7, 6, 2, gem, LINE);
  g.set(cx - 1, cy - 7, WHITE);
  // eyes
  for (const ex of [cx - 9, cx + 4]) {
    if (eyes === "closed") fillRect(g, ex, cy - 1, 5, 1, LINE);
    else if (eyes === "x") for (let k = 0; k < 4; k++) { g.set(ex + k, cy - 3 + k, LINE); g.set(ex + 3 - k, cy - 3 + k, LINE); }
    else {
      const h = eyes === "wide" ? 6 : 4;
      fillRect(g, ex, cy - 3, 5, h, AMBER); fillRect(g, ex + 2, cy - 3, 2, h, EYE); g.set(ex, cy - 3, WHITE);
    }
  }
  fillRect(g, cx - 1, cy + 1, 1, 1, LINE); fillRect(g, cx + 1, cy + 1, 1, 1, LINE); // nostrils
}

export function drawHydra(p: HydraPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, sw = p.sway ?? [0, 0, 0], rs = p.rise ?? [0, 0, 0];
  const op = p.open ?? [false, false, false], eyes = p.eyes ?? "open";
  const hx = [20, 48, 76], hy = [24, 14, 28];
  const bases = [30, 48, 66];

  // wave base
  ellipse(g, 48, GROUND - 2, 44, 6, WATER0);
  ellipse(g, 48, GROUND - 3, 40, 4, WATER1);
  // necks (side ones first, middle in front)
  neck(g, bases[0], 72 + dy, hx[0] + sw[0], hy[0] - rs[0] + dy + 6, -14);
  neck(g, bases[2], 72 + dy, hx[2] + sw[2], hy[2] - rs[2] + dy + 6, 14);
  neck(g, bases[1], 74 + dy, hx[1] + sw[1], hy[1] - rs[1] + dy + 6, 0);
  // bulk
  roundedBox(g, 12, 62 + dy, 72, 28 - dy, 12, ramp, LINE);
  roundedBox(g, 30, 70 + dy, 36, 20 - dy, 8, [B0, B1, B2], LINE);
  for (let i = 0; i < 4; i++) fillRect(g, 32, 74 + dy + i * 4, 32, 1, B0);
  // barnacles on the flanks
  for (const [bx, by] of [[16, 70], [22, 80], [74, 72], [68, 82], [80, 80]] as const) {
    ellipse(g, bx, by + dy, 3, 3, LINE); ellipse(g, bx, by + dy, 2, 2, BARN1); g.set(bx, by + dy, BARN0);
  }
  // scale texture
  for (let y = 64; y < 70; y++) for (let x = 16; x < 80; x++) if ((x + y * 2) % 7 === 0 && g.get(x, y + dy) === T1) g.set(x, y + dy, T3);

  // heads: left and middle share the red gem (a collision), right is blue
  const gems: Array<[number, number]> = [[R0, R1], [R0, R1], [U0, U1]];
  const order = [0, 2, 1];
  for (const i of order) head(g, hx[i] + sw[i], hy[i] - rs[i] + dy, op[i], gems[i], eyes);

  // water jet from the middle head
  if (p.spit) {
    const sx = hx[1] + sw[1] - 4, sy = hy[1] - rs[1] + dy + 8;
    for (let x = sx; x >= 0; x--) {
      const run = sx - x, half = Math.round(run * (p.spit === 2 ? 0.28 : 0.16)) + 2, cy = sy + Math.round(run * 0.55);
      for (let y = cy - half; y <= cy + half; y++) {
        const core = Math.abs(y - cy) < half / 2;
        if (!g.get(x, y) && (core ? (x + y) % 3 !== 0 : (x * 3 + y * 5) % 5 < 2)) g.set(x, y, core ? WATER1 : WATER0);
      }
    }
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildHydra(): SpriteSheet {
  const P = (p: HydraPose) => drawHydra(p);
  const idle = [
    frame(P({})),
    frame(P({ dy: 1, sway: [1, -1, 1], rise: [0, 1, 0] })),
    frame(P({ dy: 1, sway: [2, 0, -1], rise: [1, 0, 1], open: [false, true, false] })),
    frame(P({ sway: [1, 1, 0], eyes: "closed" })),
  ];
  const attack = [
    frame(P({ dy: 2, sway: [-1, 2, 1], rise: [-2, -3, -2], eyes: "wide" })), // coil
    frame(P({ dy: -1, sway: [4, -4, -3], rise: [2, 3, 2], open: [true, true, true], eyes: "wide" }), -2, 0), // strike
    frame(P({ dy: -1, sway: [6, -8, -5], rise: [3, 1, 3], open: [true, true, true], spit: 1, eyes: "wide" }), -4, 0),
    frame(P({ sway: [3, -6, -2], open: [false, true, false], spit: 2 }), -3, 0),
  ];
  const hurt = [
    frame(P({ white: true, sway: [-2, 2, -2] }), 2, 0),
    frame(P({ eyes: "closed", sway: [-3, 3, -3], rise: [-3, -3, -3], dy: 2 }), 3, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", sway: [-k * 2, 0, k * 2], rise: [-k * 4, -k * 5, -k * 4], dy: k * 2, sink: k * 8 }), 0, 0, 1 - k * 0.26),
  );
  return {
    w: SIZE, h: SIZE, palette: HYDRA_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 320, attack: 110, hurt: 120, faint: 220 },
  };
}
