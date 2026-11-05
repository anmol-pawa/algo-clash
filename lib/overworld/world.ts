/** Overworld simulation: smooth tile-to-tile walking, queued tap paths, warps with fades, encounters. Pure. */
import { type Dir, type GameMap, type WarpDef } from "./map";
import { type Interaction, type Player, type WalkEvent, arrive, findPath, interact, step } from "./walk";

/** Milliseconds to walk one tile. */
export const STEP_MS = 170;
const TURN_PAUSE_MS = 90;
const BUMP_PAUSE_MS = 140;
export const FADE_MS = 220;

export interface World {
  maps: Record<string, GameMap>;
  map: GameMap;
  /** Logical tile; while walking this is already the destination tile. */
  player: Player;
  walk: { fromX: number; fromY: number; t: number; events: WalkEvent[] } | null;
  /** Alternates the stepping foot. */
  parity: 0 | 1;
  pause: number;
  /** Queued tap-to-move directions. */
  path: Dir[];
  fade: { phase: "out" | "in"; t: number; warp?: WarpDef; dir?: Dir } | null;
  /** NPC facing overrides (set when the player talks to them). */
  npcFacing: Record<string, Dir>;
}

export type WorldEvent =
  | { type: "encounter"; pool?: string }
  | { type: "mapChanged"; mapId: string }
  | { type: "bump" };

export function createWorld(maps: Record<string, GameMap>, mapId: string, player?: Player): World {
  const map = maps[mapId];
  if (!map) throw new Error(`unknown map "${mapId}"`);
  return {
    maps, map, player: player ?? { ...map.spawn }, walk: null, parity: 0, pause: 0, path: [], fade: null, npcFacing: {},
  };
}

export const isBusy = (w: World) => w.walk !== null || w.fade !== null;

/** Render position in tiles (fractional while walking). */
export function renderPos(w: World): { x: number; y: number; progress: number } {
  if (!w.walk) return { x: w.player.x, y: w.player.y, progress: 0 };
  const p = Math.min(1, w.walk.t / STEP_MS);
  return { x: w.walk.fromX + (w.player.x - w.walk.fromX) * p, y: w.walk.fromY + (w.player.y - w.walk.fromY) * p, progress: p };
}

/** Screen-fade opacity 0..1 for warps. */
export function fadeAlpha(w: World): number {
  if (!w.fade) return 0;
  const p = Math.min(1, w.fade.t / FADE_MS);
  return w.fade.phase === "out" ? p : 1 - p;
}

/** Queue a tap-to-move path to a tile (replaces any previous path). */
export function tapMove(w: World, x: number, y: number): void {
  if (w.fade) return;
  w.path = findPath(w.map, w.player, { x, y });
}

/** Action button: talk to / read what the player faces. Ignored mid-step. */
export function action(w: World): Interaction {
  if (isBusy(w)) return { type: "none" };
  const r = interact(w.map, w.player);
  if (r.type === "npc") w.npcFacing[r.npcId] = r.faceBack;
  w.path = [];
  return r;
}

function finishWalk(w: World, out: WorldEvent[]): void {
  const events = w.walk!.events;
  w.walk = null;
  for (const e of events) {
    if (e.type === "warp") {
      w.fade = { phase: "out", t: 0, warp: e.warp, dir: w.player.facing };
      w.path = [];
    } else if (e.type === "encounter") {
      out.push({ type: "encounter", pool: e.pool });
      w.path = [];
    }
  }
}

/** Advance the world by `dt` ms. `held` is the currently held direction (keyboard/d-pad), if any. */
export function tick(w: World, dt: number, held: Dir | null, rng: () => number): WorldEvent[] {
  const out: WorldEvent[] = [];
  if (w.fade) {
    w.fade.t += dt;
    if (w.fade.t >= FADE_MS) {
      if (w.fade.phase === "out" && w.fade.warp) {
        const next = w.maps[w.fade.warp.to];
        if (!next) throw new Error(`warp to unknown map "${w.fade.warp.to}"`);
        w.map = next;
        w.player = arrive(w.fade.warp, w.fade.dir ?? w.player.facing);
        w.npcFacing = {};
        w.fade = { phase: "in", t: 0 };
        out.push({ type: "mapChanged", mapId: next.id });
      } else {
        w.fade = null;
      }
    }
    return out;
  }
  if (w.walk) {
    w.walk.t += dt;
    if (w.walk.t < STEP_MS) return out;
    finishWalk(w, out);
    if (w.fade || out.length) return out;
  }
  if (w.pause > 0) {
    w.pause -= dt;
    if (w.pause > 0) return out;
  }
  if (held) w.path = [];
  const dir = held ?? w.path[0] ?? null;
  if (!dir) return out;
  const r = step(w.map, w.player, dir, rng);
  w.player = r.player;
  const moved = r.events.find((e) => e.type === "move");
  if (moved?.type === "move") {
    if (!held) w.path.shift();
    w.walk = { fromX: moved.from.x, fromY: moved.from.y, t: 0, events: r.events.filter((e) => e.type === "warp" || e.type === "encounter") };
    w.parity = w.parity === 0 ? 1 : 0;
  } else if (r.events.some((e) => e.type === "bump")) {
    w.path = [];
    w.pause = BUMP_PAUSE_MS;
    out.push({ type: "bump" });
  } else {
    w.pause = TURN_PAUSE_MS;
  }
  return out;
}
