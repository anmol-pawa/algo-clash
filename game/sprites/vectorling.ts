import { Frame, Grid, SpriteSheet, drawDigit, ellipse, fillRect, roundedBox, silhouette } from "./grid";
import { ARRAYLING_PALETTE } from "./arrayling";

// Same palette indices as the Arrayling so the evolution morph can mix both grids.
const LINE = 1, G0 = 2, G1 = 3, G2 = 4, G3 = 5;
const A0 = 7, A1 = 8, A2 = 9, A3 = 10;
const EYE = 11, PUPIL = 12, PINK = 13, WHITE = 14, MOUTH = 15;

export const VECTORLING_PALETTE = ARRAYLING_PALETTE;

const SIZE = 64;
const GROUND = 58;
// Five used cells that grow toward the tail, then a dashed "spare capacity" slot (size() < capacity()).
const CELLS = [
  { x: 1, w: 18, h: 27 },
  { x: 20, w: 9, h: 17 },
  { x: 30, w: 9, h: 15 },
  { x: 40, w: 9, h: 13 },
  { x: 50, w: 9, h: 11 },
];

export interface VPose {
  view: "front" | "back";
  dy?: number[];
  squash?: number;
  eyes?: "open" | "closed" | "x" | "wide";
  mouth?: "smile" | "open" | "frown";
  white?: boolean;
  /** how many cells are filled (the spare slot shows a dashed outline) */
  lunge?: number;
}

export function drawVectorling(pose: VPose): Grid {
  const g = new Grid(SIZE, SIZE);
  const mirror = pose.view === "back";
  const mx = (x: number, w = 1) => (mirror ? SIZE - x - w : x);
  const squash = pose.squash ?? 0;
  const lunge = (pose.lunge ?? 0) * (mirror ? -1 : 1);
  const ramp = [G0, G1, G2, G3, 6];
  const amber = [A0, A1, A2, A3];

  // spare capacity slot: dashed outline + faint fill, dropped behind the tail
  const sx = mx(60, 3);
  for (let y = GROUND - 8; y <= GROUND; y += 2) { g.set(sx, y, LINE); g.set(sx + 2, y, LINE); }
  fillRect(g, sx + 1, GROUND - 8, 1, 1, LINE);

  for (let i = CELLS.length - 1; i >= 0; i--) {
    const c = CELLS[i];
    const dy = pose.dy?.[i] ?? 0;
    const h = c.h - squash;
    const x = mx(c.x + lunge * (i === 0 ? 1 : 0), c.w), top = GROUND - h + dy;
    ellipse(g, x + 3, GROUND + 1 + dy, 2, 1, LINE);
    ellipse(g, x + c.w - 4, GROUND + 1 + dy, 2, 1, LINE);
    roundedBox(g, x, top, c.w, h, 4, ramp, LINE);
    const by = top + h - 5;
    for (let yy = 0; yy < 3; yy++) for (let xx = 2; xx < c.w - 2; xx++)
      g.set(x + xx, by + yy, amber[yy === 0 ? 2 : yy === 1 ? 1 : 0]);
    // index tag
    const tw = 7;
    const tx = x + Math.floor((c.w - tw) / 2) + (i === 0 && !mirror ? 3 : 0);
    const ty = top - 10;
    if (i > 0) { // the head carries the crest instead of an index tag
      roundedBox(g, tx, ty, 7, 9, 2, amber, LINE);
      drawDigit(g, String(i), tx + 2, ty + 2, A0);
    }
  }

  // head details: a brass crest (the "reserve" pointer) and calmer eyes
  const head = CELLS[0];
  const hh = head.h - squash;
  const hx = head.x + lunge, htop = GROUND - hh + (pose.dy?.[0] ?? 0);
  const bx = mx(hx, head.w);
  // crest: three amber spikes of growing height
  [[4, 6], [8, 9], [12, 6]].forEach(([cx, ch]) => {
    fillRect(g, bx + cx, htop - ch, 3, ch, A1);
    fillRect(g, bx + cx, htop - ch, 3, 1, A3);
    fillRect(g, bx + cx + 2, htop - ch + 1, 1, ch - 1, A0);
    fillRect(g, bx + cx - 1, htop - ch - 1, 5, 1, LINE);
  });
  if (!mirror) {
    const ey = htop + 8;
    const eyeAt = (ex: number) => {
      const e = pose.eyes ?? "open";
      if (e === "closed") { fillRect(g, hx + ex, ey + 3, 5, 1, LINE); return; }
      if (e === "x") {
        for (let k = 0; k < 4; k++) { g.set(hx + ex + k, ey + k, LINE); g.set(hx + ex + 3 - k, ey + k, LINE); }
        return;
      }
      const hgt = e === "wide" ? 7 : 5; // narrower than the Arrayling's: a calmer look
      fillRect(g, hx + ex, ey + (e === "wide" ? 0 : 1), 5, hgt, EYE);
      fillRect(g, hx + ex + 1, ey + 2, 3, hgt - 2, PUPIL);
      g.set(hx + ex + 1, ey + 2, EYE);
    };
    eyeAt(3); eyeAt(11);
    fillRect(g, hx + 1, ey + 8, 2, 2, PINK); fillRect(g, hx + 15, ey + 8, 2, 2, PINK);
    const my = ey + 11, m = pose.mouth ?? "smile";
    if (m === "open") { fillRect(g, hx + 7, my, 4, 3, MOUTH); fillRect(g, hx + 8, my + 2, 2, 1, PINK); }
    else if (m === "frown") { fillRect(g, hx + 7, my + 1, 4, 1, LINE); g.set(hx + 6, my + 2, LINE); g.set(hx + 11, my + 2, LINE); }
    else { fillRect(g, hx + 7, my, 4, 1, LINE); g.set(hx + 6, my - 1, LINE); g.set(hx + 11, my - 1, LINE); }
  } else {
    for (let k = 0; k < 3; k++) fillRect(g, bx + 4, htop + 6 + k * 4, 10, 1, G1);
  }
  return pose.white ? silhouette(g, WHITE) : g;
}

