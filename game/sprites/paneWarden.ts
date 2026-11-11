import { Frame, Grid, SpriteSheet, fillRect, roundedBox, silhouette } from "./grid";

// Pane Warden Sorrel, keeper of Window Woods (96x96 leader sprite, front view).
// Her staff is topped by a window frame with a bright sliding pane (the window that moves along the
// row), and her belt buckle is an hourglass: she is impatient and obsessed with O(n).
// The gust of cut leaves is the attack.
const LINE = 1, C0 = 2, C1 = 3, C2 = 4, C3 = 5; // forest-green cloak ramp (dark -> light)
const S0 = 6, S1 = 7, S2 = 8; // skin
const H0 = 9, H1 = 10, H2 = 11; // rust-orange hair
const W0 = 12, W1 = 13, W2 = 14; // wood trim
const GLASS0 = 15, GLASS1 = 16, GLASS2 = 17; // window glass (dark -> bright)
const EYE = 18, WHITE = 19, AMBER = 20, BOOT = 21, LEAF0 = 22, LEAF1 = 23;

export const PANE_WARDEN_PALETTE = [
  "", "#0f2218", "#16422b", "#23703f", "#3aa653", "#8ae07a",
  "#6e3f2a", "#a46a44", "#d49a6c",
  "#7a2f14", "#c75a1f", "#f2993f",
  "#5c3a1c", "#9a6a32", "#d6a45a",
  "#3b6f88", "#78c0dc", "#e4faff",
  "#14202a", "#ffffff", "#ffd25a", "#2c2018", "#2f8f3a", "#a4e86a",
];

const SIZE = 96;
const GROUND = 92;

export interface PaneWardenPose {
  dy?: number; // whole-body vertical offset
  lean?: number; // torso/head x shift
  staffTop?: number; // x offset of the staff tip (tilt)
  staffRaise?: number; // lift the staff by this many px
  arm?: number; // right hand x shift
  gust?: 0 | 1 | 2; // leaf-gust cone toward the player
  pane?: number; // position of the bright sliding pane (0..3), -1 none
  glow?: boolean; // glass lit
  tap?: boolean; // front boot lifted (impatient foot-tap)
  eyes?: "open" | "closed" | "x" | "wide";
  hairSway?: number; // ponytail tip x shift
  sink?: number; // rows cut from the bottom (faint)
  white?: boolean;
}

