import type { MapDef } from "./map";

/**
 * Window Woods (R3): a pine forest where standing panes of glass frame the Pane Warden's clearing at the
 * north end. A stream cuts the forest in two; the plank bridge is the only crossing. Uses the woods
 * tileset (game/sprites/woodsTiles.ts). Ferns hide wild Structlings. Warps and the gym door arrive with D2e/D2f.
 *
 * Legend: g/h grass, p path, e path edge, T pine, W glass pane, s stump, f fern, r stream, b bridge,
 * m mushroom, o boulder, l leaf pile, F fence.
 */
export const WINDOW_WOODS: MapDef = {
  id: "window-woods",
  name: "Window Woods",
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTWWWWTTWWWWTTTTTT",
    "TTTghWWgpppphWWgghTTTT",
    "TTghghhgppppghghhgTTTT",
    "TghmhgFFFppFFFhghlhgTT",
    "TgfffhgghppehgghhfffgT",
    "TgfffgglhppegslghfffgT",
    "TghgghgghppeghgmhhgglT",
    "TrrrrrrrrbbrrrrrrrrrrT",
    "TrrrrrrrrbbrrrrrrrrrrT",
    "TglhgohgepphgghfffghgT",
    "TgfffhgglppehgghfffgoT",
    "TgfffgmghppegslhfffghT",
    "TghgsgghgppehgghgglhgT",
    "TTTTTTTTTppTTTTTTTTTTT",
  ],
  legend: {
    g: "grass", h: "grass2", p: "path", e: "pathEdge", T: "pine", W: "glassPane", s: "stump", f: "fern",
    r: "stream", b: "bridge", m: "mushroom", o: "boulder", l: "leafPile", F: "fence",
  },
  spawn: { x: 9, y: 12, facing: "up" },
  encounterRate: 0.2,
  encounterPool: "woods-fern",
  solid: ["pine", "glassPane", "stump", "stream", "boulder", "fence"],
};
