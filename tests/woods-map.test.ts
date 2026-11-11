import { describe, expect, it } from "vitest";
import { WINDOW_WOODS } from "@/lib/overworld/woods";
import { isBlocked, parseMap, DELTA, DIRS, ENCOUNTER_TILES } from "@/lib/overworld/map";
import { WOODS_SOLID, WOODS_TILE_NAMES } from "@/game/sprites/woodsTiles";

describe("Window Woods map", () => {
  const map = parseMap(WINDOW_WOODS);
  it("is a rectangle that only uses woods tiles", () => {
    expect(map.width).toBe(22);
    expect(map.height).toBe(15);
    for (const row of map.tiles) for (const t of row) expect(WOODS_TILE_NAMES).toContain(t);
  });
  it("keeps its solid list in sync with the tileset", () => {
    expect([...WINDOW_WOODS.solid!].sort()).toEqual([...WOODS_SOLID].sort());
    expect(isBlocked(map, 0, 0)).toBe(true); // pine
    expect(isBlocked(map, 1, 8)).toBe(true); // stream
    expect(isBlocked(map, 9, 8)).toBe(false); // bridge
    expect(ENCOUNTER_TILES.has("fern")).toBe(true);
  });
  it("is reachable north of the stream only via the bridge, and the clearing is reachable from the spawn", () => {
    const reach = (blockBridge: boolean) => {
      const seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
      const q = [[map.spawn.x, map.spawn.y]];
      while (q.length) {
        const [x, y] = q.shift()!;
        for (const d of DIRS) {
          const nx = x + DELTA[d].dx, ny = y + DELTA[d].dy, k = `${nx},${ny}`;
          if (seen.has(k) || isBlocked(map, nx, ny)) continue;
          if (blockBridge && map.tiles[ny][nx] === "bridge") continue;
          seen.add(k); q.push([nx, ny]);
        }
      }
      return seen;
    };
    expect(reach(false).has("9,3")).toBe(true); // the clearing gate
    expect(reach(true).has("9,3")).toBe(false);
  });
});
