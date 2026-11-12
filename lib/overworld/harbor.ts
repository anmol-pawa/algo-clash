import type { MapDef } from "./map";

/**
 * Hashwood Harbor (R4): a working quay where every locker is a hash bucket. The big warehouse along the
 * north wall hides the Hydra's gym behind the centre door. Cobbled lanes run to the docks in the south;
 * crates, barrels and net racks form small lanes to explore. Uses the harbor tileset
 * (game/sprites/harborTiles.ts). The west end of the cobbles (x=0, y=3) is the lane back to Window Woods; wild Structlings swim into the tide line (the shore strip).
 *
 * Legend: s/S sand, c cobble, p planks, d dock edge, w water, h shore, x crate, b barrel, o bollard,
 * l lamp, B boat, W warehouse, L hash-bucket lockers, n net rack, D warehouse door.
 */
export const HASHWOOD_HARBOR: MapDef = {
  id: "hashwood-harbor",
  name: "Hashwood Harbor",
  rows: [
    "WWWWWLLWWWWDWWWWLLWWWW",
    "sSsnsscccccccccsSsxbss",
    "sSxbsscSsSsSscclSssnss",
    "ssSsscccccccccccsSsxxs",
    "sSnnsscSsSsSsSscSsSsss",
    "ssSsscccccccccccsSsbss",
    "sSxssscSsSslSsscsSsSss",
    "ssSssscccccccccccsSsss",
    "hhhhhhhhhhhhhhhhhhhhhh",
    "wwwwwpwwwwwwwwwwwpwwww",
    "dppppppppppdwwwdpppppd",
    "wolppppplpowwBwwoplppw",
    "dppppppppppdwwwdpppppd",
    "wwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwww",
  ],
  legend: {
    s: "sand", S: "sand2", c: "cobble", p: "planks", d: "dockEdge", w: "water", h: "shore", x: "crate", b: "barrel",
    o: "bollard", l: "lamp", B: "boat", W: "warehouse", L: "lockers", n: "netRack", D: "door",
  },
  spawn: { x: 11, y: 7, facing: "up" },
  npcs: [
    { id: "dockhand-marlo", x: 13, y: 5, facing: "left", sprite: "dockhand", dialogue: "harbor-marlo" },
    { id: "clerk-tansy", x: 4, y: 10, facing: "right", sprite: "clerk", dialogue: "harbor-tansy" },
  ],
  warps: [{ x: 0, y: 3, to: "window-woods", tx: 20, ty: 12, facing: "left" }],
  encounterRate: 0.25,
  encounterPool: "harbor-tide",
  doors: [{ x: 11, y: 0, href: "/gym/harbor/", label: "Entering the Hydra's warehouse…", tag: "GYM" }],
  solid: ["water", "crate", "barrel", "bollard", "lamp", "boat", "warehouse", "lockers", "netRack"],
};
