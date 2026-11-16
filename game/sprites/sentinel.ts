import { Frame, Grid, SpriteSheet, ellipse, fillRect, roundedBox, silhouette } from "./grid";

// Stackspire Sentinel (96x96 gym boss, front view). A tower-golem built from four stone slabs stacked
// by LIFO rules: only the top slab can move, and the helm sits on it with a pennant marking the "top".
// Attack: the top slab is lifted (a pop) and the fists slam down. Faint: the slabs come off one by one
// from the top, so the collapse itself reads as repeated pops.
const LINE = 1, S0 = 2, S1 = 3, S2 = 4, S3 = 5; // slate-blue stone ramp (dark -> light)
const G0 = 6, G1 = 7, G2 = 8; // bronze trim
const C0 = 9, C1 = 10, C2 = 11; // rune glow (teal)
const F0 = 12, F1 = 13; // pennant red
const EYE = 14, WHITE = 15, CRACK = 17;

export const SENTINEL_PALETTE = [
  "", "#0d1220", "#2b3550", "#4a5a7e", "#7186ad", "#a9bde0",
  "#6b4a1c", "#b78a3a", "#f0cc6a",
  "#0f6a6e", "#2fd0c0", "#b8fff0",
  "#8a1f2d", "#ee4c5a",
  "#ffe27a", "#ffffff", "#c9d2e4", "#1a2036",
];

const SIZE = 96;
const GROUND = 92;
const ramp = [S0, S1, S2, S3];

export interface SentinelPose {
  dy?: number; // whole-body crouch (positive = lower)
  lean?: number; // x shift of the helm and top slab
  lift?: number; // how far the top slab is raised off the stack (the pop)
  armL?: number; // fist y offset (negative = raised)
  armR?: number;
  reach?: number; // fists pushed toward the player (left, in screen space)
  eyes?: "open" | "closed" | "x" | "wide";
  slabs?: number; // slabs still standing, 0..4 (faint removes them from the top)
  sink?: number;
  white?: boolean;
}

// bottom slab first: [width, height]
const SLABS: Array<[number, number]> = [[66, 15], [58, 14], [50, 14], [42, 13]];

function rune(g: Grid, cx: number, y: number, glow: boolean, kind: number): void {
  // small carved socket with a rune; glows when the slab is "live"
  roundedBox(g, cx - 5, y, 10, 7, 2, [S0, S0, S1], LINE);
  const c = glow ? C2 : C0;
  if (kind === 0) { fillRect(g, cx - 1, y + 2, 3, 3, c); }
  else if (kind === 1) { fillRect(g, cx - 3, y + 3, 7, 1, c); fillRect(g, cx, y + 1, 1, 5, c); }
  else if (kind === 2) { for (let k = 0; k < 4; k++) { g.set(cx - 3 + k, y + 5 - k, c); g.set(cx + 3 - k, y + 5 - k, c); } }
  else { fillRect(g, cx - 3, y + 2, 7, 1, c); fillRect(g, cx - 3, y + 4, 7, 1, c); }
}

function slab(g: Grid, i: number, x: number, top: number, glow: boolean): void {
  const [w, h] = SLABS[i];
  const x0 = Math.round(48 - w / 2) + x;
  roundedBox(g, x0, top, w, h, 3, ramp, LINE);
  // bronze corner caps and a seam line
  for (const cx of [x0 + 2, x0 + w - 7]) { fillRect(g, cx, top + 2, 5, 3, G1); fillRect(g, cx, top + 2, 5, 1, G2); fillRect(g, cx, top + 4, 5, 1, G0); }
  fillRect(g, x0 + 3, top + h - 3, w - 6, 1, S0);
  // chiselled blocks on the face
  for (let k = 8; k < w - 8; k += 11) fillRect(g, x0 + k, top + 5, 1, h - 9, S1);
  rune(g, 48 + x, top + 4, glow, i);
}

function helm(g: Grid, cx: number, top: number, eyes: string): void {
  // pennant first so the helm overlaps its pole
  fillRect(g, cx - 1, top - 14, 3, 14, LINE); fillRect(g, cx, top - 13, 1, 12, G1);
  for (let y = 0; y < 8; y++) {
    const len = 12 - Math.abs(y - 3) * 2;
    fillRect(g, cx + 2, top - 14 + y, len, 1, y < 4 ? F1 : F0);
    g.set(cx + 2 + len, top - 14 + y, LINE);
  }
  fillRect(g, cx + 2, top - 15, 12, 1, LINE);
  g.set(cx - 1, top - 15, G2); g.set(cx, top - 15, G2); g.set(cx + 1, top - 15, G2);
  // helm
  roundedBox(g, cx - 17, top, 34, 22, 8, ramp, LINE);
  fillRect(g, cx - 3, top + 1, 6, 8, G1); fillRect(g, cx - 3, top + 1, 6, 1, G2); // crest plate
  fillRect(g, cx - 14, top + 9, 28, 8, LINE); // visor slot
  if (eyes === "closed") fillRect(g, cx - 12, top + 13, 24, 1, S1);
  else if (eyes === "x") for (const ex of [cx - 11, cx + 3]) for (let k = 0; k < 4; k++) { g.set(ex + k, top + 10 + k, CRACK); g.set(ex + 3 - k, top + 10 + k, CRACK); }
  else {
    const h = eyes === "wide" ? 6 : 4;
    for (const ex of [cx - 12, cx + 4]) { fillRect(g, ex, top + 11, 8, h, C1); fillRect(g, ex + 2, top + 11, 4, h, EYE); g.set(ex, top + 11, C2); }
  }
  // cheek guards and a grille under the visor
  for (let k = 0; k < 4; k++) fillRect(g, cx - 8 + k * 5, top + 17, 3, 3, S0);
}

