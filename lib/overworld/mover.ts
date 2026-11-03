import { DELTA, Dir, GameMap, WarpDef } from "./map";
import { Interaction, Player, arrive, findPath, interact, step } from "./walk";

/** Milliseconds a one-tile walk takes. */
export const STEP_MS = 170;

export interface WorldState {
  map: GameMap;
  player: Player;
  /** In-flight tile-to-tile move; `t` runs 0..1. */
  moving: { fromX: number; fromY: number; t: number } | null;
  /** Queued directions from tap-to-move. */
  path: Dir[];
  /** Direction currently held on keyboard or d-pad. */
  held: Dir | null;
  /** Total walked steps, used to alternate walk-cycle frames. */
  steps: number;
  /** Warp reached by the in-flight step; applied when the step finishes. */
  warp: WarpDef | null;
}

export type WorldEvent =
  | { type: "map"; id: string }
  | { type: "encounter"; pool?: string }
  | { type: "bump" };

export function newWorld(map: GameMap): WorldState {
  return { map, player: { ...map.spawn }, moving: null, path: [], held: null, steps: 0, warp: null };
}

/**
 * Advance the world by `dtMs`. Pure apart from mutating `s`; the caller owns the RNG and the map
 * registry (`maps`), so it stays unit-testable. Returns the events raised during the tick.
 */
export function tickWorld(s: WorldState, dtMs: number, rng: () => number, maps: Readonly<Record<string, GameMap>>): WorldEvent[] {
  const events: WorldEvent[] = [];
  let budget = dtMs;
  // A tick can finish one step and start the next, so loop on the remaining time.
  for (let guard = 0; guard < 8 && budget > 0; guard++) {
    if (s.moving) {
      const need = (1 - s.moving.t) * STEP_MS;
      if (budget < need) {
        s.moving.t += budget / STEP_MS;
        return events;
      }
      budget -= need;
      s.moving = null;
      if (s.warp) {
        const w = s.warp;
        s.warp = null;
        const dest = maps[w.to];
        if (dest) {
          s.map = dest;
          s.player = arrive(w, s.player.facing);
          s.path = [];
          events.push({ type: "map", id: dest.id });
        }
      }
      continue;
    }
    const dir = s.path.shift() ?? s.held;
    if (!dir) return events;
    const from = { ...s.player };
    const r = step(s.map, s.player, dir, rng, true);
    s.player = r.player;
    for (const e of r.events) {
      if (e.type === "move") {
        s.moving = { fromX: from.x, fromY: from.y, t: 0 };
        s.steps++;
      } else if (e.type === "warp") s.warp = e.warp;
      else if (e.type === "encounter") {
        events.push({ type: "encounter", pool: e.pool });
        s.path = [];
      } else if (e.type === "bump") {
        events.push({ type: "bump" });
        s.path = [];
        return events; // holding into a wall: one bump per tick, no spinning
      }
    }
  }
  return events;
}

/** Tap-to-move: queue a path to a tile. */
export function tapTo(s: WorldState, x: number, y: number): void {
  if (s.moving) return;
  s.path = findPath(s.map, s.player, { x, y });
}

/** Action button. Ignored mid-step. */
export function press(s: WorldState): Interaction {
  if (s.moving) return { type: "none" };
  return interact(s.map, s.player);
}

/** Tile position to draw the player at, interpolated during a step. */
export function playerDrawPos(s: WorldState): { x: number; y: number } {
  const { x, y } = s.player;
  if (!s.moving) return { x, y };
  const f = 1 - s.moving.t;
  const { dx, dy } = DELTA[s.player.facing];
  return { x: x - dx * f, y: y - dy * f };
}

/** Turn an NPC to face a direction (used when the player talks to them). Returns false for unknown ids. */
export function faceNpc(s: WorldState, npcId: string, dir: Dir): boolean {
  const npc = s.map.npcs.find((n) => n.id === npcId);
  if (!npc) return false;
  npc.facing = dir;
  return true;
}
