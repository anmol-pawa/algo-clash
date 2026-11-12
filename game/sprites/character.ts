import { Frame, Grid, SpriteSheet, ellipse, fillRect, mirrorH, outline, shadedBox } from "./grid";

// Palette slots shared by every character.
const LINE = 1, SKIN = 2, SKIN_S = 3, HAIR = 4, HAIR_S = 5, TOP = 6, TOP_S = 7, TOP2 = 8, TOP2_S = 9,
  PANTS = 10, PANTS_S = 11, SHOE = 12, WHITE = 13, EYE = 14, ACC = 15, BLUSH = 16, MOUTH = 17;

export interface CharacterLook {
  name: string;
  /** palette colours for slots 2..17 in order SKIN..MOUTH */
  colors: string[];
  /** long open coat over the body (lab coat) */
  coat?: boolean;
  glasses?: boolean;
  /** spiky tuft on top vs smooth hair */
  tuft?: boolean;
}

export const TRAINER: CharacterLook = {
  name: "trainer",
  // SKIN, SKIN_S, HAIR, HAIR_S, TOP, TOP_S, TOP2, TOP2_S, PANTS, PANTS_S, SHOE, WHITE, EYE, ACC, BLUSH, MOUTH
  colors: ["#f2c49b", "#d79c72", "#3a2a3f", "#251a2b", "#d8503c", "#9c3428", "#f2e6c9", "#cdbd96",
    "#3c4a8a", "#2a3470", "#3a2a2a", "#ffffff", "#141018", "#f0c040", "#f0a090", "#7a2c2c"],
  tuft: true,
};

export const IOTA: CharacterLook = {
  name: "iota",
  colors: ["#e8b88f", "#c48f68", "#d9dde6", "#a5adc0", "#f4f6fb", "#b7c2d6", "#2f9a8f", "#1f7068",
    "#5a5f78", "#3e4258", "#5a3a2a", "#ffffff", "#141018", "#8a6420", "#e8a090", "#7a2c2c"],
  coat: true,
  glasses: true,
};

export const VILLAGER: CharacterLook = {
  name: "villager",
  colors: ["#f0c8a0", "#d4a07a", "#7a4a2a", "#55321c", "#6aa84f", "#487a36", "#f2e6c9", "#cdbd96",
    "#8a6a4a", "#664a30", "#3a2a2a", "#ffffff", "#141018", "#f0c040", "#f0a090", "#7a2c2c"],
};

export const DIVER: CharacterLook = {
  name: "diver",
  colors: ["#e8b48a", "#c48a62", "#2a2f4a", "#1a1e34", "#2fa6a0", "#1e7570", "#f2e6c9", "#cdbd96",
    "#1e5a78", "#143f58", "#2a2a3a", "#ffffff", "#141018", "#f0c040", "#f0a090", "#7a2c2c"],
  tuft: true,
};

export const ANGLER: CharacterLook = {
  name: "angler",
  colors: ["#d9a67c", "#b88258", "#c8c2b4", "#9a9486", "#e8c04a", "#b8922a", "#f2e6c9", "#cdbd96",
    "#6a5a3a", "#4a3e28", "#3a2a2a", "#ffffff", "#141018", "#d8503c", "#e8a090", "#7a2c2c"],
};

export const RANGER: CharacterLook = {
  name: "ranger",
  colors: ["#e8b48a", "#c48a62", "#b8502a", "#8a3a1c", "#3c7a4a", "#2a5a36", "#f2e6c9", "#cdbd96",
    "#5a4a32", "#3e3220", "#3a2a2a", "#ffffff", "#141018", "#f0c040", "#f0a090", "#7a2c2c"],
  tuft: true,
};

export const HIKER: CharacterLook = {
  name: "hiker",
  colors: ["#d9a67c", "#b88258", "#6a4a2a", "#4a321a", "#b8923a", "#8a6a22", "#f2e6c9", "#cdbd96",
    "#4a5a7a", "#33405a", "#3a2a2a", "#ffffff", "#141018", "#d8503c", "#e8a090", "#7a2c2c"],
};