function fist(g: Grid, cx: number, cy: number, side: -1 | 1): void {
  roundedBox(g, cx - 8, cy - 8, 16, 16, 5, ramp, LINE);
  fillRect(g, cx - 6, cy + 3, 12, 2, G1); fillRect(g, cx - 6, cy + 3, 12, 1, G2); // bronze knuckle band
  for (const k of [-4, 0, 4]) g.set(cx + k + (side > 0 ? 1 : 0), cy - 1, S1);
}

export function drawSentinel(p: SentinelPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, lean = p.lean ?? 0, lift = p.lift ?? 0;
  const standing = p.slabs ?? 4;
  const glow = p.eyes !== "x" && p.eyes !== "closed";
  const sx = (i: number) => (i === 3 ? lean : i === 2 ? Math.round(lean / 2) : 0);

  // ground shadow plate
  ellipse(g, 48, GROUND - 1, 40, 4, S0);
  ellipse(g, 48, GROUND - 2, 38, 3, S1);

  // slabs, bottom to top; the stack top is where the dy crouch applies
  let top = GROUND - 2;
  const tops: number[] = [];
  for (let i = 0; i < 4; i++) { top -= SLABS[i][1] - 1; tops.push(top); }
  for (let i = 0; i < Math.min(standing, 4); i++) {
    const extra = i === 3 ? -lift : 0;
    slab(g, i, sx(i), tops[i] + (i === 0 ? 0 : dy) + extra, glow);
  }
  // fists: floating stone gauntlets beside the second and third slab
  if (standing >= 3) {
    const reach = p.reach ?? 0;
    fist(g, 12 - reach + (p.armL ?? 0) * 0, tops[2] + 12 + dy + (p.armL ?? 0), -1);
    fist(g, 84 - Math.round(reach / 2), tops[2] + 12 + dy + (p.armR ?? 0), 1);
  }
  if (standing >= 4) {
    helm(g, 48 + lean, tops[3] - 21 + dy - lift, p.eyes ?? "open");
  } else if (standing > 0) {
    // the helm has been popped off: it sits on the broken stack, tilted dust cloud around it
    const t = tops[standing - 1] + dy;
    helm(g, 48, t - 21, "x");
  }
  // rubble where slabs came off
  for (let i = Math.max(standing, 0); i < 4; i++) {
    const w = SLABS[i][0] - 14;
    roundedBox(g, 48 - Math.round(w / 2) + (i % 2 ? 6 : -6), GROUND - 7 - (i - standing) * 2, w, 8, 3, ramp, LINE);
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildSentinel(): SpriteSheet {
  const P = (p: SentinelPose) => drawSentinel(p);
  const idle = [
    frame(P({})),
    frame(P({ dy: 1, lean: 1, armL: 1, armR: 1 })),
    frame(P({ dy: 1, lean: 0, lift: 1, armL: -1, armR: -1 })),
    frame(P({ lean: -1, eyes: "closed" })),
  ];
  const attack = [
    frame(P({ dy: 2, lean: 2, armL: -4, armR: -4, eyes: "wide" })), // wind-up
    frame(P({ dy: 0, lean: -2, lift: 8, armL: -14, armR: -14, eyes: "wide" }), -1, 0), // pop: top slab rises
    frame(P({ dy: 3, lean: -5, lift: 0, armL: 8, armR: 6, reach: 14, eyes: "wide" }), -6, 0), // slam
    frame(P({ dy: 1, lean: -3, armL: 2, armR: 2, reach: 6 }), -3, 0),
  ];
  const hurt = [
    frame(P({ white: true, lean: 2 }), 2, 0),
    frame(P({ eyes: "closed", lean: 3, dy: 2 }), 3, 1),
  ];
  const faint = [
    frame(P({ eyes: "x", slabs: 4, lean: 2, dy: 1 })),
    frame(P({ eyes: "x", slabs: 3, dy: 2 }), 0, 0, 0.9),
    frame(P({ eyes: "x", slabs: 2, dy: 2 }), 0, 0, 0.7),
    frame(P({ eyes: "x", slabs: 1, dy: 2, sink: 3 }), 0, 0, 0.4),
    frame(P({ eyes: "x", slabs: 0, dy: 2, sink: 5 }), 0, 0, 0.12),
  ];
  return {
    w: SIZE, h: SIZE, palette: SENTINEL_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 340, attack: 120, hurt: 120, faint: 220 },
  };
}
