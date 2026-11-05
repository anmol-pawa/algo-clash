import { type GameMap, parseMap } from "./map";
import { MAINVILLE } from "./mainville";
import { ROUTE_1 } from "./route1";

/** Every playable map, compiled once. */
export const MAPS: Record<string, GameMap> = Object.fromEntries(
  [MAINVILLE, ROUTE_1].map((d) => [d.id, parseMap(d)]),
);
export const START_MAP = "mainville";
