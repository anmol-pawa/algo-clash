import type { MapDef } from "./map";

/**
 * Chainlink Caves (R5): a violet cavern strung with an iron chain. The link path is a singly linked list laid
 * on the floor: it starts at the gate lane (west), runs east along the south, climbs to a bridge over the
 * underground pool, then reaches the Matriarch's gate in the north wall (the head). Glowing node pads on the
 * path are the nodes; wild Structlings stir on them. The bridge is a shortcut link across the pool. The west
 * end of the south run (x=0, y=10) is the lane back to Stackspire. Uses the chain tileset
 * (game/sprites/chainTiles.ts). The gym door, warp, NPCs and encounter pool are wired in D5f.
 *
 * Legend: f/F floor, p link path, n node pad, w wall, v void, s stalagmite, c crystal, h hanging chains,
 * l lantern, o pool, b bridge, r anchor ring, u boulder, a stairs, D gate.
 */
export const CHAINLINK_CAVES: MapDef = {
  id: "chainlink-caves",
  name: "Chainlink Caves",
  rows: [
    "vvvvvvvvvvvvvvvvvvvvvvvv",
    "whwwlwwwwwrwDwrwwwwlwwhw",
    "wfFfffFfsfFpppfFfffFfcFw",
    "wfsfcfFfFfFpnpFfFfsfFfuw",
    "wFfFfoooFfFpppFfoooFfFfw",
    "wfFpppppppppppFfFfcfFfFw",
    "wfFpFfFfooooboooofFfsfFw",
    "wFfpfFsfooooboooofFfFfcw",
    "wfFpFfFfooooboooofFfulfw",
    "wfFnFfFfFfFfpfFfFfFfFfFw",
    "pfFpppppnpppppppnppppFfw",
    "wfFfsfFfFfFfFfhFfFfFpFfw",
    "wFfuFfFfFfcFfFfFfFfFpFfw",
    "wwwwwwwwwwwwwwwwwwwwwwww",
  ],
  legend: {
    f: "floor", F: "floor2", p: "linkpath", n: "nodepad", w: "wall", v: "void", s: "stalag", c: "crystal",
    h: "chains", l: "lantern", o: "pool", b: "bridge", r: "ring", u: "boulder", a: "stairs", D: "door",
  },
  spawn: { x: 20, y: 12, facing: "up" },
  warps: [{ x: 0, y: 10, to: "stackspire", tx: 20, ty: 11, facing: "left" }],
  doors: [{ x: 12, y: 1, href: "/gym/chain/", label: "Entering the Matriarch's lair…", tag: "GYM" }],
  solid: ["wall", "void", "stalag", "crystal", "chains", "lantern", "pool", "ring", "boulder"],
};