const frame = (grid: Grid, ox = 0, oy = 0, alpha = 1): Frame => ({ grid, ox, oy, alpha });
const wave = (t: number, amp: number) => CELLS.map((_, i) => Math.round(Math.sin(t - i * 0.8) * amp * (i === 0 ? 0.5 : 1)));

export function buildVectorling(view: "front" | "back"): SpriteSheet {
  const P = (p: Partial<VPose>) => drawVectorling({ view, ...p });
  const dir = view === "front" ? 1 : -1;
  const idle = [0, 1.6, 3.2, 4.7].map((t) => frame(P({ dy: wave(t, 1.4) })));
  idle[3] = frame(P({ dy: wave(4.7, 1.4), eyes: "closed" }));
  const attack = [
    frame(P({ squash: 3, lunge: -2, mouth: "open" })),
    frame(P({ lunge: 3, mouth: "open", eyes: "wide" }), 2 * dir, -2),
    frame(P({ lunge: 1, eyes: "wide" }), 0, -1),
  ];
  const hurt = [
    frame(P({ white: true }), -1 * dir, 0),
    frame(P({ eyes: "closed", mouth: "frown", lunge: -1 }), -1 * dir, 1),
  ];
  const faint = [0, 1, 2, 3].map((k) =>
    frame(P({ eyes: "x", mouth: "frown", squash: k * 3, dy: CELLS.map(() => k * 2) }), 0, k * 2, 1 - k * 0.28),
  );
  const evolve = [0, 1, 2, 3].map((k) => frame(P({ white: true, squash: k % 2 ? 0 : 2 }), 0, k % 2 ? -1 : 0));
  return {
    w: SIZE, h: SIZE, palette: VECTORLING_PALETTE,
    anims: { idle, attack, hurt, faint, evolve },
    frameMs: { idle: 280, attack: 120, hurt: 110, faint: 180, evolve: 220 },
  };
}
