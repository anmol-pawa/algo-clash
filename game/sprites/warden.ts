import { Frame, Grid, SpriteSheet, fillRect, roundedBox, silhouette } from "./grid";

// Warden Brace, keeper of the Compiler Lighthouse (96x96 leader sprite, front view).
// His lamp-staff, cap lantern and brace-shaped belt buckle `{ }` carry the "compiler" theme.
const LINE = 1, C0 = 2, C1 = 3, C2 = 4, C3 = 5; // navy coat ramp (dark -> light)
const S0 = 6, S1 = 7, S2 = 8; // skin
const B0 = 9, B1 = 10, B2 = 11; // beard and brows (white-grey)
const G0 = 12, G1 = 13, G2 = 14; // brass
const LAMP = 15, EYE = 16, WHITE = 17, RED = 18, BOOT = 19, HALO = 20, GLASS = 21;

export const WARDEN_PALETTE = [
  "", "#12162a", "#1b2a58", "#2a418a", "#3f60b8", "#6c92e2",
  "#8a5239", "#b57a56", "#dba67c",
  "#8b94aa", "#c6cddb", "#f2f5fa",
  "#7a4f12", "#c88a1e", "#ffd25a",
  "#fff6bf", "#101820", "#ffffff", "#c8392f", "#2a2232", "#ffe98a", "#9fd8f0",
];

const SIZE = 96;
const GROUND = 92;

export interface WardenPose {
  dy?: number; // whole-body vertical offset
  lean?: number; // torso/head x shift
  staffTop?: number; // x offset of the staff tip (tilt)
  staffRaise?: number; // lift the staff by this many px
  arm?: number; // right hand x shift
  beam?: 0 | 1 | 2; // light beam cone toward the player
  glow?: boolean;
  eyes?: "open" | "closed" | "x" | "wide";
  sink?: number; // rows cut from the bottom (faint)
  white?: boolean;
}

