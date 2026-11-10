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

describe("atoll world wiring", () => {
  it("links Route 1 and the atoll both ways and has a valid ferryman script", async () => {
    const { ROUTE_1 } = await import("@/lib/overworld/route1");
    const { parseMap } = await import("@/lib/overworld/map");
    const { ATOLL_DIALOGUES } = await import("@/lib/dialogue/atoll");
    const { validateScript } = await import("@/lib/dialogue/script");
    const r = parseMap(ROUTE_1), a = parseMap(ARRAY_ATOLL);
    for (const w of r.warps.filter((x) => x.to === "array-atoll")) {
      expect(a.solid.has(a.tiles[w.ty][w.tx])).toBe(false);
      expect(a.warps.some((b) => b.to === "route-1")).toBe(true);
    }
    for (const w of a.warps) expect(r.solid.has(r.tiles[w.ty][w.tx])).toBe(false);
    for (const n of a.npcs) expect(validateScript(ATOLL_DIALOGUES[n.dialogue])).toEqual([]);
    expect(a.encounterRate).toBeGreaterThan(0);
  });
});
