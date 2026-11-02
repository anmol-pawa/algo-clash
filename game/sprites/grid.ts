// Pure pixel-grid toolkit: palette-index grids, no DOM/Pixi dependency.
export class Grid {
  readonly d: Uint8Array;
  constructor(readonly w: number, readonly h: number) {
    this.d = new Uint8Array(w * h);
  }
  get(x: number, y: number): number {
    return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.d[y * this.w + x];
  }
  set(x: number, y: number, c: number): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.d[y * this.w + x] = c;
  }
}

export interface Frame {
  grid: Grid;
  /** pixel offset applied when drawing */
  ox: number;
  oy: number;
  alpha: number;
}

export interface SpriteSheet {
  w: number;
  h: number;
  /** palette index -> CSS hex colour; index 0 is transparent */
  palette: string[];
  anims: Record<string, Frame[]>;
  /** per-animation frame duration in ms */
  frameMs: Record<string, number>;
}

const BAYER = [0, 0.5, 0.75, 0.25];

/** Ramp index (0..ramp.length-1) from a light value t in 0..1 with 2x2 dither. */
export function shade(t: number, x: number, y: number, bands: number): number {
  const v = t + (BAYER[(y & 1) * 2 + (x & 1)] - 0.5) * 0.14;
  return Math.max(0, Math.min(bands - 1, Math.floor(v * bands)));
}

/** Rounded rectangle with 1px outline (colour `line`) and shaded fill from `ramp` (dark->light). */
export function roundedBox(
  g: Grid, x0: number, y0: number, w: number, h: number, r: number,
  ramp: number[], line: number,
): void {
  const inside = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    const cx = x < r ? r - 0.5 : x >= w - r ? w - r - 0.5 : x;
    const cy = y < r ? r - 0.5 : y >= h - r ? h - r - 0.5 : y;
    if (cx === x && cy === y) return true;
    const dx = x - cx, dy = y - cy;
    return dx * dx + dy * dy <= (r - 0.2) * (r - 0.2);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!inside(x, y)) continue;
      const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
      if (edge) { g.set(x0 + x, y0 + y, line); continue; }
      const t = 0.55 - ((x - w / 2) / w) * 0.55 - ((y - h / 2) / h) * 0.9;
      g.set(x0 + x, y0 + y, ramp[shade(t, x, y, ramp.length)]);
    }
  }
}

export function fillRect(g: Grid, x: number, y: number, w: number, h: number, c: number): void {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g.set(x + i, y + j, c);
}

export function ellipse(g: Grid, cx: number, cy: number, rx: number, ry: number, c: number): void {
  for (let y = -ry; y <= ry; y++)
    for (let x = -rx; x <= rx; x++)
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) g.set(cx + x, cy + y, c);
}

export const DIGITS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
};

export function drawDigit(g: Grid, ch: string, x: number, y: number, c: number): void {
  const rows = DIGITS[ch];
  if (!rows) return;
  rows.forEach((row, j) => [...row].forEach((v, i) => v === "1" && g.set(x + i, y + j, c)));
}

/** Replace every opaque pixel with colour c (white-flash / evolve silhouette). */
export function silhouette(src: Grid, c: number): Grid {
  const out = new Grid(src.w, src.h);
  for (let i = 0; i < src.d.length; i++) out.d[i] = src.d[i] ? c : 0;
  return out;
}

export function toRGBA(g: Grid, palette: string[]): Uint8ClampedArray {
  const rgb = palette.map((h) => {
    if (!h) return [0, 0, 0];
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  });
  const out = new Uint8ClampedArray(g.w * g.h * 4);
  for (let i = 0; i < g.d.length; i++) {
    const c = g.d[i];
    if (!c) continue;
    out[i * 4] = rgb[c][0]; out[i * 4 + 1] = rgb[c][1]; out[i * 4 + 2] = rgb[c][2]; out[i * 4 + 3] = 255;
  }
  return out;
}
