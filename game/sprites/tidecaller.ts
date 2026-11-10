import { Frame, Grid, SpriteSheet, fillRect, roundedBox, silhouette } from "./grid";

// Tidecaller Mira, keeper of Array Atoll's tide gym (96x96 leader sprite, front view).
// Her tide-staff is topped by a row of four indexed cells [0][1][2][3] and her belt buckle is `[ ]`,
// so she reads as "array" at a glance. Wave splashes carry the attack.
const LINE = 1, C0 = 2, C1 = 3, C2 = 4, C3 = 5; // teal coat ramp (dark -> light)
const S0 = 6, S1 = 7, S2 = 8; // skin
const H0 = 9, H1 = 10, H2 = 11; // aqua hair
const G0 = 12, G1 = 13, G2 = 14; // sandy gold trim
const FOAM = 15, EYE = 16, WHITE = 17, CORAL = 18, BOOT = 19, WAVE0 = 20, WAVE1 = 21, CELL = 22;

export const TIDECALLER_PALETTE = [
  "", "#0e2a33", "#0f5360", "#1a7e86", "#2fb0a8", "#7fe0c9",
  "#7a4a30", "#a96c47", "#d29a6c",
  "#1f6fb0", "#3aa0dc", "#9ae0f6",
  "#8a6a24", "#d6a63c", "#ffe08a",
  "#f2fffb", "#10202a", "#ffffff", "#e8604c", "#3a2a2a", "#4fb6e8", "#b8eaff", "#f6f0d8",
];

const SIZE = 96;
const GROUND = 92;

export interface TidecallerPose {
  dy?: number; // whole-body vertical offset
  lean?: number; // torso/head x shift
  staffTop?: number; // x offset of the staff tip (tilt)
  staffRaise?: number; // lift the staff by this many px
  arm?: number; // right hand x shift
  wave?: 0 | 1 | 2; // splash cone toward the player
  glow?: boolean; // cells lit
  lit?: number; // which cell is highlighted (0..3), -1 none
  eyes?: "open" | "closed" | "x" | "wide";
  hairSway?: number; // hair tip x shift
  sink?: number; // rows cut from the bottom (faint)
  white?: boolean;
}

