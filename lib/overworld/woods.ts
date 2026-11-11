import type { MapDef } from "./map";

/**
 * Window Woods (R3): a pine forest where standing panes of glass frame the Pane Warden's clearing at the
 * north end. A stream cuts the forest in two; the plank bridge is the only crossing. Uses the woods
 * tileset (game/sprites/woodsTiles.ts). Ferns hide wild Structlings. The gym door (between the two glass-pane banks) opens the Pane Warden gym. A gap in the west pines leads back to Array Atoll.
 *
 * Legend: g/h grass, p path, e path edge, T pine, W glass pane, s stump, f fern, r stream, b bridge,
 * m mushroom, o boulder, l leaf pile, F fence.
 */
export const WINDOW_WOODS: MapDef = {
  id: "window-woods",
  name: "Window Woods",
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTWWWWppWWWWTTTTTT",
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
    "ggfffgmghppegslhfffghT",
    "TghgsgghgppehgghgglhgT",
    "TTTTTTTTTppTTTTTTTTTTT",
  ],
  legend: {
    g: "grass", h: "grass2", p: "path", e: "pathEdge", T: "pine", W: "glassPane", s: "stump", f: "fern",
    r: "stream", b: "bridge", m: "mushroom", o: "boulder", l: "leafPile", F: "fence",
  },
  spawn: { x: 9, y: 12, facing: "up" },
  npcs: [
    { id: "ranger-juniper", x: 8, y: 11, facing: "right", sprite: "ranger", dialogue: "woods-juniper" },
    { id: "hiker-bram", x: 12, y: 6, facing: "left", sprite: "hiker", dialogue: "woods-bram" },
  ],
  warps: [{ x: 0, y: 12, to: "array-atoll", tx: 20, ty: 8, facing: "left" }],
  encounterRate: 0.2,
  encounterPool: "woods-fern",
  doors: [{ x: 10, y: 1, href: "/gym/woods/", label: "Entering the Pane Warden's clearing…", tag: "GYM" }],
  solid: ["pine", "glassPane", "stump", "stream", "boulder", "fence"],
};
