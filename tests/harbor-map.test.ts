import { describe, expect, it } from "vitest";
import { HASHWOOD_HARBOR } from "@/lib/overworld/harbor";
import { isBlocked, parseMap, DELTA, DIRS } from "@/lib/overworld/map";
import { HARBOR_SOLID, HARBOR_TILE_NAMES } from "@/game/sprites/harborTiles";
import { LW, GYM_PLATFORMS, PLATFORMS, drawHarborBackdrop } from "@/game/battle/backdrop";

describe("Hashwood Harbor map", () => {
  const map = parseMap(HASHWOOD_HARBOR);
  it("is a rectangle that only uses harbor tiles", () => {
    expect(map.width).toBe(22);
    expect(map.height).toBe(15);
    for (const row of map.tiles) for (const t of row) expect(HARBOR_TILE_NAMES as readonly string[]).toContain(t);
  });
  it("keeps its solid list in sync with the tileset", () => {
    expect([...HASHWOOD_HARBOR.solid!].sort()).toEqual([...HARBOR_SOLID].sort());
  });
  it("reaches the gym door and both docks from the spawn", () => {
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
    const door = map.doors[0];
    expect(seen.has(`${door.x},${door.y}`)).toBe(true);
    expect(seen.has("5,11")).toBe(true);
    expect(seen.has("17,11")).toBe(true);
  });
});

describe("harbor battle backdrop", () => {
  it("draws within the logical canvas and keeps both platforms on screen", () => {
    const calls: Array<[number, number, number, number]> = [];
    const ctx = { fillStyle: "", fillRect: (x: number, y: number, w: number, h: number) => calls.push([x, y, w, h]) } as unknown as CanvasRenderingContext2D;
    for (const gym of [false, true]) {
      calls.length = 0;
      drawHarborBackdrop(ctx, 1234, gym);
      expect(calls.length).toBeGreaterThan(200);
      const plats = gym ? GYM_PLATFORMS : PLATFORMS;
      for (const p of [plats.foe, plats.player]) {
        expect(p.cx - p.rx).toBeGreaterThanOrEqual(0);
        expect(p.cx + p.rx).toBeLessThanOrEqual(LW);
      }
    }
  });
});
