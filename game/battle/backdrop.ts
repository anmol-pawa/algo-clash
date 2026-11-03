// Procedural pixel backdrop for the Mainville meadow battle scene (logical 240x135).
export const LW = 240;
export const LH = 135;

export const PLATFORMS = {
  foe: { cx: 170, cy: 62, rx: 42, ry: 8 },
  player: { cx: 62, cy: 112, rx: 54, ry: 10 },
};

const rect = (c: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) => {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
};

/** Draw sky, clouds, hills, meadow and both platforms. Cheap enough to redraw each frame. */
export function drawBackdrop(c: CanvasRenderingContext2D, time: number): void {
  const bands = ["#9fd8f0", "#a9ddf2", "#b5e2f4", "#c3e8f6", "#d3eef8"];
  bands.forEach((b, i) => rect(c, b, 0, i * 12, LW, 12));
  // clouds drift slowly
  const drift = (time / 220) % (LW + 60);
  for (const [k, y] of [[0, 14], [110, 30], [200, 8]] as const) {
    const x = ((k + drift) % (LW + 60)) - 30;
    rect(c, "#ffffff", x, y, 26, 6);
    rect(c, "#ffffff", x + 5, y - 3, 14, 4);
    rect(c, "#dff3fb", x, y + 5, 26, 2);
  }
  // distant hills (two layers)
  c.fillStyle = "#7cc08a";
  for (let x = 0; x < LW; x++) c.fillRect(x, 58 + Math.round(Math.sin(x / 19) * 5), 1, 30);
  c.fillStyle = "#5fa86f";
  for (let x = 0; x < LW; x++) c.fillRect(x, 70 + Math.round(Math.sin(x / 11 + 1.5) * 4), 1, 30);
  // meadow with stripes
  rect(c, "#6cc060", 0, 82, LW, LH - 82);
  for (let y = 82; y < LH; y += 6) rect(c, y % 12 === 4 ? "#62b556" : "#74c868", 0, y, LW, 3);
  // flowers and grass tufts (static, deterministic)
  for (let i = 0; i < 26; i++) {
    const x = (i * 53) % LW, y = 86 + ((i * 29) % 46);
    rect(c, i % 3 === 0 ? "#fff3a8" : i % 3 === 1 ? "#f6a6c8" : "#4e9a48", x, y, 2, 2);
  }
  // platforms
  for (const p of [PLATFORMS.foe, PLATFORMS.player]) {
    ellipseFill(c, "#3d7a3c", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#8fd36f", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#a6e083", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}

function ellipseFill(c: CanvasRenderingContext2D, color: string, cx: number, cy: number, rx: number, ry: number) {
  c.fillStyle = color;
  for (let y = -ry; y <= ry; y++) {
    const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
    c.fillRect(cx - w, cy + y, w * 2, 1);
  }
}
