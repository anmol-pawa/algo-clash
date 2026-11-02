import { DELTA, Dir, GameMap, WarpDef, isBlocked, ENCOUNTER_TILES, npcAt, tileAt, warpAt } from "./map";

export interface Player {
  x: number;
  y: number;
  facing: Dir;
}

export type WalkEvent =
  | { type: "turn" }
  | { type: "move"; from: { x: number; y: number } }
  | { type: "bump" }
  | { type: "warp"; warp: WarpDef }
  | { type: "encounter"; pool?: string };

export interface StepResult {
  player: Player;
  events: WalkEvent[];
}

/**
 * One grid step. If the player is not yet facing `dir` they only turn (so a tap can aim without
 * walking); `running` skips the turn so held directions flow. Arriving on a warp tile warps;
 * arriving on an encounter tile rolls `rng()` against the map's rate. Pure: the caller owns the RNG.
 */
export function step(map: GameMap, player: Player, dir: Dir, rng: () => number, running = false): StepResult {
  if (player.facing !== dir && !running) {
    return { player: { ...player, facing: dir }, events: [{ type: "turn" }] };
  }
  const { dx, dy } = DELTA[dir];
  const nx = player.x + dx;
  const ny = player.y + dy;
  const turned = { ...player, facing: dir };
  if (isBlocked(map, nx, ny)) return { player: turned, events: [{ type: "bump" }] };
  const next: Player = { x: nx, y: ny, facing: dir };
  const events: WalkEvent[] = [{ type: "move", from: { x: player.x, y: player.y } }];
  const warp = warpAt(map, nx, ny);
  if (warp) {
    events.push({ type: "warp", warp });
    return { player: next, events };
  }
  const t = tileAt(map, nx, ny);
  if (t && ENCOUNTER_TILES.has(t) && map.encounterRate > 0 && rng() < map.encounterRate) {
    events.push({ type: "encounter", pool: map.encounterPool });
  }
  return { player: next, events };
}

export type Interaction =
  | { type: "npc"; npcId: string; dialogue: string; faceBack: Dir }
  | { type: "sign"; dialogue: string }
  | { type: "none" };

const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

/** What the action button does on the tile the player faces. */
export function interact(map: GameMap, player: Player): Interaction {
  const { dx, dy } = DELTA[player.facing];
  const x = player.x + dx;
  const y = player.y + dy;
  const npc = npcAt(map, x, y);
  if (npc) return { type: "npc", npcId: npc.id, dialogue: npc.dialogue, faceBack: OPPOSITE[player.facing] };
  const sign = map.signs.find((s) => s.x === x && s.y === y);
  if (sign) return { type: "sign", dialogue: sign.dialogue };
  return { type: "none" };
}

/** Where the player appears after a warp. */
export function arrive(warp: WarpDef, walking: Dir): Player {
  return { x: warp.tx, y: warp.ty, facing: warp.facing ?? walking };
}

/**
 * Tap-to-move: shortest 4-connected path (BFS) from the player to a tapped tile as directions.
 * A tapped NPC/solid tile is not walkable, so the path ends next to it (the tap then aims at it).
 * Returns [] when already there or unreachable.
 */
export function findPath(map: GameMap, from: { x: number; y: number }, to: { x: number; y: number }): Dir[] {
  if (from.x === to.x && from.y === to.y) return [];
  const key = (x: number, y: number) => y * map.width + x;
  const goalBlocked = isBlocked(map, to.x, to.y);
  const prev = new Map<number, { k: number; d: Dir }>();
  const start = key(from.x, from.y);
  prev.set(start, { k: -1, d: "up" });
  const queue: Array<[number, number]> = [[from.x, from.y]];
  let best: number | undefined;
  let bestDist = Infinity;
  const dist = new Map<number, number>([[start, 0]]);
  for (let head = 0; head < queue.length; head++) {
    const [x, y] = queue[head];
    const k = key(x, y);
    const d = dist.get(k)!;
    const manhattan = Math.abs(x - to.x) + Math.abs(y - to.y);
    if (!goalBlocked && x === to.x && y === to.y) { best = k; break; }
    if (goalBlocked && manhattan === 1 && d < bestDist) { best = k; bestDist = d; break; }
    for (const dir of ["up", "down", "left", "right"] as const) {
      const nx = x + DELTA[dir].dx, ny = y + DELTA[dir].dy;
      if (isBlocked(map, nx, ny)) continue;
      const nk = key(nx, ny);
      if (prev.has(nk)) continue;
      prev.set(nk, { k, d: dir });
      dist.set(nk, d + 1);
      queue.push([nx, ny]);
    }
  }
  if (best === undefined) return [];
  const out: Dir[] = [];
  for (let k = best; k !== start; ) {
    const p = prev.get(k)!;
    out.push(p.d);
    k = p.k;
  }
  out.reverse();
  // Final aim at a blocked goal: the walker stops adjacent and faces it.
  if (goalBlocked) {
    const last = { x: from.x, y: from.y };
    for (const d of out) { last.x += DELTA[d].dx; last.y += DELTA[d].dy; }
    const dx = to.x - last.x, dy = to.y - last.y;
    const face: Dir = dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up";
    if (out.length === 0 || out[out.length - 1] !== face) out.push(face);
  }
  return out;
}
