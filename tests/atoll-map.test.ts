import { describe, expect, it } from "vitest";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { isBlocked, parseMap, DELTA, DIRS } from "@/lib/overworld/map";
import { ATOLL_SOLID, ATOLL_TILE_NAMES } from "@/game/sprites/atollTiles";

describe("Array Atoll map", () => {
  const map = parseMap(ARRAY_ATOLL);
  it("is a rectangle that only uses atoll tiles", () => {
    expect(map.width).toBe(22);
    expect(map.height).toBe(15);
    for (const row of map.tiles) for (const t of row) expect(ATOLL_TILE_NAMES).toContain(t);
  });
  it("keeps its solid list in sync with the tileset", () => {
    expect([...ARRAY_ATOLL.solid!].sort()).toEqual([...ATOLL_SOLID].sort());
    expect(isBlocked(map, 0, 0)).toBe(true); // deep water
    expect(isBlocked(map, 4, 6)).toBe(true); // palm
    expect(isBlocked(map, 10, 5)).toBe(false); // boardwalk
    expect(isBlocked(map, 3, 4)).toBe(false); // shallows are wadeable
  });
  it("lets the player walk from the spawn to the gym door", () => {
    const door = map.doors[0];
    const seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
    const q = [[map.spawn.x, map.spawn.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      for (const d of DIRS) {
        const nx = x + DELTA[d].dx, ny = y + DELTA[d].dy, k = `${nx},${ny}`;
        if (!seen.has(k) && !isBlocked(map, nx, ny)) { seen.add(k); q.push([nx, ny]); }
      }
    }
    expect(seen.has(`${door.x},${door.y}`)).toBe(true);
    expect(seen.size).toBeGreaterThan(100);
  });
});
