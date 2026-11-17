import { describe, expect, it } from "vitest";
import { STACKSPIRE } from "@/lib/overworld/spire";
import { isBlocked, parseMap, DELTA, DIRS } from "@/lib/overworld/map";
import { SPIRE_SOLID, SPIRE_TILE_NAMES } from "@/game/sprites/spireTiles";
import { LW, GYM_PLATFORMS, PLATFORMS, drawSpireBackdrop } from "@/game/battle/backdrop";

describe("Stackspire map", () => {
  const map = parseMap(STACKSPIRE);
  it("is a rectangle that only uses spire tiles", () => {
    expect(map.width).toBe(22);
    expect(map.height).toBe(14);
    for (const row of map.tiles) for (const t of row) expect(SPIRE_TILE_NAMES as readonly string[]).toContain(t);
  });
  it("keeps its solid list in sync with the tileset", () => {
    expect([...STACKSPIRE.solid!].sort()).toEqual([...SPIRE_SOLID].sort());
  });
  it("climbs from the spawn up the stairs to the tower door and reaches the west lane", () => {
    const seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
    const q = [[map.spawn.x, map.spawn.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      for (const d of DIRS) {
        const nx = x + DELTA[d].dx, ny = y + DELTA[d].dy, k = `${nx},${ny}`;
        if (seen.has(k) || isBlocked(map, nx, ny)) continue;
        seen.add(k); q.push([nx, ny]);
      }
    }
    const door = map.tiles.flatMap((r, y) => r.map((t, x) => (t === "door" ? [x, y] : null))).find(Boolean)!;
    // the door tile blocks nothing, but the tile in front of it must be reachable
    expect(seen.has(`${door[0]},${door[1]}`)).toBe(true);
    expect(seen.has("10,9")).toBe(true);
    expect(seen.has("0,11")).toBe(true);
  });
});

describe("spire battle backdrop", () => {
  it("draws within the logical canvas and keeps both platforms on screen", () => {
    const calls: Array<[number, number, number, number]> = [];
    const ctx = { fillStyle: "", fillRect: (x: number, y: number, w: number, h: number) => calls.push([x, y, w, h]) } as unknown as CanvasRenderingContext2D;
    for (const gym of [false, true]) {
      calls.length = 0;
      drawSpireBackdrop(ctx, 1234, gym);
      expect(calls.length).toBeGreaterThan(200);
      const plats = gym ? GYM_PLATFORMS : PLATFORMS;
      for (const p of [plats.foe, plats.player]) {
        expect(p.cx - p.rx).toBeGreaterThanOrEqual(0);
        expect(p.cx + p.rx).toBeLessThanOrEqual(LW);
      }
    }
  });
});
