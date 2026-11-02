import { Frame, Grid, SpriteSheet, drawDigit, ellipse, fillRect, roundedBox, silhouette } from "./grid";

// Palette indices
const LINE = 1, G0 = 2, G1 = 3, G2 = 4, G3 = 5, G4 = 6; // green ramp (dark -> light)
const A0 = 7, A1 = 8, A2 = 9, A3 = 10; // amber ramp
const EYE = 11, PUPIL = 12, PINK = 13, WHITE = 14, MOUTH = 15;

export const ARRAYLING_PALETTE = [
  "", "#16231f", "#2a5a43", "#3c8a55", "#58b45d", "#8ad66b", "#c3f08a",
  "#8a4b1c", "#c9791f", "#f0a93a", "#ffd56b", "#fbfff2", "#101820", "#f08a8a", "#ffffff", "#5a1d2a",
];

const SIZE = 64;
const CELLS = [
  { x: 2, w: 18, h: 24 },
  { x: 22, w: 12, h: 18 },
  { x: 36, w: 12, h: 16 },
  { x: 50, w: 12, h: 14 },
];
const GROUND = 57;

export interface Pose {
  view: "front" | "back";
  dx?: number[]; // per-cell x offset
  dy?: number[]; // per-cell y offset
  squash?: number; // cells shorter by this many px (bottom fixed)
  eyes?: "open" | "closed" | "x" | "wide";
  mouth?: "smile" | "open" | "frown";
  white?: boolean;
}

export function drawArrayling(pose: Pose): Grid {
  const g = new Grid(SIZE, SIZE);
  const mirror = pose.view === "back";
  const mx = (x: number, w = 1) => (mirror ? SIZE - x - w : x);
  const squash = pose.squash ?? 0;
  const ramp = [G0, G1, G2, G3, G4];
  const amber = [A0, A1, A2, A3];

  for (let i = CELLS.length - 1; i >= 0; i--) {
    const c = CELLS[i];
    const dx = pose.dx?.[i] ?? 0, dy = pose.dy?.[i] ?? 0;
    const h = c.h - squash;
    const x = mx(c.x + dx, c.w), top = GROUND - h + dy;
    // feet
    for (const fx of [3, c.w - 7]) {
      ellipse(g, x + fx + 2, GROUND + 1 + dy, 3, 2, LINE);
      ellipse(g, x + fx + 2, GROUND + dy, 2, 1, G1);
    }
    roundedBox(g, x, top, c.w, h, 5, ramp, LINE);
    // belly band (amber) so segments read as slots
    const by = top + h - 6;
    for (let yy = 0; yy < 3; yy++) for (let xx = 2; xx < c.w - 2; xx++)
      g.set(x + xx, by + yy, amber[yy === 0 ? 2 : yy === 1 ? 1 : 0]);
    // index tag floating above the cell
    const tx = x + Math.floor((c.w - 9) / 2) + (i === 0 && !mirror ? 4 : 0);
    const ty = top - 11;
    roundedBox(g, tx, ty, 9, 9, 2, amber, LINE);
    drawDigit(g, String(i), tx + 3, ty + 2, A0);
  }

  // head details
  const head = CELLS[0];
  const hdx = pose.dx?.[0] ?? 0, hdy = pose.dy?.[0] ?? 0;
  const hh = head.h - squash;
  const hx = head.x + hdx, htop = GROUND - hh + hdy;
  if (!mirror) {
    // antennae
    for (const ax of [3, 6]) {
      fillRect(g, hx + ax, htop - 5, 1, 5, LINE);
      ellipse(g, hx + ax, htop - 6, 1, 1, A2);
    }
    const ey = htop + 7;
    const eyeAt = (ex: number) => {
      const e = pose.eyes ?? "open";
      if (e === "closed") { fillRect(g, hx + ex, ey + 3, 5, 1, LINE); return; }
      if (e === "x") {
        for (let k = 0; k < 4; k++) { g.set(hx + ex + k, ey + k, LINE); g.set(hx + ex + 3 - k, ey + k, LINE); }
        return;
      }
      const hgt = e === "wide" ? 7 : 6;
      fillRect(g, hx + ex, ey, 5, hgt, EYE);
      fillRect(g, hx + ex + 1, ey + 2, 3, hgt - 2, PUPIL);
      g.set(hx + ex + 1, ey + 2, EYE);
    };
    eyeAt(4); eyeAt(11);
    fillRect(g, hx + 2, ey + 8, 2, 2, PINK); fillRect(g, hx + 14, ey + 8, 2, 2, PINK);
    const my = ey + 10;
    const m = pose.mouth ?? "smile";
    if (m === "open") { fillRect(g, hx + 7, my, 4, 3, MOUTH); fillRect(g, hx + 8, my + 2, 2, 1, PINK); }
    else if (m === "frown") { fillRect(g, hx + 7, my + 1, 4, 1, LINE); g.set(hx + 6, my + 2, LINE); g.set(hx + 11, my + 2, LINE); }
    else { fillRect(g, hx + 7, my, 4, 1, LINE); g.set(hx + 6, my - 1, LINE); g.set(hx + 11, my - 1, LINE); }
  } else {
    // back of head: leaf-like crest ridges and antennae stubs
    const bx = mx(hx, head.w);
    for (const ax of [2, 15]) {
      fillRect(g, bx + ax, htop - 5, 1, 5, LINE);
      ellipse(g, bx + ax, htop - 6, 1, 1, A2);
    }
    for (let k = 0; k < 3; k++) fillRect(g, bx + 4, htop + 4 + k * 4, 10, 1, G1);
  }
  return pose.white ? silhouette(g, WHITE) : g;
}

const wave = (_n: number, t: number, amp: number) =>
  CELLS.map((_, i) => Math.round(Math.sin(t - i * 0.9) * amp * (i === 0 ? 0.6 : 1)));

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildArrayling(view: "front" | "back"): SpriteSheet {
  const P = (p: Partial<Pose>) => drawArrayling({ view, ...p });
  const dir = view === "front" ? 1 : -1; // direction of the lunge toward the opponent
  const idle = [0, 1.6, 3.2, 4.7].map((t) => frame(P({ dy: wave(0, t, 1.4) })));
  idle[3] = frame(P({ dy: wave(0, 4.7, 1.4), eyes: "closed" }));
  const attack = [
    frame(P({ squash: 3, dx: [-2, -2, -2, -2].map((v) => v * dir), mouth: "open" })),
    frame(P({ dx: [2, 1, 0, 0].map((v) => v * dir), mouth: "open", eyes: "wide" }), 0, -2),
    frame(P({ eyes: "wide" }), 0, -1),
  ];
  const hurt = [
    frame(P({ white: true }), -1 * dir, 0),
    frame(P({ eyes: "closed", mouth: "frown", dx: [-1, -1, 0, 0].map((v) => v * dir) }), -1 * dir, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", mouth: "frown", squash: k * 3, dy: [k * 2, k * 2, k * 2, k * 2].map((v) => v) }), 0, k * 2, 1 - k * 0.28),
  );
  const evolve = [0, 1, 2, 3].map((k) =>
    frame(P({ white: true, squash: k % 2 ? 0 : 2 }), 0, k % 2 ? -1 : 0, 1),
  );
  return {
    w: SIZE, h: SIZE, palette: ARRAYLING_PALETTE,
    anims: { idle, attack, hurt, faint, evolve },
    frameMs: { idle: 280, attack: 120, hurt: 110, faint: 180, evolve: 220 },
  };
}
