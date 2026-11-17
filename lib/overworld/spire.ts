import type { MapDef } from "./map";

/**
 * Stackspire (R6): a walled citadel of stacked stone. The Sentinel's tower door sits at the top of a central
 * flagstone avenue lined with rune pads, pillars, statues and crate stacks (LIFO piles). A stair on the south
 * wall climbs from the lower court to the avenue. The west end of the lower court (x=0, y=11) is the lane back
 * to Skyline Hall (x=0, y=11); the rune pads (the lower court is striped with them) wake wild Structlings; the tower door at the top of the avenue opens the Sentinel gym. Uses the spire tileset
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
    "TfFrFrFrFpppFrFrFrFfFT",
    "pfFcfFfFfpppfFfFfFcfFT",
    "TfFrFrFrFpppFrFrFrFfFT",
    "TwwwwwwwwwwwwwwwwwwwwT",
  ],
  legend: {
    f: "floor", F: "floor2", r: "rune", p: "path", w: "wall", s: "slabs", i: "pillar", t: "torch", b: "banner",
    k: "sky", e: "ledge", c: "crates", u: "statue", a: "stairs", T: "tower", D: "door",
  },
  spawn: { x: 10, y: 12, facing: "up" },
  npcs: [
    { id: "mason-orrin", x: 13, y: 7, facing: "left", sprite: "mason", dialogue: "spire-orrin" },
    { id: "archivist-pell", x: 6, y: 4, facing: "right", sprite: "archivist", dialogue: "spire-pell" },
  ],
  warps: [{ x: 0, y: 11, to: "hashwood-harbor", tx: 20, ty: 7, facing: "left" }],
  encounterRate: 0.2,
  encounterPool: "spire-rune",
  doors: [{ x: 10, y: 2, href: "/gym/spire/", label: "Climbing to the Sentinel's gate…", tag: "GYM" }],
  solid: ["wall", "slabs", "pillar", "torch", "sky", "ledge", "crates", "statue", "tower"],
};
