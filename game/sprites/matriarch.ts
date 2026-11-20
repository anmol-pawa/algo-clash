import { Frame, Grid, SpriteSheet, ellipse, fillRect, roundedBox, silhouette } from "./grid";

// Chainwyrm Matriarch (96x96 gym boss, front view facing the player on the left). A serpent whose body is
// a chain of scaled nodes joined by golden link rings (the `next` pointers). The tail ends in a hollow
// ring (null), and a golden arrow crest on the head marks the `head` pointer. Attack: the head whips out
// along the chain. Faint: the link rings drop away one by one, so the body falls apart node by node.
const LINE = 1, G0 = 2, G1 = 3, G2 = 4, G3 = 5; // jade scale ramp (dark -> light)
const K0 = 6, K1 = 7, K2 = 8; // gold links
const TONGUE = 9, EYE = 10, EYE_HI = 11, WHITE = 12, BELLY = 13, BELLY_D = 14, CRACK = 15;

export const MATRIARCH_PALETTE = [
  "", "#0b1a16", "#14352b", "#1f6b4b", "#35a46a", "#8de09a",
  "#6b4a1c", "#c99a3a", "#ffe08a",
  "#d8384e", "#ff9d2e", "#fff2b0", "#ffffff", "#e8dca0", "#a8975c", "#1a2036",
];

const SIZE = 96;
const GROUND = 92;
const ramp = [G0, G1, G2, G3];

export interface MatriarchPose {
  sway?: number; // phase 0..1 of the body wave (shifts the nodes)
  amp?: number; // sway amplitude in px
  headDx?: number; // head lunge toward the player (negative = left)
  headDy?: number;
  jaw?: number; // mouth opening in px
  eyes?: "open" | "closed" | "x" | "wide";
  links?: number; // link rings still joined (0..5)
  sag?: number; // faint: nodes slump toward the ground
  tongue?: boolean;
  sink?: number;
  white?: boolean;
}

// body nodes from tail to neck: [x, y, radius]
const NODES: Array<[number, number, number]> = [
  [22, 82, 8], [40, 80, 11], [60, 77, 13], [72, 58, 12], [64, 40, 11],
];
const HEAD: [number, number] = [46, 24];

function node(g: Grid, cx: number, cy: number, r: number, glow: boolean): void {
  ellipse(g, cx, cy, r + 1, r + 1, LINE);
  ellipse(g, cx, cy, r, r, G0);
  ellipse(g, cx - 1, cy - 1, r - 1, r - 1, G1);
  ellipse(g, cx - 2, cy - 2, Math.max(2, r - 3), Math.max(2, r - 3), G2);
  ellipse(g, cx - Math.round(r / 3), cy - Math.round(r / 3), Math.max(1, Math.round(r / 3)), Math.max(1, Math.round(r / 3)), G3);
  // scale arcs
  for (let k = -r + 4; k < r - 2; k += 4) for (let j = -r + 3; j < r - 2; j += 4) {
    if (k * k + j * j < (r - 3) * (r - 3)) { g.set(cx + k, cy + j + ((k >> 2) & 1) * 2, G0); }
  }
  // rune stud (the node's value)
  fillRect(g, cx - 1, cy - 1, 3, 3, glow ? K2 : K0);
  g.set(cx - 1, cy - 1, glow ? EYE_HI : K1);
}

function link(g: Grid, a: [number, number, number], b: [number, number, number]): void {
  const mx = Math.round((a[0] + b[0]) / 2), my = Math.round((a[1] + b[1]) / 2);
  const horiz = Math.abs(a[0] - b[0]) >= Math.abs(a[1] - b[1]);
  const rx = horiz ? 6 : 4, ry = horiz ? 4 : 6;
  ellipse(g, mx, my, rx + 1, ry + 1, LINE);
  ellipse(g, mx, my, rx, ry, K0);
  ellipse(g, mx - 1, my - 1, rx - 1, ry - 1, K1);
  ellipse(g, mx, my, rx - 2, ry - 2, LINE); // hole
  g.set(mx - rx + 1, my - 1, K2); g.set(mx - rx + 2, my - 2, K2);
}

function tailRing(g: Grid, x: number, y: number): void {
  // hollow ring at the very end: the null pointer
  ellipse(g, x, y, 7, 5, LINE);
  ellipse(g, x, y, 6, 4, K1);
  ellipse(g, x, y, 3, 2, 0);
  ellipse(g, x, y, 3, 2, LINE);
  ellipse(g, x, y, 2, 1, 0);
  fillRect(g, x - 5, y - 3, 3, 1, K2);
}

