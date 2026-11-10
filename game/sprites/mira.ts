import { Frame, Grid, SpriteSheet, fillRect, roundedBox, silhouette } from "./grid";

// Tidecaller Mira, gym leader of Array Atoll (96x96, front view).
// Theme: the tide is an indexed row of waves. Her belt buckle is `[ ]`, her staff is topped with a
// spiral conch, and the tunic hem scallops in even, numbered-looking swells.
const LINE = 1, T0 = 2, T1 = 3, T2 = 4, T3 = 5; // sea-green tunic ramp (dark -> light)
const S0 = 6, S1 = 7, S2 = 8; // skin
const H0 = 9, H1 = 10, H2 = 11; // hair (deep indigo)
const P0 = 12, P1 = 13, P2 = 14; // pearl / coral shell
const W0 = 15, W1 = 16; // staff wood
const AQ = 17, AQ2 = 18; // conch glow, water
const EYE = 19, WHITE = 20, SASH0 = 21, SASH1 = 22, SAND = 23, FOAM = 24, DULL = 25;

export const MIRA_PALETTE = [
  "", "#10202a", "#14504f", "#1f7a70", "#34a690", "#6fd2b2",
  "#8a5a3c", "#b9825a", "#e0aa80",
  "#1c1f4a", "#2f3a86", "#5568c4",
  "#b8584a", "#f0a18a", "#fff0dc",
  "#6b4a2a", "#a8763f",
  "#b6f7ff", "#4fc3e6",
  "#0e1620", "#ffffff", "#d9602f", "#f6a84d", "#9a7a48", "#e6fbff", "#8aa7a9",
];

const SIZE = 96;
const GROUND = 92;

export interface MiraPose {
  dy?: number; // whole-body vertical offset
  lean?: number; // torso/head x shift
  staffTop?: number; // x tilt of the staff tip
  staffRaise?: number; // lift the staff
  arm?: number; // right hand x shift
  wave?: 0 | 1 | 2 | 3; // water swell cast toward the player
  glow?: boolean;
  eyes?: "open" | "closed" | "x" | "wide";
  sink?: number; // rows cut from the bottom (faint)
  white?: boolean;
}

