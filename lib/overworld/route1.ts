import type { MapDef } from "./map";

/** Route 1: the first grassy route south of Mainville (stub; more routes follow). */
export const ROUTE_1: MapDef = {
  id: "route-1",
  name: "Route 1",
  rows: [
    "TTTTTTTTpTTTTTTT",
    "Tg.g..g.p.g.f.gT",
    "T.f.EEg.pg.g..gT",
    "Tg.EEEg.p.g.EE.T",
    "T..EE..gp..gEEfT",
    "TTT...g.pg..f..T",
    "Tf..bb..p..g.g.T",
    "T.g.....pp.gE.gT",
    "TTTTTTTTTTTTTTTT",
  ],
  legend: {
    T: "tree", g: "grass", ".": "grass2", f: "flowers", p: "path", b: "bush", E: "tallGrass",
  },
  spawn: { x: 8, y: 1, facing: "down" },
  warps: [{ x: 8, y: 0, to: "mainville", tx: 8, ty: 9, facing: "up" }],
  encounterRate: 0.3,
  encounterPool: "route-1-grass",
};
