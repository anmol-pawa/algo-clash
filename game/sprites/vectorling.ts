import { Frame, Grid, SpriteSheet, drawDigit, ellipse, fillRect, roundedBox, silhouette } from "./grid";

// Vectorling: the Arrayling's second stage. It grew a spare "capacity" cell (a dashed ghost slot,
// the `capacity() > size()` of a std::vector), a golden crest, and a deeper teal body.
const LINE = 1, T0 = 2, T1 = 3, T2 = 4, T3 = 5, T4 = 6; // teal ramp (dark -> light)
const A0 = 7, A1 = 8, A2 = 9, A3 = 10; // gold ramp
const EYE = 11, PUPIL = 12, PINK = 13, WHITE = 14, MOUTH = 15;

export const VECTORLING_PALETTE = [
  "", "#10232b", "#1f4f5e", "#2b7a86", "#3fa7a3", "#6cd0b4", "#b4f0c8",
  "#7a4a12", "#c98a1f", "#f2b53a", "#ffe07a", "#fbfff2", "#101820", "#f08a8a", "#ffffff", "#5a1d2a",
];

const SIZE = 64;
const CELLS = [
  { x: 1, w: 18, h: 25 },
  { x: 20, w: 11, h: 19 },
  { x: 32, w: 10, h: 17 },
  { x: 43, w: 9, h: 15 },
  { x: 53, w: 9, h: 13 }, // the ghost capacity slot
];
const GHOST = CELLS.length - 1;
const GROUND = 57;

export interface VPose {
  view: "front" | "back";
  dx?: number[];
  dy?: number[];
  squash?: number;
  eyes?: "open" | "closed" | "x" | "wide";
  mouth?: "smile" | "open" | "frown";
  white?: boolean;
}

export function drawVectorling(pose: VPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const mirror = pose.view === "back";
  const mx = (x: number, w = 1) => (mirror ? SIZE - x - w : x);
  const squash = pose.squash ?? 0;
  const ramp = [T0, T1, T2, T3, T4];
  const gold = [A0, A1, A2, A3];

  for (let i = CELLS.length - 1; i >= 0; i--) {
    const c = CELLS[i];
    const dx = pose.dx?.[i] ?? 0, dy = pose.dy?.[i] ?? 0;
    const h = c.h - squash;
    const x = mx(c.x + dx, c.w), top = GROUND - h + dy;
    if (i === GHOST) {
      // dashed outline only: reserved capacity, no body yet
      for (let k = 0; k < c.w; k += 2) { g.set(x + k, top, T3); g.set(x + k, top + h - 1, T3); }
      for (let k = 0; k < h; k += 2) { g.set(x, top + k, T3); g.set(x + c.w - 1, top + k, T3); }
      for (let k = 2; k < c.w - 2; k += 3) g.set(x + k, top + h - 4, T1);
      const tx = x + 1, ty = top - 10;
      roundedBox(g, tx, ty, 7, 8, 2, gold, LINE);
      g.set(tx + 3, ty + 3, A0); g.set(tx + 3, ty + 4, A0); g.set(tx + 3, ty + 5, A0); // "n"-ish capacity tick
      continue;
    }
    for (const fx of [2, c.w - 6]) {
      ellipse(g, x + fx + 2, GROUND + 1 + dy, 3, 2, LINE);
      ellipse(g, x + fx + 2, GROUND + dy, 2, 1, T1);
    }
    roundedBox(g, x, top, c.w, h, 5, ramp, LINE);
    const by = top + h - 6;
    for (let yy = 0; yy < 3; yy++) for (let xx = 2; xx < c.w - 2; xx++)
      g.set(x + xx, by + yy, gold[yy === 0 ? 2 : yy === 1 ? 1 : 0]);
    const tx = x + Math.floor((c.w - 9) / 2) + (i === 0 && !mirror ? 4 : 0);
    const ty = top - 11;
    roundedBox(g, tx, ty, 9, 9, 2, gold, LINE);
    drawDigit(g, String(i), tx + 3, ty + 2, A0);
  }

  const head = CELLS[0];
  const hdx = pose.dx?.[0] ?? 0, hdy = pose.dy?.[0] ?? 0;
  const hh = head.h - squash;
  const hx = head.x + hdx, htop = GROUND - hh + hdy;
  const hxm = mx(hx, head.w);
  // golden three-spike crest
  for (const [ax, len] of [[4, 4], [8, 6], [12, 4]] as const) {
    const cx = mirror ? hxm + head.w - 1 - ax : hx + ax;
    fillRect(g, cx, htop - len, 2, len, LINE);
    fillRect(g, cx, htop - len + 1, 1, len - 1, A2);
    g.set(cx, htop - len, A3);
  }
  if (!mirror) {
    const ey = htop + 8;
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
      g.set(hx + ex + 3, ey, A3); // sharper brow glint
    };
    eyeAt(4); eyeAt(11);
    fillRect(g, hx + 2, ey + 8, 2, 2, PINK); fillRect(g, hx + 14, ey + 8, 2, 2, PINK);
    const my = ey + 10;
    const m = pose.mouth ?? "smile";
    if (m === "open") { fillRect(g, hx + 6, my, 6, 3, MOUTH); fillRect(g, hx + 8, my + 2, 2, 1, PINK); }
    else if (m === "frown") { fillRect(g, hx + 7, my + 1, 4, 1, LINE); g.set(hx + 6, my + 2, LINE); g.set(hx + 11, my + 2, LINE); }
    else { fillRect(g, hx + 6, my, 6, 1, LINE); g.set(hx + 5, my - 1, LINE); g.set(hx + 12, my - 1, LINE); }
  } else {
    for (let k = 0; k < 4; k++) fillRect(g, hxm + 4, htop + 4 + k * 4, 10, 1, T1);
  }
  return pose.white ? silhouette(g, WHITE) : g;
}

const wave = (t: number, amp: number) =>
  CELLS.map((_, i) => Math.round(Math.sin(t - i * 0.8) * amp * (i === 0 ? 0.6 : 1)));
const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildVectorling(view: "front" | "back"): SpriteSheet {
  const P = (p: Partial<VPose>) => drawVectorling({ view, ...p });
  const dir = view === "front" ? 1 : -1;
  const idle = [0, 1.6, 3.2, 4.7].map((t) => frame(P({ dy: wave(t, 1.4) })));
  idle[3] = frame(P({ dy: wave(4.7, 1.4), eyes: "closed" }));
  const attack = [
    frame(P({ squash: 3, dx: [-2, -2, -2, -2, -2].map((v) => v * dir), mouth: "open" })),
    frame(P({ dx: [3, 2, 1, 0, 0].map((v) => v * dir), mouth: "open", eyes: "wide" }), 0, -2),
    frame(P({ eyes: "wide" }), 0, -1),
  ];
  const hurt = [
    frame(P({ white: true }), -1 * dir, 0),
    frame(P({ eyes: "closed", mouth: "frown", dx: [-1, -1, 0, 0, 0].map((v) => v * dir) }), -1 * dir, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", mouth: "frown", squash: k * 3 }), 0, k * 2, 1 - k * 0.28),
  );
  const evolve = [0, 1, 2, 3].map((k) => frame(P({ white: true, squash: k % 2 ? 0 : 2 }), 0, k % 2 ? -1 : 0, 1));
  return {
    w: SIZE, h: SIZE, palette: VECTORLING_PALETTE,
    anims: { idle, attack, hurt, faint, evolve },
    frameMs: { idle: 280, attack: 120, hurt: 110, faint: 180, evolve: 220 },
  };
}