export function drawPaneWarden(p: PaneWardenPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const dy = p.dy ?? 0, lean = p.lean ?? 0, sway = p.hairSway ?? 0;
  const cloak = [C0, C1, C2, C3], skin = [S0, S1, S2], hair = [H0, H1, H2], wood = [W0, W1, W2];
  const cx = 44 + lean;

  // ponytail behind the body
  roundedBox(g, cx - 18, 14 + dy, 36, 30, 12, hair, LINE);
  roundedBox(g, cx + 12 + sway, 30 + dy, 9, 30, 4, hair, LINE);
  fillRect(g, cx + 12 + sway, 34 + dy, 9, 2, AMBER); // hair tie
  // boots (the front one taps when impatient)
  for (const [bx, lift] of [[cx - 15, 0], [cx + 3, p.tap ? 3 : 0]] as const) {
    roundedBox(g, bx, GROUND - 7 - lift, 13, 8, 3, [BOOT, BOOT, C0], LINE);
    fillRect(g, bx + 2, GROUND - 5 - lift, 5, 1, C1);
  }
  // long cloak with a leaf-cut hem, then tunic
  roundedBox(g, cx - 22, 60 + dy, 44, 28 - dy, 7, cloak, LINE);
  for (let i = 0; i < 6; i++) {
    const tipH = i % 2 ? 6 : 3;
    fillRect(g, cx - 21 + i * 7, 83 + (i % 2 ? 0 : 1), 5, tipH, LINE);
    fillRect(g, cx - 20 + i * 7, 83 + (i % 2 ? 0 : 1), 3, tipH - 2, C1);
  }
  fillRect(g, cx - 22, 78, 44, 2, W1);
  roundedBox(g, cx - 18, 38 + dy, 36, 34, 9, cloak, LINE);
  // hood collar
  roundedBox(g, cx - 16, 36 + dy, 32, 9, 4, [C1, C2, C3], LINE);
  fillRect(g, cx - 12, 40 + dy, 24, 1, C3);
  // toggle buttons
  for (let i = 0; i < 3; i++) { const by = 48 + dy + i * 5; fillRect(g, cx - 1, by, 3, 3, W1); g.set(cx - 1, by, W2); }
  // belt with an hourglass buckle
  fillRect(g, cx - 18, 66 + dy, 36, 3, W0); fillRect(g, cx - 18, 66 + dy, 36, 1, W1);
  roundedBox(g, cx - 6, 63 + dy, 12, 9, 2, wood, LINE);
  const hx = cx - 4, hy = 65 + dy;
  fillRect(g, hx, hy, 8, 1, LINE); fillRect(g, hx, hy + 4, 8, 1, LINE);
  for (let k = 0; k < 4; k++) { g.set(hx + k, hy + k, LINE); g.set(hx + 7 - k, hy + k, LINE); }
  fillRect(g, hx + 3, hy + 1, 2, 1, AMBER); fillRect(g, hx + 2, hy + 3, 4, 1, AMBER);

  // left arm (viewer's left): fist on hip, impatient
  roundedBox(g, cx - 28, 44 + dy, 11, 24, 5, cloak, LINE);
  fillRect(g, cx - 28, 58 + dy, 11, 3, W1);
  roundedBox(g, cx - 27, 66 + dy, 10, 9, 4, skin, LINE);

  // head
  roundedBox(g, cx - 13, 18 + dy, 26, 24, 9, skin, LINE);
  // fringe swept to one side
  roundedBox(g, cx - 15, 12 + dy, 30, 12, 6, hair, LINE);
  for (let i = 0; i < 6; i++) fillRect(g, cx - 12 + i * 5, 22 + dy, 3, 2 + ((i * 2) % 3), H1);
  // leaf hair-clip
  roundedBox(g, cx - 16, 14 + dy, 8, 6, 3, [LEAF0, LEAF1, LEAF1], LINE);
  fillRect(g, cx - 14, 16 + dy, 4, 1, LEAF0);
  // eyes: narrowed and sharp
  const ey = 29 + dy, e = p.eyes ?? "open";
  for (const ex of [cx - 9, cx + 4]) {
    if (e === "closed") fillRect(g, ex, ey + 1, 5, 1, LINE);
    else if (e === "x") for (let k = 0; k < 4; k++) { g.set(ex + k, ey - 1 + k, LINE); g.set(ex + 3 - k, ey - 1 + k, LINE); }
    else {
      const h = e === "wide" ? 6 : 4;
      fillRect(g, ex, ey - 1 + (6 - h) / 2 | 0, 5, h, WHITE); fillRect(g, ex + 1, ey + ((6 - h) / 2 | 0), 3, h - 1, EYE); g.set(ex + 1, ey + ((6 - h) / 2 | 0), WHITE);
    }
  }
  if (e !== "closed" && e !== "x") { // stern brows slanting inward
    for (let k = 0; k < 5; k++) { g.set(cx - 10 + k, ey - 3 + (k >> 1), H0); g.set(cx + 9 - k, ey - 3 + (k >> 1), H0); }
  }
  fillRect(g, cx - 1, ey + 3, 3, 2, S2); // nose
  fillRect(g, cx - 3, ey + 8, 6, 1, e === "wide" ? LINE : S2); // tight, flat mouth
  g.set(cx - 4, ey + 8, S2); g.set(cx + 3, ey + 8, S2);

  // right arm holding the window staff
  const sx0 = 69 + (p.arm ?? 0), raise = p.staffRaise ?? 0, tilt = p.staffTop ?? 0;
  roundedBox(g, cx + 17, 44 + dy, 12, 22, 5, cloak, LINE);
  fillRect(g, cx + 17, 56 + dy, 12, 3, W1);
  const top = 24 - raise, bot = GROUND + 1;
  for (let y = top; y <= bot; y++) {
    const x = sx0 + Math.round((tilt * (bot - y)) / (bot - top));
    fillRect(g, x, y, 3, 1, W1); g.set(x, y, W2); g.set(x + 2, y, W0);
  }
  // window head: wooden frame, four glass panes, one of them bright (the sliding window)
  const tx = sx0 + tilt - 14;
  roundedBox(g, tx, top - 16, 31, 16, 3, wood, LINE);
  const lit = p.pane ?? -1;
  for (let i = 0; i < 4; i++) {
    const on = i === lit || i === lit + 1 && lit >= 0 && lit < 3; // the window spans two panes
    const dark = p.glow === false;
    fillRect(g, tx + 2 + i * 7, top - 13, 6, 10, on ? GLASS2 : dark ? C0 : GLASS0);
    fillRect(g, tx + 2 + i * 7, top - 13, 6, 3, on ? GLASS2 : dark ? C0 : GLASS1);
    if (on) { g.set(tx + 3 + i * 7, top - 12, WHITE); g.set(tx + 3 + i * 7, top - 11, WHITE); }
  }
  roundedBox(g, sx0 - 3, 58 + dy, 9, 9, 3, skin, LINE);

  // leaf gust toward the player (transparent pixels only)
  if (p.gust) {
    const spread = p.gust === 2 ? 0.55 : 0.32, hx2 = tx, hy2 = top - 8;
    for (let x = hx2 - 4; x >= 0; x--) {
      const run = hx2 - x, half = Math.round(run * spread * 0.5) + 2, cy = hy2 + Math.round(run * 0.4);
      for (let y = cy - half; y <= cy + half; y++) {
        const core = Math.abs(y - cy) < half / 2;
        const leaf = (x * 3 + y * 5) % 7 === 0 || (x * 3 + y * 5) % 7 === 1;
        if (!g.get(x, y) && (core ? (x + y) % 3 !== 0 : leaf)) g.set(x, y, core ? ((x + y) % 2 ? LEAF1 : LEAF0) : GLASS2);
      }
    }
  }
  if (p.sink) for (let y = GROUND + 1 - p.sink; y < SIZE; y++) for (let x = 0; x < SIZE; x++) g.set(x, y, 0);
  return p.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildPaneWarden(): SpriteSheet {
  const P = (p: PaneWardenPose) => drawPaneWarden(p);
  const idle = [
    frame(P({ pane: 0 })), frame(P({ dy: 1, pane: 1, tap: true, hairSway: 1 })),
    frame(P({ dy: 1, staffRaise: 1, pane: 2 })), frame(P({ eyes: "closed", pane: 1, tap: true, hairSway: -1 })),
  ];
  const attack = [
    frame(P({ lean: 1, arm: 1, staffTop: 2, staffRaise: -2, eyes: "wide", pane: 0 })), // wind-up
    frame(P({ lean: -4, arm: -6, staffTop: -14, staffRaise: 2, gust: 1, eyes: "wide", pane: 1 }), -3, 0), // sweep
    frame(P({ lean: -6, arm: -8, staffTop: -18, staffRaise: 4, gust: 2, eyes: "wide", pane: 2 }), -5, 0), // gale
    frame(P({ lean: -2, arm: -2, staffTop: -6, gust: 1, pane: 3 }), -1, 0),
  ];
  const hurt = [
    frame(P({ white: true, lean: 2 }), 2, 0),
    frame(P({ eyes: "closed", lean: 3, staffTop: 4, glow: false, hairSway: 2 }), 3, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", glow: k < 1, lean: k, staffTop: 8 + k * 9, staffRaise: -k * 2, dy: k * 2, sink: k * 6, hairSway: k }), k * 2, 0, 1 - k * 0.26),
  );
  return {
    w: SIZE, h: SIZE, palette: PANE_WARDEN_PALETTE,
    anims: { idle, attack, hurt, faint },
    frameMs: { idle: 300, attack: 110, hurt: 120, faint: 220 },
  };
}