function head(g: Grid, cx: number, cy: number, jaw: number, eyes: string, tongue: boolean): void {
  // golden arrow crest (the head pointer)
  for (let y = 0; y < 8; y++) {
    const w = y * 2 + 1;
    fillRect(g, cx - y + 4, cy - 22 + y, w, 1, y < 2 ? K2 : K1);
    g.set(cx - y + 3, cy - 22 + y, LINE); g.set(cx + y + 5, cy - 22 + y, LINE);
  }
  fillRect(g, cx + 3, cy - 14, 3, 5, K0);
  // neck blends into the first node; skull
  roundedBox(g, cx - 14, cy - 11, 38, 22, 9, ramp, LINE);
  // snout (toward the player)
  roundedBox(g, cx - 22, cy - 4, 16, 14, 5, ramp, LINE);
  // horns
  for (let k = 0; k < 5; k++) { fillRect(g, cx + 12 + k, cy - 13 - k, 3, 1, K1); g.set(cx + 11 + k, cy - 13 - k, LINE); }
  // belly plates / lower jaw
  const jy = cy + 6;
  roundedBox(g, cx - 20, jy + jaw, 30, 8, 3, [BELLY_D, BELLY_D, BELLY, BELLY], LINE);
  if (jaw > 2) {
    for (const fx of [cx - 18, cx - 11, cx - 4]) { fillRect(g, fx, jy + jaw - 2, 2, 3, WHITE); g.set(fx, jy + jaw + 1, LINE); }
    fillRect(g, cx - 16, jy + 2, 24, jaw - 1, LINE); // inside the mouth
    fillRect(g, cx - 14, jy + 3, 18, Math.max(1, jaw - 3), TONGUE);
  }
  if (tongue) { fillRect(g, cx - 30, cy + 4, 9, 1, TONGUE); g.set(cx - 31, cy + 3, TONGUE); g.set(cx - 31, cy + 5, TONGUE); }
  // nostril
  g.set(cx - 20, cy + 1, LINE);
  // eyes
  if (eyes === "closed") { fillRect(g, cx - 10, cy - 3, 8, 1, LINE); fillRect(g, cx + 4, cy - 3, 8, 1, LINE); }
  else if (eyes === "x") {
    for (const ex of [cx - 10, cx + 4]) for (let k = 0; k < 4; k++) { g.set(ex + k, cy - 5 + k, CRACK); g.set(ex + 3 - k, cy - 5 + k, CRACK); }
  } else {
    const h = eyes === "wide" ? 6 : 4;
    for (const ex of [cx - 10, cx + 4]) {
      fillRect(g, ex, cy - 5, 7, h, EYE); fillRect(g, ex + 3, cy - 5, 2, h, LINE); g.set(ex, cy - 5, EYE_HI);
      fillRect(g, ex - 1, cy - 6, 9, 1, LINE);
    }
  }
}

export function drawMatriarch(p: MatriarchPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const phase = (p.sway ?? 0) * Math.PI * 2, amp = p.amp ?? 0, sag = p.sag ?? 0;
  const links = p.links ?? 5;
  const glow = p.eyes !== "x" && p.eyes !== "closed";

  // shadow
  ellipse(g, 48, GROUND - 1, 44, 4, G0);
  ellipse(g, 48, GROUND - 2, 40, 3, G1);

  const pos = NODES.map(([x, y, r], i): [number, number, number] => [
    x + Math.round(Math.sin(phase + i * 0.9) * amp * 0.6) + (links < 5 && i < 5 - links ? -2 * (5 - links - i) : 0),
    Math.min(GROUND - r - 2, y + Math.round(Math.cos(phase + i * 0.9) * amp * 0.5) + Math.round(sag * (i / 4 + 0.4))),
    r,
  ]);
  const hx = HEAD[0] + (p.headDx ?? 0) + Math.round(Math.sin(phase + 3.6) * amp * 0.5);
  const hy = HEAD[1] + (p.headDy ?? 0) + Math.round(Math.cos(phase + 3.6) * amp * 0.4) + Math.round(sag * 1.4);

  // the null ring at the tail end (index -1)
  tailRing(g, pos[0][0] - 17, pos[0][1] + 3);
  for (let i = 0; i < pos.length; i++) node(g, pos[i][0], pos[i][1], pos[i][2], glow);
  // link rings sit over the seams: ring i joins node i-1 and node i; the faint pose drops them tail-first
  for (let i = 1; i < pos.length; i++) if (i - 1 >= 5 - links) link(g, pos[i - 1], pos[i]);
  if (links >= 1) link(g, pos[pos.length - 1], [hx + 4, hy + 6, 8]);
  head(g, hx, hy, p.jaw ?? 0, p.eyes ?? "open", !!p.tongue);

  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildMatriarch(): SpriteSheet {
  const P = (p: MatriarchPose) => drawMatriarch(p);
  const idle = [
    frame(P({ sway: 0, amp: 1.5 })),
    frame(P({ sway: 0.25, amp: 1.5, tongue: true })),
    frame(P({ sway: 0.5, amp: 1.5 })),
    frame(P({ sway: 0.75, amp: 1.5, eyes: "closed" })),
  ];
  const attack = [
    frame(P({ sway: 0.1, amp: 3, headDx: 8, headDy: 2, eyes: "wide" })), // coil back
    frame(P({ sway: 0.3, amp: 3, headDx: -10, headDy: 4, jaw: 7, eyes: "wide" }), -3, 0), // whip out, jaws open
    frame(P({ sway: 0.5, amp: 4, headDx: -22, headDy: 12, jaw: 8, eyes: "wide" }), -8, 0), // strike
    frame(P({ sway: 0.7, amp: 2, headDx: -8, headDy: 4, jaw: 3 }), -3, 0),
  ];
  const hurt = [
    frame(P({ white: true, headDx: 3, amp: 2 }), 2, 0),
    frame(P({ eyes: "closed", headDx: 5, headDy: 3, amp: 2, sway: 0.4 }), 3, 1),
  ];
  const faint = [
    frame(P({ eyes: "x", links: 5, sag: 2, headDy: 3 })),
    frame(P({ eyes: "x", links: 4, sag: 5, headDy: 8 }), 0, 0, 0.9),
    frame(P({ eyes: "x", links: 3, sag: 8, headDy: 14 }), 0, 0, 0.7),
    frame(P({ eyes: "x", links: 1, sag: 11, headDy: 20, sink: 3 }), 0, 0, 0.4),
    frame(P({ eyes: "x", links: 0, sag: 14, headDy: 26, sink: 6 }), 0, 0, 0.12),
  ];
  return {
    w: SIZE, h: SIZE, palette: MATRIARCH_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 340, attack: 120, hurt: 120, faint: 220 },
  };
}
