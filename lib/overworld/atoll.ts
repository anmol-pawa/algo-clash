import type { MapDef } from "./map";

/**
 * Array Atoll (R2): a sand island with a boardwalk pier leading north to Tidecaller Mira's gym platform.
 * Uses the atoll tileset (game/sprites/atollTiles.ts). Wiring into the world (warp from Mainville,
 * encounters on seagrass, NPCs) comes with D1f.
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
    "DwssSsscsSbbsSsSsdsswD",
    "DwsSPssSsSbbSsSsPsSswD",
    "DwssSsoSsSbbsSsSsSssrD",
    "DhwsSsSssSbbSsSsScSswD",
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
  doors: [{ x: 10, y: 1, href: "/gym/atoll/", label: "Entering the Tidecaller Gym…", tag: "GYM" }],
  solid: ["deepWater", "palm", "rock", "coral", "boardwalkPost", "driftwood"],
};
