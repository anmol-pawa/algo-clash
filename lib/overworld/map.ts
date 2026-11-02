/** Overworld map format and rules. Pure logic: no Pixi or DOM (ARCH §3). */

export type Dir = "up" | "down" | "left" | "right";
export const DIRS: readonly Dir[] = ["up", "down", "left", "right"];
export const DELTA: Record<Dir, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

/** Tiles that block movement. Kept in sync with `SOLID` in game/sprites/tiles.ts by a test. */
export const SOLID_TILES: ReadonlySet<string> = new Set([
  "water", "tree", "bush", "fence", "sign", "wallHouse", "roofHouse", "windowHouse", "wallLab", "roofLab",
]);
/** Tiles that can trigger wild encounters. */
export const ENCOUNTER_TILES: ReadonlySet<string> = new Set(["tallGrass"]);
/** Solid tiles the player can read by facing them and pressing the action button. */
export const READABLE_TILES: ReadonlySet<string> = new Set(["sign"]);

export interface NpcDef {
  id: string;
  x: number;
  y: number;
  facing: Dir;
  sprite: string;
  /** Dialogue script id (lib/dialogue). */
  dialogue: string;
}
export interface WarpDef {
  x: number;
  y: number;
  /** Destination map id and tile. */
  to: string;
  tx: number;
  ty: number;
  /** Facing after arriving; defaults to the walking direction. */
  facing?: Dir;
}
export interface SignDef {
  x: number;
  y: number;
  dialogue: string;
}
export interface MapDef {
  id: string;
  name: string;
  /** Rows of single-character tile codes, all the same length. */
  rows: string[];
  legend: Record<string, string>;
  spawn: { x: number; y: number; facing: Dir };
  npcs?: NpcDef[];
  warps?: WarpDef[];
  signs?: SignDef[];
  /** Chance (0..1) that one step on an encounter tile starts a battle. */
  encounterRate?: number;
  /** Pool id for the encounter table (lib/battle, B4). */
  encounterPool?: string;
}

export interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: string[][];
  spawn: MapDef["spawn"];
  npcs: NpcDef[];
  warps: WarpDef[];
  signs: SignDef[];
  encounterRate: number;
  encounterPool?: string;
}

const inside = (m: { width: number; height: number }, x: number, y: number) =>
  Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < m.width && y < m.height;

/** Validate and compile a map definition. Throws with a readable message on authoring mistakes. */
export function parseMap(def: MapDef): GameMap {
  const fail = (msg: string): never => {
    throw new Error(`map "${def.id}": ${msg}`);
  };
  if (def.rows.length === 0) fail("no rows");
  const width = def.rows[0].length;
  const tiles = def.rows.map((row, y) => {
    if (row.length !== width) fail(`row ${y} has length ${row.length}, expected ${width}`);
    return [...row].map((ch, x) => def.legend[ch] ?? fail(`unknown tile code "${ch}" at ${x},${y}`));
  });
  const m: GameMap = {
    id: def.id, name: def.name, width, height: tiles.length, tiles,
    spawn: def.spawn, npcs: def.npcs ?? [], warps: def.warps ?? [], signs: def.signs ?? [],
    encounterRate: def.encounterRate ?? 0, encounterPool: def.encounterPool,
  };
  if (m.encounterRate < 0 || m.encounterRate > 1) fail("encounterRate must be within 0..1");
  if (!inside(m, m.spawn.x, m.spawn.y) || SOLID_TILES.has(tiles[m.spawn.y][m.spawn.x])) fail("spawn is outside the map or on a solid tile");
  const seen = new Set<string>();
  for (const n of m.npcs) {
    if (!inside(m, n.x, n.y)) fail(`npc ${n.id} is outside the map`);
    if (SOLID_TILES.has(tiles[n.y][n.x])) fail(`npc ${n.id} stands on a solid tile`);
    const k = `${n.x},${n.y}`;
    if (seen.has(k)) fail(`two npcs at ${k}`);
    seen.add(k);
  }
  for (const w of m.warps) {
    if (!inside(m, w.x, w.y)) fail(`warp at ${w.x},${w.y} is outside the map`);
    if (SOLID_TILES.has(tiles[w.y][w.x])) fail(`warp at ${w.x},${w.y} is on a solid tile`);
  }
  for (const s of m.signs) if (!inside(m, s.x, s.y) || !READABLE_TILES.has(tiles[s.y][s.x])) fail(`sign at ${s.x},${s.y} is not on a readable tile`);
  return m;
}

export function tileAt(map: GameMap, x: number, y: number): string | undefined {
  return inside(map, x, y) ? map.tiles[y][x] : undefined;
}
export function npcAt(map: GameMap, x: number, y: number): NpcDef | undefined {
  return map.npcs.find((n) => n.x === x && n.y === y);
}
export function warpAt(map: GameMap, x: number, y: number): WarpDef | undefined {
  return map.warps.find((w) => w.x === x && w.y === y);
}
/** True when a walker cannot enter the tile: off-map, solid tile or an NPC. */
export function isBlocked(map: GameMap, x: number, y: number): boolean {
  const t = tileAt(map, x, y);
  return t === undefined || SOLID_TILES.has(t) || npcAt(map, x, y) !== undefined;
}
