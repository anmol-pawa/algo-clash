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

/**
 * Array Atoll battle scene: bright tropical day, a far islet with palms, sea with drifting foam,
 * a sand beach and a boardwalk. `gym` uses the lower gym ledges (Tidecaller Mira's platform).
 */
export function drawAtollBackdrop(c: CanvasRenderingContext2D, time: number, gym = false): void {
  const sky = ["#6cc3f0", "#82cff3", "#9ad9f5", "#b4e4f7", "#d2f0f9"];
  sky.forEach((b, i) => rect(c, b, 0, i * 12, LW, 12));
  // clouds
  const drift = (time / 260) % (LW + 60);
  for (const [k, y] of [[20, 10], [140, 24]] as const) {
    const x = ((k + drift) % (LW + 60)) - 30;
    rect(c, "#ffffff", x, y, 28, 5);
    rect(c, "#ffffff", x + 6, y - 3, 14, 4);
    rect(c, "#dff3fb", x, y + 4, 28, 2);
  }
  // sea
  rect(c, "#2f8fbf", 0, 52, LW, 40);
  for (let y = 52; y < 92; y += 4) rect(c, y % 8 === 0 ? "#3a9ccb" : "#2a86b5", 0, y, LW, 2);
  rect(c, "#bfeaf6", 0, 52, LW, 1);
  for (let i = 0; i < 36; i++) {
    const y = 55 + ((i * 7) % 34), x = Math.round(((i * 43 + (time / 110) * (1 + (i % 3) * 0.4)) % (LW + 20)) - 10);
    rect(c, "#e9fbff", x, y, 4, 1);
  }
  // far islet with two palms
  for (let x = 0; x < 64; x++) {
    const h = Math.round(Math.sqrt(Math.max(0, 1 - ((x - 32) / 32) ** 2)) * 9);
    rect(c, "#d8bd7c", 150 + x, 52 - h + 4, 1, h);
  }
  for (const px of [172, 188]) {
    rect(c, "#6b4a2a", px, 36, 2, 17);
    const sway = Math.round(Math.sin(time / 600 + px) * 1);
    for (const [dx, dy] of [[-6, 2], [-3, -1], [3, -1], [6, 2], [0, -2]] as const) rect(c, "#2b7a43", px + dx + sway, 36 + dy, 4, 2);
    rect(c, "#3f9a55", px - 1 + sway, 35, 4, 2);
  }
  // beach: wet sand shoreline with foam, then dry sand
  const surf = Math.round(Math.sin(time / 700) * 2);
  rect(c, "#b8955a", 0, 90, LW, 6);
  rect(c, "#ebd6a0", 0, 96, LW, LH - 96);
  for (let x = 0; x < LW; x++) rect(c, "#e9fbff", x, 88 + surf + Math.round(Math.sin(x / 9 + time / 500) * 1), 1, 2);
  for (let i = 0; i < 40; i++) {
    const x = (i * 59) % LW, y = 99 + ((i * 31) % 34);
    rect(c, i % 4 === 0 ? "#f6e8bd" : "#dcc084", x, y, 2, 1);
  }
  rect(c, "#ffc4d0", 20, 108, 3, 2);
  rect(c, "#e88ba0", 21, 109, 2, 1);
  rect(c, "#ffc4d0", 214, 120, 3, 2);
  // boardwalk strip along the horizon of the beach
  rect(c, "#6a4326", 0, 94, LW, 1);
  for (let x = 0; x < LW; x += 12) {
    rect(c, "#8f6238", x, 95, 11, 2);
    rect(c, "#b58650", x, 95, 11, 1);
  }
  const plats = gym ? GYM_PLATFORMS : PLATFORMS;
  for (const p of [plats.foe, plats.player]) {
    ellipseFill(c, "#b8955a", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#dcc084", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#f6e8bd", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}

/**
 * Window Woods battle scene: dappled forest light, layered pine ridges, standing glass panes catching
 * the sun, a stream and a mossy clearing. `gym` uses the lower gym ledges (Pane Warden Sorrel's clearing).
 */
export function drawWoodsBackdrop(c: CanvasRenderingContext2D, time: number, gym = false): void {
  const sky = ["#a9d8c0", "#b9e0c6", "#c9e8cc", "#d9efd2", "#e8f5d8"];
  sky.forEach((b, i) => rect(c, b, 0, i * 12, LW, 12));
  // light shafts sway gently
  for (let i = 0; i < 5; i++) {
    const x = 20 + i * 52 + Math.round(Math.sin(time / 1800 + i) * 4);
    for (let y = 0; y < 60; y += 2) rect(c, "rgba(255,248,196,0.16)", x + (y >> 2), y, 10, 2);
  }
  // far and near pine ridges (triangle stacks)
  const ridge = (color: string, base: number, step: number, h: number, phase: number) => {
    for (let x = -4; x < LW + 8; x += step) {
      const ph = h + ((x * 7 + phase) % 9);
      for (let k = 0; k < ph; k += 2) rect(c, color, x - (k >> 1) , base - ph + k, 2 * (k >> 1) + 3, 2);
      rect(c, color, x, base - 1, 3, 3);
    }
  };
  ridge("#6a9c78", 62, 14, 22, 3);
  ridge("#3f7a52", 70, 12, 28, 1);
  ridge("#245a3a", 78, 10, 24, 5);
  // standing glass panes among the trees: frame + tinted glass + moving glint
  for (const [px, py] of [[34, 40], [196, 36], [112, 44]] as const) {
    rect(c, "#6b4a2c", px - 1, py - 1, 14, 22);
    rect(c, "#7fb6c9", px, py, 12, 20);
    rect(c, "#b7e0ee", px, py, 12, 4);
    rect(c, "#6b4a2c", px + 5, py, 2, 20);
    rect(c, "#6b4a2c", px, py + 9, 12, 2);
    const g = Math.floor(((time / 90 + px) % 40));
    if (g < 14) rect(c, "#f2fdff", px + 1 + (g % 10), py + 1 + (g >> 1), 2, 2);
  }
  // stream band
  rect(c, "#2b6f8e", 0, 84, LW, 7);
  for (let x = 0; x < LW; x += 6) rect(c, "#6cbad3", (x + Math.round(time / 140)) % LW, 85 + ((x >> 1) % 5), 4, 1);
  rect(c, "#e8fbff", 0, 84, LW, 1);
  // clearing
  rect(c, "#3b8346", 0, 91, LW, LH - 91);
  for (let i = 0; i < 70; i++) {
    const x = (i * 61) % LW, y = 93 + ((i * 29) % 40);
    rect(c, i % 5 === 0 ? "#6dba66" : i % 3 === 0 ? "#2f6b3a" : "#4c9d54", x, y, 2, 1);
  }
  for (const [mx, my] of [[14, 112], [226, 100], [150, 126]] as const) {
    rect(c, "#f6ead2", mx + 1, my + 2, 2, 2);
    rect(c, "#c8433a", mx, my, 4, 2);
  }
  const plats = gym ? GYM_PLATFORMS : PLATFORMS;
  for (const p of [plats.foe, plats.player]) {
    ellipseFill(c, "#2f6b3a", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#7d5736", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#a07848", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}

/**
 * Hashwood Harbor battle scene: a dawn sky with gulls, a far shoreline of warehouses, bobbing boats on a
 * glittering bay, and a plank quay with a hash-bucket locker wall. `gym` uses the lower gym ledges (the Hydra).
 */
export function drawHarborBackdrop(c: CanvasRenderingContext2D, time: number, gym = false): void {
  const sky = ["#f6c9a0", "#f8d6b0", "#f9e0c0", "#fbeacf", "#fdf2dd"];
  sky.forEach((b, i) => rect(c, b, 0, i * 12, LW, 12));
  // sun low on the horizon
  ellipseFill(c, "#fff1c0", 190, 58, 16, 9);
  ellipseFill(c, "#ffd98a", 190, 58, 10, 6);
  // gulls
  for (const [gx, gy, ph] of [[40, 16, 0], [88, 26, 2], [150, 12, 4]] as const) {
    const x = Math.round(((gx + time / 60) % (LW + 20)) - 10);
    const up = Math.floor(time / 260 + ph) % 2 === 0;
    rect(c, "#ffffff", x, gy + (up ? 0 : 1), 3, 1);
    rect(c, "#ffffff", x + 3, gy + (up ? 1 : 0), 3, 1);
  }
  // far shoreline: warehouses with roof slopes and a crane
  const roofs: Array<[number, number, number, string]> = [[6, 40, 30, "#8c6a5a"], [44, 46, 26, "#7a5d6a"], [78, 38, 36, "#8c6a5a"], [124, 44, 28, "#6a5a78"], [160, 36, 22, "#8c6a5a"], [206, 42, 30, "#7a5d6a"]];
  for (const [x, y, w, col] of roofs) {
    rect(c, col, x, y + 6, w, 70 - y - 6);
    rect(c, "#52404a", x, y + 6, w, 2);
    for (let i = 0; i < 6; i++) rect(c, col, x + (i >> 0), y + 5 - i, w - 2 * i, 1);
    rect(c, "#f2c477", x + 4, y + 14, 3, 3);
    rect(c, "#f2c477", x + w - 8, y + 14, 3, 3);
  }
  rect(c, "#3c3a4e", 148, 20, 2, 38);
  rect(c, "#3c3a4e", 136, 20, 22, 2);
  rect(c, "#3c3a4e", 136, 22, 1, 8 + Math.round(Math.sin(time / 900) * 2));
  // bay with animated glitter
  rect(c, "#3f8fb0", 0, 70, LW, 22);
  rect(c, "#2f7a9c", 0, 82, LW, 10);
  for (let x = 0; x < LW; x += 5) {
    const s = (x * 7 + Math.floor(time / 180)) % 11;
    if (s < 3) rect(c, "#d6f3fb", (x + (s << 2)) % LW, 72 + ((x * 3) % 17), 3, 1);
  }
  // bobbing sailboats
  for (const [bx, by] of [[30, 76], [118, 80]] as const) {
    const bob = Math.round(Math.sin(time / 600 + bx) * 1);
    rect(c, "#6b4a2c", bx, by + bob + 8, 16, 3);
    rect(c, "#6b4a2c", bx + 2, by + bob + 11, 12, 1);
    rect(c, "#5a3a24", bx + 7, by + bob, 1, 9);
    for (let i = 0; i < 7; i++) rect(c, "#fdf7ec", bx + 8, by + bob + 1 + i, 1 + (i >> 1) + 1, 1);
  }
  rect(c, "#e8fbff", 0, 70, LW, 1);
  // quay: planks with seams, then cobble
  rect(c, "#8a6a44", 0, 92, LW, 12);
  for (let x = 0; x < LW; x += 12) rect(c, "#6b4f30", x, 92, 1, 12);
  rect(c, "#a98458", 0, 92, LW, 2);
  rect(c, "#6b4f30", 0, 103, LW, 1);
  rect(c, "#9a9aa8", 0, 104, LW, LH - 104);
  for (let i = 0; i < 90; i++) {
    const x = (i * 53) % LW, y = 106 + ((i * 31) % 26);
    rect(c, i % 3 === 0 ? "#b4b4c0" : "#80808e", x, y, 3, 1);
  }
  // locker wall at the left edge and crate stack at the right
  for (let i = 0; i < 4; i++) {
    rect(c, "#4a5f7a", 4 + i * 9, 94, 8, 10);
    rect(c, "#6f87a6", 5 + i * 9, 95, 6, 3);
    rect(c, "#e9c46a", 8 + i * 9, 100, 1, 2);
  }
  for (const [cx, cy] of [[214, 92], [224, 92], [219, 83]] as const) {
    rect(c, "#9c6b3a", cx, cy, 10, 10);
    rect(c, "#c58f52", cx, cy, 10, 2);
    rect(c, "#6e4a26", cx + 4, cy, 2, 10);
  }
  const plats = gym ? GYM_PLATFORMS : PLATFORMS;
  for (const p of [plats.foe, plats.player]) {
    ellipseFill(c, "#4a3a28", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#8a6a44", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#b08a5a", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}

/**
 * Stackspire battle scene: a violet dusk over a city of stacked towers, a great slab-stack spire with a
 * swaying red pennant, flickering torches and a flagstone terrace. `gym` uses the lower gym ledges (the Sentinel).
 */
export function drawSpireBackdrop(c: CanvasRenderingContext2D, time: number, gym = false): void {
  const sky = ["#1f2150", "#2c2f5a", "#3f3f78", "#58508f", "#7d6aa0", "#b98ba6", "#f0a98a"];
  sky.forEach((b, i) => rect(c, b, 0, i * 10, LW, 10));
  // twinkling stars in the upper sky
  for (let i = 0; i < 30; i++) {
    const x = (i * 43) % LW, y = (i * 19) % 36;
    if ((Math.floor(time / 600) + i) % 4 !== 0) rect(c, i % 7 === 0 ? "#ffe9a8" : "#e6e4ff", x, y, 1, 1);
  }
  // slow cloud streaks
  const drift = (time / 300) % (LW + 80);
  for (const [k, y] of [[10, 34], [130, 44]] as const) {
    const x = ((k + drift) % (LW + 80)) - 40;
    rect(c, "#8f7db0", x, y, 36, 2);
    rect(c, "#a894c0", x + 6, y - 1, 20, 1);
  }
  // city haze below the sky bands, so no gap shows behind the skyline
  rect(c, "#d9967f", 0, 70, LW, 4);
  rect(c, "#3a3868", 0, 74, LW, 8);
  // far skyline of stacked slab towers (each tower is a narrowing stack of slabs)
  const towers: Array<[number, number, number]> = [[6, 4, 14], [40, 5, 12], [78, 3, 16], [150, 4, 14], [190, 5, 12], [222, 3, 14]];
  for (const [x, slabs, w] of towers) {
    for (let s = 0; s < slabs; s++) {
      const sw = w - s * 2, sy = 78 - (s + 1) * 7;
      rect(c, s % 2 ? "#4a4f86" : "#3f4478", x + s, sy, sw, 7);
      rect(c, "#6b6a92", x + s, sy, sw, 1);
      rect(c, "#2c2f5a", x + s, sy + 6, sw, 1);
    }
    rect(c, "#b23a2a", x + (slabs >> 0), 78 - slabs * 7 - 4, 1, 4);
  }
  // great spire at the centre-left, clear of the foe ledge: five slate slabs, rune sockets, a red pennant
  const sx = 92;
  for (let s = 0; s < 5; s++) {
    const w = 46 - s * 7, y = 80 - (s + 1) * 11, x = sx + (46 - w) / 2;
    rect(c, "#566179", x, y, w, 11);
    rect(c, "#7886a3", x, y, w, 2);
    rect(c, "#3d4658", x, y + 9, w, 2);
    rect(c, "#14171f", x, y + 10, w, 1);
    rect(c, "#b0702c", x, y, 2, 2);
    rect(c, "#b0702c", x + w - 2, y, 2, 2);
    const glow = Math.floor(time / 400 + s) % 3 === 0;
    rect(c, glow ? "#6fe3d0" : "#1f7f86", sx + 22, y + 4, 2, 3);
  }
  rect(c, "#14171f", sx + 22, 8, 2, 17);
  const wave = Math.round(Math.sin(time / 300) * 2);
  for (let i = 0; i < 7; i++) rect(c, i % 3 === 2 ? "#8c2430" : "#c4404a", sx + 24 + i, 9 + (i >> 1) + Math.round((wave * i) / 7), 1, 5 - (i >> 1));
  // terrace: back parapet then flagstone courses
  rect(c, "#3d4658", 0, 82, LW, 4);
  for (let x = 0; x < LW; x += 10) rect(c, "#566179", x + 1, 82, 8, 3);
  rect(c, "#14171f", 0, 86, LW, 1);
  rect(c, "#8f8a84", 0, 87, LW, LH - 87);
  for (let y = 87; y < LH; y += 9) {
    rect(c, "#6e6a66", 0, y, LW, 1);
    for (let x = ((y - 87) / 9) % 2 ? 0 : 14; x < LW; x += 28) rect(c, "#6e6a66", x, y, 1, 9);
  }
  for (let i = 0; i < 60; i++) rect(c, i % 3 ? "#b3ada4" : "#6e6a66", (i * 59) % LW, 89 + ((i * 31) % 44), 2, 1);
  // torches on short posts at both edges
  for (const tx of [6, 230] as const) {
    rect(c, "#4a2f1c", tx, 70, 3, 16);
    rect(c, "#b0702c", tx - 1, 69, 5, 2);
    const f = Math.floor(time / 130 + tx) % 3;
    rect(c, "#e8782e", tx, 64 - f, 3, 5 + f);
    rect(c, "#ffd25a", tx + 1, 66 - f, 1, 3);
  }
  const plats = gym ? GYM_PLATFORMS : PLATFORMS;
  for (const p of [plats.foe, plats.player]) {
    ellipseFill(c, "#3d4658", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#7886a3", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#b3ada4", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
  }
}

/**
 * Chainlink Caves battle scene: a violet cavern with a stalactite ceiling, great iron chains sagging across the
 * back wall (their links are the `next` pointers), swaying hanging chains, pulsing jade crystals and a flagged
 * earth floor. `gym` uses the lower gym ledges (the Chainwyrm Matriarch).
 */
export function drawChainBackdrop(c: CanvasRenderingContext2D, time: number, gym = false): void {
  const wall = ["#14102a", "#1b1636", "#241d44", "#2e2552", "#382d60", "#43376c", "#4e4079"];
  wall.forEach((b, i) => rect(c, b, 0, i * 12, LW, 12));
  // rock strata and speckles on the back wall
  for (let i = 0; i < 46; i++) rect(c, i % 3 ? "#2e2552" : "#4e4079", (i * 53) % LW, 14 + ((i * 29) % 60), 3 + (i % 4), 1);
  // stalactites along the ceiling
  for (let x = 0, i = 0; x < LW; x += 11 + (i % 3) * 3, i++) {
    const h = 6 + ((i * 7) % 12);
    for (let y = 0; y < h; y++) {
      const w = Math.max(1, 6 - Math.floor((y * 6) / h));
      rect(c, y % 4 === 0 ? "#43376c" : "#241d44", x - (w >> 1), y, w, 1);
    }
    rect(c, "#14102a", x, 0, 1, h);
  }
  // two great chains sagging across the wall: iron links alternate face-on (ring) and edge-on (bar)
  for (const [base, sag] of [[44, 14], [60, 10]] as const) {
    for (let x = 0; x < LW; x += 6) {
      const y = base + Math.round(Math.sin((x / LW) * Math.PI) * sag);
      if ((x / 6) % 2 === 0) {
        rect(c, "#6f7585", x, y, 7, 5);
        rect(c, "#14102a", x + 2, y + 1, 3, 3);
        rect(c, "#9aa0b2", x, y, 7, 1);
      } else {
        rect(c, "#555b6c", x, y + 1, 7, 3);
        rect(c, "#8a90a2", x, y + 1, 7, 1);
      }
    }
  }
  // gold link rings catch the light where the chains meet the left wall
  rect(c, "#ffd25a", 0, 44, 2, 5);
  rect(c, "#b0702c", 0, 48, 2, 1);
  // hanging chains that sway a little
  for (const [hx, len] of [[28, 34], [112, 26], [206, 38]] as const) {
    for (let i = 0; i < len; i += 3) {
      const sw = Math.round(Math.sin(time / 500 + hx + i / 9) * (i / 14));
      rect(c, i % 6 ? "#555b6c" : "#8a90a2", hx + sw, i, 2, 3);
    }
  }
  // jade crystals, pulsing, clear of the foe ledge
  const pulse = 0.5 + 0.5 * Math.sin(time / 420);
  for (const [cx, h] of [[16, 12], [70, 9], [96, 14]] as const) {
    const y = 82 - h;
    rect(c, "#1f6f62", cx, y + 2, 5, h - 2);
    rect(c, "#2fb59b", cx + 1, y + 1, 3, h - 2);
    rect(c, "#7ff0d2", cx + 2, y, 1, h - 3);
    rect(c, pulse > 0.5 ? "#b8fff0" : "#5fe0c0", cx + 2, y + 2, 1, 2);
  }
  // cave floor: dark rim, then packed earth with flagstones
  rect(c, "#14102a", 0, 80, LW, 3);
  rect(c, "#4a2f1c", 0, 83, LW, LH - 83);
  rect(c, "#6e4a2c", 0, 83, LW, 2);
  for (let y = 85; y < LH; y += 8) {
    for (let x = ((y - 85) / 8) % 2 ? 0 : 12; x < LW; x += 24) {
      rect(c, "#6e4a2c", x, y, 18, 6);
      rect(c, "#8e6a40", x, y, 18, 1);
      rect(c, "#3a2414", x, y + 5, 18, 1);
    }
  }
  for (let i = 0; i < 50; i++) rect(c, i % 2 ? "#8e6a40" : "#3a2414", (i * 61) % LW, 86 + ((i * 37) % 46), 2, 1);
  // lanterns on iron posts at both edges
  for (const lx of [6, 230] as const) {
    rect(c, "#555b6c", lx, 68, 2, 18);
    rect(c, "#8a90a2", lx - 2, 66, 6, 2);
    const f = Math.floor(time / 140 + lx) % 3;
    rect(c, "#e8782e", lx - 1, 61 - f + 3, 4, 5 + f);
    rect(c, "#ffd25a", lx, 63 - f + 3, 2, 3);
  }
  const plats = gym ? GYM_PLATFORMS : PLATFORMS;
  for (const p of [plats.foe, plats.player]) {
    ellipseFill(c, "#1b1636", p.cx, p.cy + 3, p.rx, p.ry);
    ellipseFill(c, "#555b6c", p.cx, p.cy, p.rx, p.ry);
    ellipseFill(c, "#8a90a2", p.cx, p.cy - 1, p.rx - 6, p.ry - 3);
    ellipseFill(c, pulse > 0.5 ? "#2fb59b" : "#1f6f62", p.cx, p.cy - 1, p.rx - 24, Math.max(1, p.ry - 6));
  }
}
