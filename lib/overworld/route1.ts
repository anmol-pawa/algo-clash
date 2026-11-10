import type { MapDef } from "./map";

/** Route 1: the grassy road south of Mainville (B2b sample map; wild Structlings come with B4). */
export const ROUTE_1: MapDef = {
  id: "route-1",
  name: "Route 1",
  rows: [
    "TTTTTTTppTTTTTTT",
    "Tg.g.f.pp.g.f.gT",
    "T.gg...pp..g...T",
    "TEEE...pp..bb..T",
    "TEEEg..pp.g...gT",
    "Tg.....pp...EEET",
    "T.f.g..pp.g.EEET",
    "T..bb..pp...EEET",
    "Tg....f.ppg....T",
    "T.g.....pp..g.fT",
    "TTTTTTTppTTTTTTT",
  ],
  legend: { T: "tree", g: "grass", ".": "grass2", f: "flowers", p: "path", b: "bush", E: "tallGrass" },
  spawn: { x: 7, y: 1, facing: "down" },
  warps: [{ x: 7, y: 0, to: "mainville", tx: 8, ty: 9, facing: "up" }, { x: 8, y: 0, to: "mainville", tx: 8, ty: 9, facing: "up" },
    { x: 7, y: 10, to: "array-atoll", tx: 9, ty: 12, facing: "up" }, { x: 8, y: 10, to: "array-atoll", tx: 10, ty: 12, facing: "up" }],
  encounterRate: 0.2,
  encounterPool: "route-1-grass",
};
