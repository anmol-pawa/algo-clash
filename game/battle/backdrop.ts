// Procedural pixel backdrop for the Mainville meadow battle scene (logical 240x135).
export const LW = 240;
export const LH = 135;

export const PLATFORMS = {
  foe: { cx: 170, cy: 62, rx: 42, ry: 8 },
  player: { cx: 62, cy: 100, rx: 54, ry: 10 },
};

/** Gym layout: the 96px leader needs a lower foe ledge than the 64px wild creatures. */
export const GYM_PLATFORMS = {
  foe: { cx: 172, cy: 98, rx: 44, ry: 8 },
  player: { cx: 62, cy: 124, rx: 54, ry: 9 },
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

/** Syntax Shores gym: dusk over the sea, the Compiler Lighthouse sweeping its beam, rocky ledges. */
export function drawGymBackdrop(c: CanvasRenderingContext2D, time: number): void {
  const sky = ["#2b2f6b", "#3b3f88", "#55509a", "#7c63a6", "#b6789f", "#e8967f", "#f6b98a"];
  sky.forEach((b, i) => rect(c, b, 0, i * 10, LW, 10));
  // stars
  for (let i = 0; i < 24; i++) {
    const x = (i * 37) % LW, y = (i * 17) % 34;
    if ((Math.floor(time / 500) + i) % 5 !== 0) rect(c, "#fff6d8", x, y, 1, 1);
  }
  // sea with two wave layers
  rect(c, "#2a4f8a", 0, 66, LW, LH - 66);
  for (let y = 66; y < LH; y += 4) rect(c, y % 8 === 2 ? "#356199" : "#2e5690", 0, y, LW, 2);
  for (let i = 0; i < 40; i++) {
    const y = 68 + ((i * 11) % 50), x = Math.round(((i * 41 + time / 90 * (1 + (i % 3) * 0.4)) % (LW + 20)) - 10);
    rect(c, "#7fb2e0", x, y, 5, 1);
  }
  // lighthouse tower with striped body, gallery and lamp
  const tx = 28;
  rect(c, "#2c2c44", tx - 2, 62, 24, 6);
  for (let y = 0; y < 44; y++) {
    const inset = Math.floor(y / 11);
    rect(c, Math.floor(y / 7) % 2 ? "#c8392f" : "#f2f5fa", tx + inset, 24 + y, 20 - inset * 2, 1);
    rect(c, "#9aa3b8", tx + 19 - inset * 2 + inset - 3, 24 + y, 3, 1);
  }
  rect(c, "#1b2a58", tx - 2, 21, 24, 3);
  rect(c, "#c88a1e", tx + 2, 12, 16, 9);
  const flick = Math.floor(time / 200) % 2;
  rect(c, flick ? "#fff6bf" : "#ffe98a", tx + 4, 14, 12, 5);
  rect(c, "#7a4f12", tx + 8, 6, 4, 6);
  // sweeping beam from the lamp (rotates through a narrow arc across the sky)
  const sweep = Math.sin(time / 1400);
  c.fillStyle = "rgba(255,240,170,0.22)";
  for (let x = tx + 20; x < LW; x++) {
    const run = x - tx - 20, cy = 16 + run * (0.12 + sweep * 0.1), half = 2 + run * 0.07;
    c.fillRect(x, Math.round(cy - half), 1, Math.round(half * 2));
  }
  // rocky ledges and foreground
  rect(c, "#3a3550", 0, 116, LW, LH - 116);
  for (let x = 0; x < LW; x += 8) rect(c, (x / 8) % 3 === 0 ? "#4a4564" : "#2e2a42", x, 116 + ((x * 7) % 5), 8, 3);
  for (const p of [GYM_PLATFORMS.foe, GYM_PLATFORMS.player]) {
    ellipseFill(c, "#2a2640", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#6f6a8c", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#8a85aa", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}
