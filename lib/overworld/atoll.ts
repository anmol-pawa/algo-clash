import type { MapDef } from "./map";

/**
 * Array Atoll (CUR R2): a ring of sandbars around a lagoon, with the Tide Hall (gym) at the north.
 * Not yet reachable from the world: warps from Route 1 and the gym screen come with D1f.
 */
export const ATOLL: MapDef = {
  id: "array-atoll",
  name: "Array Atoll",
  rows: [
    "DDDDDDDDDDDDDDDD",
    "DWWWCWWWWWWCWWWD",
    "DWssesRRRRsessWD",
    "DWseshBNOBssTsWD",
    "DWsessssbssQssWD",
    "DWshssssbsssmsWD",
    "DWsmsQssbssssh" + "WD",
    "DWssgsssbssessWD",
    "DWsKssssbssssTWD",
    "DWKKssesbsmssTWD",
    "DWWWsssSbSsssWWD",
    "DDWWWSSSbSSWWWDD",
  ],
  legend: {
    D: "deepWater", W: "water", s: "sand", e: "sand2", h: "shells", m: "dune", S: "shore", b: "boardwalk",
    R: "hutRoof", B: "hutWall", N: "hutWindow", O: "hutDoor", T: "palm", K: "rock", C: "coral", Q: "tidePool", g: "sign",
  },
  spawn: { x: 8, y: 9, facing: "up" },
  signs: [{ x: 4, y: 7, dialogue: "sign-atoll" }],
  doors: [{ x: 8, y: 3, href: "/gym/", label: "Entering the Tide Hall…", tag: "GYM" }],
  encounterRate: 0.2,
  encounterPool: "array-atoll-pools",
};
