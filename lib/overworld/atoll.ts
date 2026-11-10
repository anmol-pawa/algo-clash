import type { MapDef } from "./map";

/**
 * Array Atoll (R2): a sand island with a boardwalk pier leading north to Tidecaller Mira's gym platform.
 * Uses the atoll tileset (game/sprites/atollTiles.ts). Reached from the south end of Route 1; wild
 * Structlings rustle in the seagrass patches.
 */
export const ARRAY_ATOLL: MapDef = {
  id: "array-atoll",
  name: "Array Atoll",
  rows: [
    "DDDDDDDDDDDDDDDDDDDDDD",
    "DDDDDDDDDBbbBDDDDDDDDD",
    "DDDDDDDDDBbbBDDDDDDDDD",
    "DDDDhhhhhhbbhhhhhhhDDD",
    "DDhhhhwwwwbbwwwwwhhhDD",
    "DhhwwwsSsSbbsSsSswwhhD",
    "DhwsPsSgsSbbSsStsSPwhD",
    "DwggSsscsSbbsSsSsdsswD",
    "DwggPssSsSbbSsSsPsSswD",
    "DwssSsoSsSbbsSgggSssrD",
    "DhwsSsSssSbbSsSggcSswD",
    "DhwwsSrsSsbbsSsdsSswhD",
    "DhhwwwsSsSsSsSsSswwhhD",
    "DDhhhwwwwwwwwwwwwwhhDD",
    "DDDDDDDDDDDDDDDDDDDDDD",
  ],
  legend: {
    D: "deepWater", h: "shallows", w: "wetSand", s: "sand", S: "sand2", P: "palm", b: "boardwalk",
    B: "boardwalkPost", c: "shell", r: "rock", o: "coral", t: "tidePool", g: "seagrass", d: "driftwood",
  },
  spawn: { x: 10, y: 12, facing: "up" },
  npcs: [
    { id: "diver-pell", x: 9, y: 8, facing: "right", sprite: "diver", dialogue: "atoll-pell" },
    { id: "angler-ru", x: 13, y: 7, facing: "left", sprite: "angler", dialogue: "atoll-ru" },
  ],
  warps: [
    { x: 10, y: 13, to: "route-1", tx: 7, ty: 9, facing: "up" },
    { x: 11, y: 13, to: "route-1", tx: 8, ty: 9, facing: "up" },
  ],
  encounterRate: 0.2,
  encounterPool: "atoll-seagrass",
  doors: [{ x: 10, y: 1, href: "/gym/atoll/", label: "Entering the Tidecaller Gym…", tag: "GYM" }],
  solid: ["deepWater", "palm", "rock", "coral", "boardwalkPost", "driftwood"],
};
