import { Frame, Grid, SpriteSheet, drawDigit, ellipse, fillRect, roundedBox, silhouette } from "./grid";
import { ARRAYLING_PALETTE } from "./arrayling";

// Vectorling: the evolved Arrayling. Taller body, a crest of amber spikes, and a dashed
// "reserved capacity" slot at the tail that reads as size() < capacity().
// It reuses the Arrayling palette so the evolution morph keeps the same colour family.
const LINE = 1, G0 = 2, G1 = 3, G2 = 4, G3 = 5, G4 = 6;
const A0 = 7, A1 = 8, A2 = 9, A3 = 10;
const EYE = 11, PUPIL = 12, PINK = 13, WHITE = 14, MOUTH = 15;

export const VECTORLING_PALETTE = ARRAYLING_PALETTE;

const SIZE = 64;
const CELLS = [
  { x: 1, w: 17, h: 28 },
  { x: 20, w: 10, h: 21 },
  { x: 32, w: 10, h: 19 },
  { x: 44, w: 9, h: 17 },
];
const GHOST = { x: 55, w: 8, h: 15 };
const GROUND = 57;

export interface VPose {
  view: "front" | "back";
  dx?: number[];
  dy?: number[];
  squash?: number;
  eyes?: "open" | "closed" | "x" | "wide";
  mouth?: "smile" | "open" | "frown";
  white?: boolean;
  /** 0..1: how far the capacity slot has grown into a real cell (attack flourish) */
  grow?: number;
}

export function drawVectorling(pose: VPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const mirror = pose.view === "back";
  const mx = (x: number, w = 1) => (mirror ? SIZE - x - w : x);
  const squash = pose.squash ?? 0;
  const ramp = [G0, G1, G2, G3, G4];
  const amber = [A0, A1, A2, A3];

  // capacity slot: dashed outline, drawn first so cells overlap it
  {
    const gx = mx(GHOST.x, GHOST.w), top = GROUND - GHOST.h + (pose.dy?.[3] ?? 0);
    const grow = pose.grow ?? 0;
    if (grow > 0.5) {
      roundedBox(g, gx, top, GHOST.w, GHOST.h, 3, ramp, LINE);
    } else {
      for (let i = 0; i < GHOST.w; i += 2) { g.set(gx + i, top, G3); g.set(gx + i, top + GHOST.h - 1, G3); }
      for (let j = 0; j < GHOST.h; j += 2) { g.set(gx, top + j, G3); g.set(gx + GHOST.w - 1, top + j, G3); }
      fillRect(g, gx + 3, top + 6, 2, 1, A2); fillRect(g, gx + 3, top + 8, 2, 1, A2); // "..." marks free capacity
    }
  }

  for (let i = CELLS.length - 1; i >= 0; i--) {
    const c = CELLS[i];
    const dx = pose.dx?.[i] ?? 0, dy = pose.dy?.[i] ?? 0;
    const h = c.h - squash;
    const x = mx(c.x + dx, c.w), top = GROUND - h + dy;
    for (const fx of [2, c.w - 6]) {
      ellipse(g, x + fx + 2, GROUND + 1 + dy, 3, 2, LINE);
      ellipse(g, x + fx + 2, GROUND + dy, 2, 1, G1);
    }
    roundedBox(g, x, top, c.w, h, 4, ramp, LINE);
    // two amber bands: stronger, armoured look than the Arrayling's single band
    for (const off of [6, 11]) {
      if (h < off + 4) continue;
      const by = top + h - off;
      for (let yy = 0; yy < 2; yy++) for (let xx = 2; xx < c.w - 2; xx++)
        g.set(x + xx, by + yy, amber[yy === 0 ? 2 : 1]);
    }
    if (i > 0) {
      const tx = x + Math.floor((c.w - 9) / 2);
      const ty = top - 11;
      roundedBox(g, tx, ty, 9, 9, 2, amber, LINE);
      drawDigit(g, String(i), tx + 3, ty + 2, A0);
    }
  }

  // head
  const head = CELLS[0];
  const hdx = pose.dx?.[0] ?? 0, hdy = pose.dy?.[0] ?? 0;
  const hh = head.h - squash;
  const hx = head.x + hdx, htop = GROUND - hh + hdy;
  const bx = mx(hx, head.w);
  // crest: three amber spikes of different height
  for (const [ax, sp] of [[3, 6], [8, 9], [13, 6]] as const) {
    for (let k = 0; k < sp; k++) {
      const w = Math.max(1, 3 - Math.floor(k / 3));
      fillRect(g, bx + ax + (3 - w) / 2 | 0, htop - 1 - k, w, 1, k > sp - 3 ? A3 : k > sp / 2 ? A2 : A1);
    }
    g.set(bx + ax + 1, htop - sp - 1, LINE);
  }
  // brow gem
  ellipse(g, bx + 8, htop + 4, 1, 1, A3);
  g.set(bx + 8, htop + 3, WHITE);
  if (!mirror) {
    const ey = htop + 8;
    const eyeAt = (ex: number) => {
      const e = pose.eyes ?? "open";
      if (e === "closed") { fillRect(g, hx + ex, ey + 3, 5, 1, LINE); return; }
      if (e === "x") {
        for (let k = 0; k < 4; k++) { g.set(hx + ex + k, ey + k, LINE); g.set(hx + ex + 3 - k, ey + k, LINE); }
        return;
      }
      const hgt = e === "wide" ? 7 : 5; // narrower eyes: a calmer, sharper look
      fillRect(g, hx + ex, ey, 5, hgt, EYE);
      fillRect(g, hx + ex + 1, ey + 1, 3, hgt - 1, PUPIL);
      g.set(hx + ex + 1, ey + 1, EYE);
      fillRect(g, hx + ex, ey - 1, 5, 1, LINE); // brow line
    };
    eyeAt(3); eyeAt(10);
    fillRect(g, hx + 1, ey + 8, 2, 2, PINK); fillRect(g, hx + 14, ey + 8, 2, 2, PINK);
    const my = ey + 10;
    const m = pose.mouth ?? "smile";
    if (m === "open") { fillRect(g, hx + 6, my, 5, 3, MOUTH); fillRect(g, hx + 7, my + 2, 3, 1, PINK); }
    else if (m === "frown") { fillRect(g, hx + 6, my + 1, 5, 1, LINE); g.set(hx + 5, my + 2, LINE); g.set(hx + 11, my + 2, LINE); }
    else { fillRect(g, hx + 6, my, 5, 1, LINE); g.set(hx + 5, my - 1, LINE); g.set(hx + 11, my - 1, LINE); }
  } else {
    for (let k = 0; k < 4; k++) fillRect(g, bx + 4, htop + 6 + k * 4, 9, 1, G1);
  }
  return pose.white ? silhouette(g, WHITE) : g;
}