export function drawMira(p: MiraPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, lean = p.lean ?? 0;
  const tunic = [T0, T1, T2, T3], skin = [S0, S1, S2], hair = [H0, H1, H2], pearl = [P0, P1, P2];
  const cx = 44 + lean;

  // bare feet in the sand
  for (const bx of [cx - 14, cx + 3]) roundedBox(g, bx, GROUND - 6, 12, 7, 3, skin, LINE);
  // long wrap skirt, hem scalloped into even swells
  roundedBox(g, cx - 25, 60 + dy, 50, 28 - dy, 7, tunic, LINE);
  for (let i = 0; i < 6; i++) {
    const hx = cx - 24 + i * 8;
    roundedBox(g, hx, 82, 9, 8, 3, i % 2 ? [T1, T2, T3, T3] : tunic, LINE);
    fillRect(g, hx + 2, 84, 4, 1, FOAM);
  }
  // torso
  roundedBox(g, cx - 19, 38 + dy, 38, 32, 9, tunic, LINE);
  // wave-pattern chest trim (repeating scallop)
  for (let x = cx - 14; x < cx + 14; x += 4) { fillRect(g, x, 48 + dy, 3, 1, FOAM); fillRect(g, x + 1, 49 + dy, 1, 1, FOAM); }
  // sash and bracket buckle  [ ]
  fillRect(g, cx - 19, 64 + dy, 38, 5, SASH0); fillRect(g, cx - 19, 64 + dy, 38, 1, SASH1); fillRect(g, cx - 19, 69 + dy, 38, 1, LINE);
  roundedBox(g, cx - 7, 62 + dy, 14, 9, 2, pearl, LINE);
  for (const [x, y] of [[2, 1], [3, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 5], [11, 1], [10, 1], [11, 2], [11, 3], [11, 4], [11, 5], [10, 5]] as const) g.set(cx - 7 + x - 1, 62 + dy + y + 1, LINE);
  // shell pauldrons
  for (const sx of [cx - 25, cx + 12]) {
    roundedBox(g, sx, 38 + dy, 14, 11, 5, pearl, LINE);
    for (let k = 1; k < 4; k++) fillRect(g, sx + k * 3 + 1, 40 + dy, 1, 7, P0);
  }
  // left arm hanging, open hand
  roundedBox(g, cx - 31, 46 + dy, 11, 22, 5, tunic, LINE);
  fillRect(g, cx - 31, 58 + dy, 11, 2, SASH0);
  roundedBox(g, cx - 31, 66 + dy, 10, 9, 4, skin, LINE);

  // head
  roundedBox(g, cx - 14, 19 + dy, 28, 25, 10, skin, LINE);
  // hair: crown, side locks, braids ending in pearls
  roundedBox(g, cx - 17, 11 + dy, 34, 16, 8, hair, LINE);
  for (const sx of [cx - 18, cx + 11]) {
    roundedBox(g, sx, 20 + dy, 7, 28, 3, hair, LINE);
    fillRect(g, sx + 3, 28 + dy, 1, 17, H0);
    for (let k = 0; k < 3; k++) fillRect(g, sx + 1, 30 + dy + k * 6, 5, 1, H2);
    roundedBox(g, sx + 1, 47 + dy, 5, 5, 2, pearl, LINE);
  }
  fillRect(g, cx - 10, 24 + dy, 20, 3, H1); // fringe
  for (let x = cx - 10; x < cx + 10; x += 3) g.set(x, 27 + dy, H1);
  // coral crown: three shell spikes
  for (const [dx, h] of [[-9, 6], [0, 9], [9, 6]] as const) {
    for (let k = 0; k < h; k++) {
      const half = Math.max(0, Math.floor((h - k - 1) / 3));
      fillRect(g, cx + dx - half - 1, 16 + dy - k, 2 * half + 3, 1, k > h - 4 ? P2 : P1);
      g.set(cx + dx - half - 2, 16 + dy - k, LINE); g.set(cx + dx + half + 2, 16 + dy - k, LINE);
    }
    fillRect(g, cx + dx - 1, 16 + dy - h, 3, 1, LINE);
  }
  fillRect(g, cx - 17, 17 + dy, 34, 3, P1); fillRect(g, cx - 17, 17 + dy, 34, 1, P2); fillRect(g, cx - 17, 20 + dy, 34, 1, LINE);
  // eyes, brows, cheeks, smile
  const ey = 32 + dy, e = p.eyes ?? "open";
  for (const ex of [cx - 9, cx + 3]) {
    fillRect(g, ex, ey - 4, 6, 1, H0);
    if (e === "closed") fillRect(g, ex, ey + 1, 6, 1, LINE);
    else if (e === "x") for (let k = 0; k < 4; k++) { g.set(ex + k, ey - 1 + k, LINE); g.set(ex + 3 - k, ey - 1 + k, LINE); }
    else {
      const h = e === "wide" ? 7 : 5;
      fillRect(g, ex, ey - 1, 6, h, WHITE); fillRect(g, ex + 1, ey, 4, h - 1, AQ2); fillRect(g, ex + 2, ey + 1, 2, h - 3, EYE);
      g.set(ex + 1, ey, WHITE); g.set(ex + 4, ey + h - 2, AQ);
    }
  }
  fillRect(g, cx - 12, ey + 5, 3, 1, SASH1); fillRect(g, cx + 9, ey + 5, 3, 1, SASH1);
  if (e === "x") fillRect(g, cx - 3, ey + 9, 6, 1, LINE); else { fillRect(g, cx - 3, ey + 8, 6, 1, LINE); g.set(cx - 4, ey + 7, LINE); g.set(cx + 3, ey + 7, LINE); }
  g.set(cx, ey + 4, S0);

  // right arm raising the conch staff
  const sx0 = 79 + (p.arm ?? 0), raise = p.staffRaise ?? 0, tilt = p.staffTop ?? 0;
  roundedBox(g, cx + 20, 46 + dy, 12, 20, 5, tunic, LINE);
  fillRect(g, cx + 20, 56 + dy, 12, 2, SASH0);
  const top = 20 - raise, bot = GROUND + 1;
  for (let y = top; y <= bot; y++) {
    const x = sx0 + Math.round((tilt * (bot - y)) / (bot - top));
    fillRect(g, x, y, 3, 1, W1); g.set(x, y, SAND); g.set(x + 2, y, W0);
  }
  // spiral conch head
  const tx = sx0 + tilt - 5;
  roundedBox(g, tx, top - 15, 13, 17, 6, pearl, LINE);
  for (const [x, y] of [[6, 3], [7, 3], [8, 4], [8, 5], [7, 6], [5, 6], [4, 5], [4, 4], [5, 3]] as const) g.set(tx + x, top - 14 + y, P0);
  fillRect(g, tx + 5, top - 7 + 0, 3, 1, P0); fillRect(g, tx + 3, top - 4, 7, 1, P0);
  fillRect(g, tx + 4, top - 18, 5, 4, p.glow === false ? DULL : AQ); // water gem at the tip
  fillRect(g, tx + 4, top - 18, 5, 1, LINE); fillRect(g, tx + 3, top - 17, 1, 3, LINE); fillRect(g, tx + 9, top - 17, 1, 3, LINE);
  g.set(tx + 5, top - 17, WHITE);
  roundedBox(g, sx0 - 3, 58 + dy, 9, 9, 3, skin, LINE);

  // droplets circling the conch (transparent pixels only)
  const gx = tx + 6, gy = top - 8;
  if (p.glow !== false) {
    for (let y = -13; y <= 13; y++) for (let x = -13; x <= 13; x++) {
      const d = Math.hypot(x, y);
      if (d > 10 && d < 13 && (x * 3 + y) % 7 === 0 && !g.get(gx + x, gy + y)) g.set(gx + x, gy + y, AQ);
    }
  }
  // water swell toward the player: a travelling sine ribbon, thicker for bigger casts
  if (p.wave) {
    const amp = 2 + p.wave * 2, thick = 2 + p.wave;
    for (let x = gx - 10; x >= 0; x--) {
      const run = gx - x, cy = gy + 10 + Math.round(run * 0.3) + Math.round(Math.sin(run / 4) * amp);
      for (let k = 0; k < thick; k++) if (!g.get(x, cy + k)) g.set(x, cy + k, k === 0 ? FOAM : k === thick - 1 ? AQ2 : AQ);
    }
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildMira(): SpriteSheet {
  const P = (p: MiraPose) => drawMira(p);
  const idle = [frame(P({})), frame(P({ dy: 1 })), frame(P({ dy: 1, staffRaise: 1 })), frame(P({ eyes: "closed" }))];
  const attack = [
    frame(P({ lean: 3, arm: 4, staffTop: 8, staffRaise: -2, eyes: "wide" })),
    frame(P({ lean: -4, arm: -6, staffTop: -14, staffRaise: 2, wave: 1, eyes: "wide" }), -3, 0),
    frame(P({ lean: -6, arm: -8, staffTop: -18, staffRaise: 4, wave: 3, eyes: "wide" }), -5, 0),
    frame(P({ lean: -2, arm: -2, staffTop: -6, wave: 2 }), -1, 0),
  ];
  const hurt = [frame(P({ white: true, lean: 2 }), 2, 0), frame(P({ eyes: "closed", lean: 3, staffTop: 4, glow: false }), 3, 1)];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", glow: k < 1, lean: k, staffTop: 8 + k * 9, staffRaise: -k * 2, dy: k * 2, sink: k * 6 }), k * 2, 0, 1 - k * 0.26),
  );
  return { w: SIZE, h: SIZE, palette: MIRA_PALETTE, anims: { idle, attack, hurt, faint }, frameMs: { idle: 320, attack: 130, hurt: 120, faint: 220 } };
}