export const DOCKHAND: CharacterLook = {
  name: "dockhand",
  colors: ["#e0b088", "#bc8860", "#3a4a6a", "#26324a", "#d8c050", "#a8902c", "#f2e6c9", "#cdbd96",
    "#6a4a2a", "#4a321a", "#3a2a2a", "#ffffff", "#141018", "#d8503c", "#e8a090", "#7a2c2c"],
};

export const CLERK: CharacterLook = {
  name: "clerk",
  colors: ["#f0c8a0", "#c89a72", "#7a3a5a", "#522640", "#3a8a8a", "#286464", "#f2e6c9", "#cdbd96",
    "#3a3a52", "#26263a", "#3a2a2a", "#ffffff", "#141018", "#f0c040", "#f0a090", "#7a2c2c"],
  tuft: true,
};

export function lookPalette(l: CharacterLook): string[] {
  // index 0 transparent, 1 outline, 2..17 from look
  return ["", "#1a1420", ...l.colors];
}

type Dir = "down" | "up" | "left";

/** One 16x24 overworld pose. step: 0 stand, 1 left foot, 2 stand, 3 right foot. */
export function drawCharacter(look: CharacterLook, dir: Dir, step: number): Grid {
  const g = new Grid(16, 24);
  const b = step === 1 || step === 3 ? 1 : 0; // body bob
  const liftL = step === 1 ? 1 : 0, liftR = step === 3 ? 1 : 0;
  const coatEnd = look.coat ? 19 : 17;
  const legTop = look.coat ? 20 : 18;

  if (dir === "left") {
    // legs
    const legs = (x: number, lift: number, shade: boolean) => {
      shadedBox(g, x, legTop, 3, 22 - legTop + 1 - lift, shade ? PANTS_S : PANTS, PANTS_S);
      fillRect(g, x - 1, 22 - lift, 4, 1, SHOE);
    };
    if (step === 0 || step === 2) {
      shadedBox(g, 6, legTop, 4, 3, PANTS, PANTS_S);
      fillRect(g, 5, 22, 5, 1, SHOE);
    } else {
      legs(step === 1 ? 5 : 8, 0, false);
      legs(step === 1 ? 8 : 5, 1, true);
    }
    // body
    shadedBox(g, 5, 11 + b, 6, coatEnd - 11 + 1 - b, TOP, TOP_S);
    if (look.coat) fillRect(g, 5, 11 + b, 1, coatEnd - 10 - b, TOP2); // shirt peeks at the front
    // arm (swings)
    const sw = step === 1 ? -1 : step === 3 ? 1 : 0;
    shadedBox(g, 7 + sw, 12 + b, 2, 5, look.coat ? TOP_S : TOP2, look.coat ? TOP_S : TOP2_S);
    fillRect(g, 7 + sw, 17 + b, 2, 1, SKIN);
    // head
    shadedBox(g, 4, 2 + b, 8, 9, SKIN, SKIN_S);
    fillRect(g, 8, 2 + b, 4, 9, HAIR);
    fillRect(g, 4, 2 + b, 8, 3, HAIR);
    fillRect(g, 4, 4 + b, 1, 1, HAIR_S);
    fillRect(g, 8, 10 + b, 4, 1, HAIR_S);
    fillRect(g, 5, 6 + b, 1, 2, EYE);
    if (look.glasses) {
      fillRect(g, 4, 5 + b, 3, 1, ACC);
      fillRect(g, 6, 6 + b, 1, 2, ACC);
    }
    fillRect(g, 5, 9 + b, 1, 1, MOUTH);
    if (look.tuft) fillRect(g, 6, 1 + b, 3, 1, HAIR);
  } else {
    // legs (front and back identical silhouette)
    const leg = (x: number, lift: number) => {
      shadedBox(g, x, legTop, 3, 22 - legTop - lift, PANTS, PANTS_S);
      fillRect(g, x - (x < 8 ? 1 : 0), 22 - lift, x < 8 ? 4 : 4, 1, SHOE);
    };
    leg(5, liftL);
    leg(8, liftR);
    // body
    shadedBox(g, 4, 11 + b, 8, coatEnd - 11 + 1 - b, TOP, TOP_S);
    if (look.coat) {
      fillRect(g, 3, coatEnd - 2, 10, 3, TOP); // coat flares at the hem
      fillRect(g, 3, coatEnd, 10, 1, TOP_S);
      if (dir === "down") fillRect(g, 7, 11 + b, 2, coatEnd - 10 - b, TOP2);
      else fillRect(g, 7, 12 + b, 2, coatEnd - 12 - b, TOP_S);
    } else if (dir === "down") {
      fillRect(g, 6, 11 + b, 4, 2, TOP2); // shirt collar
    } else {
      fillRect(g, 5, 14 + b, 6, 1, TOP_S);
    }
    // arms swing opposite to the legs
    const aL = step === 3 ? -1 : 0, aR = step === 1 ? -1 : 0;
    shadedBox(g, 2, 12 + b + aL, 2, 5, look.coat ? TOP : TOP2, look.coat ? TOP_S : TOP2_S);
    shadedBox(g, 12, 12 + b + aR, 2, 5, look.coat ? TOP : TOP2, look.coat ? TOP_S : TOP2_S);
    fillRect(g, 2, 17 + b + aL, 2, 1, SKIN);
    fillRect(g, 12, 17 + b + aR, 2, 1, SKIN);
    // head
    if (dir === "down") {
      shadedBox(g, 4, 2 + b, 8, 9, SKIN, SKIN_S);
      fillRect(g, 4, 2 + b, 8, 3, HAIR);
      fillRect(g, 4, 4 + b, 1, 2, HAIR);
      fillRect(g, 11, 4 + b, 1, 2, HAIR);
      fillRect(g, 5, 4 + b, 6, 1, HAIR_S);
      fillRect(g, 6, 6 + b, 1, 2, EYE);
      fillRect(g, 9, 6 + b, 1, 2, EYE);
      fillRect(g, 5, 8 + b, 1, 1, BLUSH);
      fillRect(g, 10, 8 + b, 1, 1, BLUSH);
      fillRect(g, 7, 9 + b, 2, 1, MOUTH);
      if (look.glasses) {
        fillRect(g, 5, 5 + b, 3, 1, ACC); fillRect(g, 8, 5 + b, 3, 1, ACC);
        fillRect(g, 5, 6 + b, 1, 2, ACC); fillRect(g, 7, 6 + b, 1, 2, ACC);
        fillRect(g, 8, 6 + b, 1, 2, ACC); fillRect(g, 10, 6 + b, 1, 2, ACC);
        fillRect(g, 6, 6 + b, 1, 2, EYE); fillRect(g, 9, 6 + b, 1, 2, EYE);
      }
    } else {
      shadedBox(g, 4, 2 + b, 8, 9, HAIR, HAIR_S);
      fillRect(g, 5, 10 + b, 6, 1, SKIN_S); // nape
      fillRect(g, 6, 5 + b, 4, 1, HAIR_S);
    }
    if (look.tuft) fillRect(g, 6, 1 + b, 4, 1, HAIR);
  }
  outline(g, LINE);
  return g;
}