const wave = (t: number, amp: number) =>
  CELLS.map((_, i) => Math.round(Math.sin(t - i * 0.9) * amp * (i === 0 ? 0.6 : 1)));
const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });

export function buildVectorling(view: "front" | "back"): SpriteSheet {
  const P = (p: Partial<VPose>) => drawVectorling({ view, ...p });
  const dir = view === "front" ? 1 : -1;
  const idle = [0, 1.6, 3.2, 4.7].map((t) => frame(P({ dy: wave(t, 1.4) })));
  idle[3] = frame(P({ dy: wave(4.7, 1.4), eyes: "closed" }));
  const attack = [
    frame(P({ squash: 3, dx: [-3, -3, -3, -3].map((v) => v * dir), mouth: "open" })),
    frame(P({ dx: [3, 2, 1, 0].map((v) => v * dir), mouth: "open", eyes: "wide", grow: 1 }), 0, -2),
    frame(P({ eyes: "wide", grow: 1 }), 0, -1),
  ];
  const hurt = [
    frame(P({ white: true }), -1 * dir, 0),
    frame(P({ eyes: "closed", mouth: "frown", dx: [-1, -1, 0, 0].map((v) => v * dir) }), -1 * dir, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", mouth: "frown", squash: k * 3, dy: [k * 2, k * 2, k * 2, k * 2] }), 0, k * 2, 1 - k * 0.28),
  );
  const evolve = [0, 1, 2, 3].map((k) => frame(P({ white: true, squash: k % 2 ? 0 : 2 }), 0, k % 2 ? -1 : 0, 1));
  return {
    w: SIZE, h: SIZE, palette: VECTORLING_PALETTE,
    anims: { idle, attack, hurt, faint, evolve },
    frameMs: { idle: 280, attack: 120, hurt: 110, faint: 180, evolve: 220 },
  };
}