export function drawWarden(p: WardenPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, lean = p.lean ?? 0;
  const coat = [C0, C1, C2, C3], skin = [S0, S1, S2], beard = [B0, B1, B2];
  const cx = 44 + lean; // body centre

  // boots
  for (const bx of [cx - 16, cx + 4]) {
    roundedBox(g, bx, GROUND - 7, 14, 8, 3, [BOOT, BOOT, C0], LINE);
    fillRect(g, bx + 2, GROUND - 5, 6, 1, C1);
  }
  // coat skirt then torso
  roundedBox(g, cx - 24, 62 + dy, 48, 28 - dy, 7, coat, LINE);
  roundedBox(g, cx - 20, 38 + dy, 40, 36, 9, coat, LINE);
  // hem stripe and coat seam
  fillRect(g, cx - 22, 84, 44, 2, RED); fillRect(g, cx - 22, 86, 44, 1, LINE);
  fillRect(g, cx, 50 + dy, 1, 34 - dy, C0);
  // lapels
  for (let i = 0; i < 9; i++) {
    g.set(cx - 2 - i, 42 + dy + i, C3); g.set(cx + 2 + i, 42 + dy + i, C3);
    g.set(cx - 3 - i, 42 + dy + i, LINE); g.set(cx + 3 + i, 42 + dy + i, LINE);
  }
  // brass buttons
  for (let i = 0; i < 4; i++) { const by = 53 + dy + i * 5; fillRect(g, cx - 7, by, 3, 3, G1); g.set(cx - 7, by, G2); }
  // belt with brace buckle
  fillRect(g, cx - 20, 66 + dy, 40, 4, C0); fillRect(g, cx - 20, 66 + dy, 40, 1, LINE);
  roundedBox(g, cx - 6, 64 + dy, 12, 8, 2, [G0, G1, G2], LINE);
  const bx = cx - 4, by = 66 + dy; // "{ }" glyph
  for (const [x, y] of [[1, 0], [0, 1], [1, 2], [0, 3], [6, 0], [7, 1], [6, 2], [7, 3]] as const) g.set(bx + x, by + y, LINE);

  // left arm (viewer's left): hanging, fist
  roundedBox(g, cx - 31, 44 + dy, 12, 26, 5, coat, LINE);
  fillRect(g, cx - 31, 62 + dy, 12, 3, RED);
  roundedBox(g, cx - 31, 69 + dy, 11, 9, 4, skin, LINE);

  // head
  roundedBox(g, cx - 14, 20 + dy, 28, 25, 9, skin, LINE);
  // beard
  roundedBox(g, cx - 16, 33 + dy, 32, 22, 9, beard, LINE);
  fillRect(g, cx - 5, 36 + dy, 10, 1, B1); // moustache split
  for (let i = 0; i < 3; i++) { g.set(cx - 7 + i * 7, 45 + dy + i, B0); g.set(cx - 6 + i * 7, 47 + dy, B0); }
  fillRect(g, cx - 4, 41 + dy, 8, 2, S0); // mouth under the moustache
  // eyes and brows
  const ey = 29 + dy, e = p.eyes ?? "open";
  for (const ex of [cx - 9, cx + 4]) {
    fillRect(g, ex - 1, ey - 5, 7, 2, B2); fillRect(g, ex, ey - 4, 6, 1, B1);
    if (e === "closed") fillRect(g, ex, ey + 1, 5, 1, LINE);
    else if (e === "x") for (let k = 0; k < 4; k++) { g.set(ex + k, ey - 1 + k, LINE); g.set(ex + 3 - k, ey - 1 + k, LINE); }
    else {
      const h = e === "wide" ? 6 : 4;
      fillRect(g, ex, ey - 1, 5, h, WHITE); fillRect(g, ex + 1, ey, 3, h - 1, EYE); g.set(ex + 1, ey, WHITE);
    }
  }
  fillRect(g, cx - 1, ey + 2, 3, 4, S2); // nose

  // cap: navy crown, brass band, brim
  roundedBox(g, cx - 17, 10 + dy, 34, 15, 6, coat, LINE);
  fillRect(g, cx - 17, 21 + dy, 34, 3, G1); fillRect(g, cx - 17, 21 + dy, 34, 1, G2); fillRect(g, cx - 17, 24 + dy, 34, 1, LINE);
  fillRect(g, cx - 20, 24 + dy, 40, 3, C0); fillRect(g, cx - 20, 26 + dy, 40, 1, LINE);
  // lantern on the cap: brass roof, glass room
  roundedBox(g, cx - 6, 0 + dy, 12, 11, 2, [G0, G1, G2], LINE);
  fillRect(g, cx - 4, 3 + dy, 8, 6, p.glow === false ? GLASS : LAMP);
  fillRect(g, cx - 1, 3 + dy, 2, 6, G0);

  // right arm holding the lamp-staff
  const sx0 = 78 + (p.arm ?? 0), raise = p.staffRaise ?? 0, tilt = p.staffTop ?? 0;
  roundedBox(g, cx + 19, 44 + dy, 13, 22, 5, coat, LINE);
  fillRect(g, cx + 19, 58 + dy, 13, 3, RED);
  // staff pole (tilted by interpolation)
  const top = 14 - raise, bot = GROUND + 1;
  for (let y = top; y <= bot; y++) {
    const x = sx0 + Math.round((tilt * (bot - y)) / (bot - top));
    fillRect(g, x, y, 3, 1, G1); g.set(x, y, G2); g.set(x + 2, y, G0);
  }
  const tx = sx0 + tilt - 3; // lantern head
  roundedBox(g, tx, top - 12, 9, 14, 2, [G0, G1, G2], LINE);
  fillRect(g, tx + 2, top - 9, 5, 8, p.glow === false ? GLASS : LAMP);
  roundedBox(g, tx - 2, top - 15, 13, 4, 1, [G0, G1, G2], LINE);
  // hand over the pole
  roundedBox(g, sx0 - 3, 60 + dy, 9, 9, 3, skin, LINE);

  // halo and beam (drawn only onto transparent pixels so the body stays crisp)
  const lampX = tx + 4, lampY = top - 5;
  if (p.glow !== false) {
    for (let y = -9; y <= 9; y++) for (let x = -9; x <= 9; x++) {
      const d = Math.hypot(x, y);
      if (d > 5 && d < 9 && (x + y) % 2 === 0 && !g.get(lampX + x, lampY + y)) g.set(lampX + x, lampY + y, HALO);
    }
  }
  if (p.beam) {
    const spread = p.beam === 2 ? 0.55 : 0.32;
    for (let x = lampX - 6; x >= 0; x--) {
      const run = lampX - x, half = Math.round(run * spread * 0.5) + 2, cy = lampY + Math.round(run * 0.35);
      for (let y = cy - half; y <= cy + half; y++) {
        const core = Math.abs(y - cy) < half / 2;
        if (!g.get(x, y) && (core || (x + y) % 2 === 0)) g.set(x, y, core ? LAMP : HALO);
      }
    }
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildWarden(): SpriteSheet {
  const P = (p: WardenPose) => drawWarden(p);
  const idle = [
    frame(P({})), frame(P({ dy: 1 })), frame(P({ dy: 1, staffRaise: 1 })), frame(P({ eyes: "closed" })),
  ];
  const attack = [
    frame(P({ lean: 3, arm: 4, staffTop: 8, staffRaise: -2, eyes: "wide" })), // wind-up: staff cocked back
    frame(P({ lean: -4, arm: -6, staffTop: -14, staffRaise: 2, beam: 1, eyes: "wide" }), -3, 0), // swing
    frame(P({ lean: -6, arm: -8, staffTop: -18, staffRaise: 4, beam: 2, eyes: "wide" }), -5, 0), // flash
    frame(P({ lean: -2, arm: -2, staffTop: -6, beam: 1 }), -1, 0),
  ];
  const hurt = [
    frame(P({ white: true, lean: 2 }), 2, 0),
    frame(P({ eyes: "closed", lean: 3, staffTop: 4, glow: false }), 3, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", glow: k < 1, lean: k, staffTop: 8 + k * 9, staffRaise: -k * 2, dy: k * 2, sink: k * 6 }), k * 2, 0, 1 - k * 0.26),
  );
  return {
    w: SIZE, h: SIZE, palette: WARDEN_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 320, attack: 130, hurt: 120, faint: 220 },
  };
}
