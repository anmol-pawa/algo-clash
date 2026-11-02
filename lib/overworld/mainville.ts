import type { MapDef } from "./map";

/** Mainville: the first town (B2 sample map; the lab interior and routes follow). */
export const MAINVILLE: MapDef = {
  id: "mainville",
  name: "Mainville",
  rows: [
    "TTTTTTTTTTTTTTTT",
    "Tg.g.RRRR.g.f.gT",
    "T.g.f.hWDW..g.gT",
    "T..g...pppp....T",
    "Tg.RRRR.pp.g.f.T",
    "T..hWDWpp..g...T",
    "Tf..g..pp.bb..gT",
    "T.g....ppEEg...T",
    "TwwwTT.ppEEg.f.T",
    "TwwwwT.pp..g.sgT",
    "TTwwTTTppTTFFFFT",
  ],
  legend: {
    T: "tree", g: "grass", ".": "grass2", f: "flowers", p: "path", w: "water", b: "bush", s: "sign",
    R: "roofHouse", h: "wallHouse", W: "windowHouse", D: "doorHouse", E: "tallGrass", F: "fence",
  },
  spawn: { x: 8, y: 3, facing: "down" },
  npcs: [
    { id: "iota", x: 9, y: 3, facing: "left", sprite: "iota", dialogue: "iota-intro" },
    { id: "villager", x: 12, y: 6, facing: "down", sprite: "villager", dialogue: "villager-grass" },
  ],
  signs: [{ x: 13, y: 9, dialogue: "sign-welcome" }],
  warps: [{ x: 7, y: 10, to: "route-1", tx: 7, ty: 1, facing: "down" }, { x: 8, y: 10, to: "route-1", tx: 8, ty: 1, facing: "down" }],
  encounterRate: 0.25,
  encounterPool: "mainville-grass",
};