export function drawTidecaller(p: TidecallerPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, lean = p.lean ?? 0, sway = p.hairSway ?? 0;
  const coat = [C0, C1, C2, C3], skin = [S0, S1, S2], hair = [H0, H1, H2], gold = [G0, G1, G2];
  const cx = 44 + lean;

  // long hair behind the body, with wavy tips
  roundedBox(g, cx - 20, 14 + dy, 40, 56, 14, hair, LINE);
  for (let i = 0; i < 5; i++) {
    const hx = cx - 19 + i * 8 + (i % 2 ? sway : -sway);
    roundedBox(g, hx, 62 + dy + (i % 2) * 4, 8, 12, 3, hair, LINE);
  }
  // boots
  for (const bx of [cx - 15, cx + 3]) {
    roundedBox(g, bx, GROUND - 7, 13, 8, 3, [BOOT, BOOT, C0], LINE);
    fillRect(g, bx + 2, GROUND - 5, 5, 1, C1);
  }
  // skirt (fin-cut hem) and torso
  roundedBox(g, cx - 22, 62 + dy, 44, 26 - dy, 7, coat, LINE);
  for (let i = 0; i < 6; i++) fillRect(g, cx - 20 + i * 8, 84, 4, 3, LINE); // scalloped hem
  fillRect(g, cx - 22, 80, 44, 2, CORAL);
  roundedBox(g, cx - 18, 38 + dy, 36, 34, 9, coat, LINE);
  // foam collar
  roundedBox(g, cx - 14, 38 + dy, 28, 7, 3, [FOAM, FOAM, WHITE], LINE);
  // gold buttons (cells down the front)
  for (let i = 0; i < 3; i++) { const by = 48 + dy + i * 5; fillRect(g, cx - 1, by, 3, 3, G1); g.set(cx - 1, by, G2); }
  // rope belt with "[ ]" buckle
  fillRect(g, cx - 18, 66 + dy, 36, 3, G0); fillRect(g, cx - 18, 66 + dy, 36, 1, G1);
  roundedBox(g, cx - 6, 63 + dy, 12, 9, 2, gold, LINE);
  const bx = cx - 4, by = 65 + dy;
  for (const [x, y] of [[0, 0], [1, 0], [0, 1], [0, 2], [0, 3], [1, 3], [6, 0], [7, 0], [7, 1], [7, 2], [7, 3], [6, 3]] as const) g.set(bx + x, by + y, LINE);

  // left arm (viewer's left): hangs, hand on hip
  roundedBox(g, cx - 28, 44 + dy, 11, 24, 5, coat, LINE);
  fillRect(g, cx - 28, 58 + dy, 11, 3, CORAL);
  roundedBox(g, cx - 27, 66 + dy, 10, 9, 4, skin, LINE);

  // head
  roundedBox(g, cx - 13, 18 + dy, 26, 24, 9, skin, LINE);
  // fringe
  roundedBox(g, cx - 15, 12 + dy, 30, 12, 6, hair, LINE);
  for (let i = 0; i < 6; i++) fillRect(g, cx - 12 + i * 5, 22 + dy, 3, 4 - (i % 2), H1);
  // shell hair-clip
  roundedBox(g, cx + 8, 14 + dy, 8, 7, 3, [CELL, FOAM, WHITE], LINE);
  fillRect(g, cx + 11, 15 + dy, 1, 5, CORAL);
  // eyes
  const ey = 29 + dy, e = p.eyes ?? "open";
  for (const ex of [cx - 9, cx + 4]) {
    if (e === "closed") fillRect(g, ex, ey + 1, 5, 1, LINE);
    else if (e === "x") for (let k = 0; k < 4; k++) { g.set(ex + k, ey - 1 + k, LINE); g.set(ex + 3 - k, ey - 1 + k, LINE); }
    else {
      const h = e === "wide" ? 6 : 5;
      fillRect(g, ex, ey - 1, 5, h, WHITE); fillRect(g, ex + 1, ey, 3, h - 1, EYE); g.set(ex + 1, ey, WHITE);
    }
  }
  fillRect(g, cx - 1, ey + 3, 3, 2, S2); // nose
  fillRect(g, cx - 3, ey + 8, 6, 1, e === "wide" ? LINE : CORAL); // smile
  g.set(cx - 4, ey + 7, CORAL); g.set(cx + 3, ey + 7, CORAL);

  // right arm holding the tide-staff
  const sx0 = 69 + (p.arm ?? 0), raise = p.staffRaise ?? 0, tilt = p.staffTop ?? 0;
  roundedBox(g, cx + 17, 44 + dy, 12, 22, 5, coat, LINE);
  fillRect(g, cx + 17, 56 + dy, 12, 3, CORAL);
  const top = 22 - raise, bot = GROUND + 1;
  for (let y = top; y <= bot; y++) {
    const x = sx0 + Math.round((tilt * (bot - y)) / (bot - top));
    fillRect(g, x, y, 3, 1, G1); g.set(x, y, G2); g.set(x + 2, y, G0);
  }
  // array head: four indexed cells in a rounded frame
  const tx = sx0 + tilt - 14;
  roundedBox(g, tx, top - 14, 31, 14, 3, gold, LINE);
  const lit = p.lit ?? -1;
  for (let i = 0; i < 4; i++) {
    const cell = i === lit ? FOAM : p.glow === false ? C0 : WAVE1;
    fillRect(g, tx + 2 + i * 7, top - 11, 6, 8, cell);
    fillRect(g, tx + 2 + i * 7, top - 4, 6, 1, i === lit ? G2 : WAVE0);
    fillRect(g, tx + 4 + i * 7, top - 9, 2, 4, i === lit ? G1 : p.glow === false ? LINE : WAVE0); // index tick
  }
  roundedBox(g, sx0 - 3, 58 + dy, 9, 9, 3, skin, LINE);

  // splash cone toward the player (transparent pixels only)
  if (p.wave) {
    const spread = p.wave === 2 ? 0.55 : 0.32, hx = tx, hy = top - 6;
    for (let x = hx - 4; x >= 0; x--) {
      const run = hx - x, half = Math.round(run * spread * 0.5) + 2, cy = hy + Math.round(run * 0.4);
      for (let y = cy - half; y <= cy + half; y++) {
        const core = Math.abs(y - cy) < half / 2;
        const crest = (x + Math.round(Math.sin(x / 3) * 2) + y) % 3 === 0;
        if (!g.get(x, y) && (core || crest)) g.set(x, y, core ? WAVE0 : (x + y) % 2 ? WAVE1 : FOAM);
      }
    }
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildTidecaller(): SpriteSheet {
  const P = (p: TidecallerPose) => drawTidecaller(p);
  const idle = [
    frame(P({ lit: 0 })), frame(P({ dy: 1, lit: 1, hairSway: 1 })), frame(P({ dy: 1, staffRaise: 1, lit: 2 })),
    frame(P({ eyes: "closed", lit: 3, hairSway: -1 })),
  ];
  const attack = [
    frame(P({ lean: 1, arm: 1, staffTop: 2, staffRaise: -2, eyes: "wide", lit: 0 })), // wind-up
    frame(P({ lean: -4, arm: -6, staffTop: -14, staffRaise: 2, wave: 1, eyes: "wide", lit: 1 }), -3, 0), // sweep
    frame(P({ lean: -6, arm: -8, staffTop: -18, staffRaise: 4, wave: 2, eyes: "wide", lit: 2 }), -5, 0), // crest
    frame(P({ lean: -2, arm: -2, staffTop: -6, wave: 1, lit: 3 }), -1, 0),
  ];
  const hurt = [
    frame(P({ white: true, lean: 2 }), 2, 0),
    frame(P({ eyes: "closed", lean: 3, staffTop: 4, glow: false, hairSway: 2 }), 3, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", glow: k < 1, lean: k, staffTop: 8 + k * 9, staffRaise: -k * 2, dy: k * 2, sink: k * 6, hairSway: k }), k * 2, 0, 1 - k * 0.26),
  );
  return {
    w: SIZE, h: SIZE, palette: TIDECALLER_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 320, attack: 130, hurt: 120, faint: 220 },
  };
}