const DIRS: Dir[] = ["down", "up", "left"];

export function buildCharacter(look: CharacterLook): SpriteSheet {
  const anims: Record<string, Frame[]> = {};
  const frameMs: Record<string, number> = {};
  const wrap = (grid: Grid): Frame => ({ grid, ox: 0, oy: 0, alpha: 1 });
  for (const d of DIRS) {
    anims[`walk-${d}`] = [0, 1, 2, 3].map((s) => wrap(drawCharacter(look, d, s)));
    anims[`idle-${d}`] = [wrap(drawCharacter(look, d, 0))];
    frameMs[`walk-${d}`] = 140;
    frameMs[`idle-${d}`] = 400;
  }
  anims["walk-right"] = anims["walk-left"].map((f) => wrap(mirrorH(f.grid)));
  anims["idle-right"] = [wrap(mirrorH(anims["idle-left"][0].grid))];
  frameMs["walk-right"] = 140;
  frameMs["idle-right"] = 400;
  return { w: 16, h: 24, palette: lookPalette(look), anims, frameMs };
}

// ---------- Portraits (48x48 bust, for dialogue boxes) ----------

export function drawPortrait(look: CharacterLook, blink: boolean, mouthOpen: boolean): Grid {
  const g = new Grid(48, 48);
  // shoulders / coat
  for (let y = 34; y < 48; y++)
    for (let x = 5; x < 43; x++) {
      const k = (y - 34) * 0.9;
      if (x >= 5 + Math.max(0, 6 - k) && x < 43 - Math.max(0, 6 - k)) g.set(x, y, x > 33 ? TOP_S : TOP);
    }
  // shirt V
  for (let y = 34; y < 48; y++) {
    const half = Math.max(0, 7 - (y - 34) * 0.5);
    fillRect(g, Math.round(24 - half), y, Math.round(half * 2), 1, TOP2);
  }
  if (look.coat) { fillRect(g, 11, 38, 3, 10, TOP_S); fillRect(g, 34, 38, 3, 10, TOP_S); }
  // neck
  fillRect(g, 20, 29, 8, 7, SKIN_S);
  // hair mass behind the head
  ellipse(g, 24, 17, 14, 14, HAIR);
  // head
  ellipse(g, 24, 22, 12, 13, SKIN);
  for (let y = 10; y < 36; y++) for (let x = 30; x < 38; x++)
    if (g.get(x, y) === SKIN && ((x - 24) * (x - 24)) / 144 + ((y - 22) * (y - 22)) / 169 > 0.62) g.set(x, y, SKIN_S);
  // ears
  fillRect(g, 11, 21, 2, 4, SKIN); fillRect(g, 35, 21, 2, 4, SKIN_S);
  // fringe
  for (let x = 12; x < 37; x++) {
    const hl = 12 + (((x * 5) % 7) < 3 ? 2 : ((x * 5) % 7) < 5 ? 1 : 0) + (x < 16 || x > 32 ? 4 : 0);
    for (let y = 8; y < hl; y++) if (g.get(x, y)) g.set(x, y, y > hl - 3 ? HAIR_S : HAIR);
  }
  if (look.tuft) {
    for (const [tx, h] of [[16, 5], [20, 8], [24, 10], [28, 8], [32, 5]]) fillRect(g, tx, 8 - h + 3, 3, h, HAIR);
  }
  // eyes
  for (const ex of [17, 28]) {
    if (blink) fillRect(g, ex, 23, 4, 1, EYE);
    else {
      fillRect(g, ex, 20, 4, 5, EYE);
      fillRect(g, ex + 2, 21, 1, 1, WHITE);
    }
    fillRect(g, ex - 1, 17, 6, 1, HAIR_S); // brow
  }
  if (look.glasses) {
    for (const ex of [14, 25]) {
      fillRect(g, ex, 18, 9, 1, ACC); fillRect(g, ex, 26, 9, 1, ACC);
      fillRect(g, ex, 18, 1, 9, ACC); fillRect(g, ex + 8, 18, 1, 9, ACC);
    }
    fillRect(g, 23, 21, 2, 1, ACC);
  }
  fillRect(g, 22, 25, 2, 2, SKIN_S); // nose
  fillRect(g, 15, 27, 3, 2, BLUSH); fillRect(g, 31, 27, 3, 2, BLUSH);
  if (mouthOpen) { fillRect(g, 21, 30, 6, 3, MOUTH); fillRect(g, 22, 32, 4, 1, BLUSH); }
  else fillRect(g, 21, 31, 6, 1, MOUTH);
  outline(g, LINE);
  return g;
}

export function buildPortrait(look: CharacterLook): SpriteSheet {
  const wrap = (grid: Grid): Frame => ({ grid, ox: 0, oy: 0, alpha: 1 });
  const open = wrap(drawPortrait(look, false, false));
  return {
    w: 48, h: 48, palette: lookPalette(look),
    anims: {
      idle: [open, open, open, open, wrap(drawPortrait(look, true, false))],
      talk: [open, wrap(drawPortrait(look, false, true))],
    },
    frameMs: { idle: 600, talk: 140 },
  };
}
