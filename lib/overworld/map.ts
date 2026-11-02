/** Overworld map format and pure movement rules. No DOM or Pixi. */

export type Dir = "up" | "down" | "left" | "right";
export const DIR_VEC: Record<Dir, readonly [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export interface Npc {
  id: string;
  x: number;
  y: number;
  facing: Dir;
  /** Dialogue script id (see lib/dialogue). */
  dialogue: string;
}
export interface Warp {
  x: number;
  y: number;
  toMap: string;
  toX: number;
  toY: number;
  /** Facing after arriving; defaults to the current facing. */
  facing?: Dir;
}
export interface EncounterZone {
  /** Tile names (e.g. "tallGrass") in which encounters can trigger. */
  tile: string;
  /** Chance per step in [0, 1]. */
  rate: number;
  /** Wild Structling ids with relative weights. */
  table: ReadonlyArray<{ id: string; weight: number }>;
}
export interface MapData {
  id: string;
  name: string;
  /** Rows of single-character codes; `legend` maps code to tile name. */
  rows: readonly string[];
  legend: Readonly<Record<string, string>>;
  solid: ReadonlySet<string>;
  npcs: readonly Npc[];
  warps: readonly Warp[];
  encounter?: EncounterZone;
}

export const mapWidth = (m: MapData): number => (m.rows[0] ?? "").length;
export const mapHeight = (m: MapData): number => m.rows.length;
export const inBounds = (m: MapData, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && y < mapHeight(m) && x < mapWidth(m);

export function tileAt(m: MapData, x: number, y: number): string | null {
  if (!inBounds(m, x, y)) return null;
  return m.legend[m.rows[y][x]] ?? null;
}
export const npcAt = (m: MapData, x: number, y: number): Npc | undefined =>
  m.npcs.find((n) => n.x === x && n.y === y);
export const warpAt = (m: MapData, x: number, y: number): Warp | undefined =>
  m.warps.find((w) => w.x === x && w.y === y);

/** A tile is walkable if it is in bounds, not solid, and has no NPC. */
export function walkable(m: MapData, x: number, y: number): boolean {
  const t = tileAt(m, x, y);
  if (t === null || m.solid.has(t)) return false;
  return npcAt(m, x, y) === undefined;
}

/** Validates a map: rectangular, every code in the legend, entities in bounds on walkable tiles. */
export function validateMap(m: MapData): string[] {
  const errs: string[] = [];
  const w = mapWidth(m);
  if (m.rows.length === 0 || w === 0) errs.push("empty map");
  m.rows.forEach((r, y) => {
    if (r.length !== w) errs.push(`row ${y} has width ${r.length}, expected ${w}`);
    for (const c of r) if (!(c in m.legend)) errs.push(`row ${y}: code '${c}' not in legend`);
  });
  const ids = new Set<string>();
  for (const n of m.npcs) {
    if (ids.has(n.id)) errs.push(`duplicate npc ${n.id}`);
    ids.add(n.id);
    const t = tileAt(m, n.x, n.y);
    if (t === null) errs.push(`npc ${n.id} out of bounds`);
    else if (m.solid.has(t)) errs.push(`npc ${n.id} stands on solid tile ${t}`);
  }
  for (const wp of m.warps) {
    const t = tileAt(m, wp.x, wp.y);
    if (t === null) errs.push(`warp at ${wp.x},${wp.y} out of bounds`);
    else if (m.solid.has(t)) errs.push(`warp at ${wp.x},${wp.y} is on solid tile ${t}`);
  }
  return errs;
}

export interface Player {
  x: number;
  y: number;
  facing: Dir;
}
export type StepResult =
  | { kind: "moved"; player: Player; warp?: Warp }
  | { kind: "turned"; player: Player }
  | { kind: "blocked"; player: Player };

/**
 * One grid step. If the facing differs from `dir` the player first only turns
 * (so a tap on an NPC can face it without walking), unless `allowTurnOnly` is false.
 */
export function step(m: MapData, p: Player, dir: Dir, allowTurnOnly = true): StepResult {
  if (allowTurnOnly && p.facing !== dir) return { kind: "turned", player: { ...p, facing: dir } };
  const [dx, dy] = DIR_VEC[dir];
  const nx = p.x + dx;
  const ny = p.y + dy;
  const turned: Player = { ...p, facing: dir };
  if (!walkable(m, nx, ny)) return { kind: "blocked", player: turned };
  const player: Player = { x: nx, y: ny, facing: dir };
  const warp = warpAt(m, nx, ny);
  return warp ? { kind: "moved", player, warp } : { kind: "moved", player };
}

/** The NPC directly in front of the player, if any. */
export function facingNpc(m: MapData, p: Player): Npc | undefined {
  const [dx, dy] = DIR_VEC[p.facing];
  return npcAt(m, p.x + dx, p.y + dy);
}

/** Deterministic encounter roll: `rand` returns [0,1). Returns a wild id or null. */
export function rollEncounter(m: MapData, p: Player, rand: () => number): string | null {
  const z = m.encounter;
  if (!z || tileAt(m, p.x, p.y) !== z.tile) return null;
  if (rand() >= z.rate) return null;
  const total = z.table.reduce((s, e) => s + e.weight, 0);
  if (total <= 0) return null;
  let r = rand() * total;
  for (const e of z.table) {
    r -= e.weight;
    if (r < 0) return e.id;
  }
  return z.table[z.table.length - 1].id;
}

/**
 * Tap-to-move: breadth-first path over walkable tiles. Returns directions, or
 * null if unreachable. Warps are avoided unless they are the goal.
 */
export function findPath(m: MapData, from: { x: number; y: number }, to: { x: number; y: number }): Dir[] | null {
  if (from.x === to.x && from.y === to.y) return [];
  if (!walkable(m, to.x, to.y)) return null;
  const key = (x: number, y: number) => y * mapWidth(m) + x;
  const prev = new Map<number, { k: number; d: Dir }>();
  const q: Array<[number, number]> = [[from.x, from.y]];
  const seen = new Set<number>([key(from.x, from.y)]);
  const dirs = Object.keys(DIR_VEC) as Dir[];
  while (q.length) {
    const [x, y] = q.shift() as [number, number];
    for (const d of dirs) {
      const nx = x + DIR_VEC[d][0];
      const ny = y + DIR_VEC[d][1];
      const k = key(nx, ny);
      if (seen.has(k) || !walkable(m, nx, ny)) continue;
      const isGoal = nx === to.x && ny === to.y;
      if (!isGoal && warpAt(m, nx, ny)) continue;
      seen.add(k);
      prev.set(k, { k: key(x, y), d });
      if (isGoal) {
        const out: Dir[] = [];
        let cur = k;
        const start = key(from.x, from.y);
        while (cur !== start) {
          const p = prev.get(cur) as { k: number; d: Dir };
          out.push(p.d);
          cur = p.k;
        }
        return out.reverse();
      }
      q.push([nx, ny]);
    }
  }
  return null;
}
