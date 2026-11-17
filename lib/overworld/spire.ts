import type { MapDef } from "./map";

/**
 * Stackspire (R6): a walled citadel of stacked stone. The Sentinel's tower door sits at the top of a central
 * flagstone avenue lined with rune pads, pillars, statues and crate stacks (LIFO piles). A stair on the south
 * wall climbs from the lower court to the avenue. The west end of the lower court (x=0, y=11) is the lane back
 * to Skyline Hall (the warp is added in D4f-4); the tower door at the top of the avenue opens the Sentinel gym. Uses the spire tileset
 * (game/sprites/spireTiles.ts).
 *
 * Legend: f/F flagstone, r rune pad, p path, w wall, s slab stack, i pillar, t torch, b banner, k sky,
 * e ledge, c crates, u statue, a stairs, T tower, D tower door.
 */
export const STACKSPIRE: MapDef = {
  id: "stackspire",
  name: "Stackspire",
  rows: [
    "kkkkkkkkkkkkkkkkkkkkkk",
    "eeeeeeeeeeeeeeeeeeeeee",
    "TwwbwwwwwiDiwwwwwwbwwT",
    "TfFftfFffpppftfFfcsfFT",
    "TfFrfFfufpppfFfFufFrfT",
    "TfFfifFfFpppFfFifFfcfT",
    "TfFrfFfFfpppfFfFfFrfFT",
    "TfFfFfFfFpppFfFfFfFfFT",
    "TcfFfFfFfpppfFfFfFfFcT",
    "TwwwwwwwwaaawwwwwwwwwT",
    "TfFfFfFfFpppFfFfFfFfFT",
    "pfFcfFfFfpppfFfFfFcfFT",
    "TfFfFfFfFpppFfFfFfFfFT",
    "TwwwwwwwwwwwwwwwwwwwwT",
  ],
  legend: {
    f: "floor", F: "floor2", r: "rune", p: "path", w: "wall", s: "slabs", i: "pillar", t: "torch", b: "banner",
    k: "sky", e: "ledge", c: "crates", u: "statue", a: "stairs", T: "tower", D: "door",
  },
  spawn: { x: 10, y: 12, facing: "up" },
  doors: [{ x: 10, y: 2, href: "/gym/spire/", label: "Climbing to the Sentinel's gate…", tag: "GYM" }],
  solid: ["wall", "slabs", "pillar", "torch", "sky", "ledge", "crates", "statue", "tower"],
};
