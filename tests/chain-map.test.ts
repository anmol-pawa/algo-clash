import { describe, expect, it } from "vitest";
import { CHAINLINK_CAVES } from "@/lib/overworld/chain";
import { isBlocked, parseMap, DELTA, DIRS } from "@/lib/overworld/map";
import { CHAIN_SOLID, CHAIN_TILE_NAMES } from "@/game/sprites/chainTiles";
import { LW, GYM_PLATFORMS, PLATFORMS, drawChainBackdrop } from "@/game/battle/backdrop";

describe("Chainlink Caves map", () => {
  const map = parseMap(CHAINLINK_CAVES);
  const reach = () => {
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
    return seen;
  };
  it("is a rectangle that only uses chain tiles", () => {
    expect(map.width).toBe(24);
    expect(map.height).toBe(14);
    for (const row of map.tiles) for (const t of row) expect(CHAIN_TILE_NAMES as readonly string[]).toContain(t);
  });
  it("keeps its solid list in sync with the tileset", () => {
    expect([...CHAINLINK_CAVES.solid!].sort()).toEqual([...CHAIN_SOLID].sort());
  });
  it("follows the link path from the spawn over the pool to the gate, and reaches the west lane", () => {
    const seen = reach();
    expect(seen.has("12,2")).toBe(true); // tile in front of the gate
    expect(seen.has("0,10")).toBe(true); // lane back to Stackspire
    expect(map.tiles[1][12]).toBe("door");
    expect(map.spawn.y).toBeGreaterThan(10);
  });
  it("lets every node pad be reached", () => {
    const seen = reach();
    map.tiles.forEach((row, y) => row.forEach((t, x) => { if (t === "nodepad") expect(seen.has(`${x},${y}`)).toBe(true); }));
  });
  it("crosses the pool only by the bridge", () => {
    for (let y = 6; y <= 8; y++) expect(map.tiles[y][12]).toBe("bridge");
  });
});

describe("chain battle backdrop", () => {
  it("draws within the logical canvas and keeps both platforms on screen", () => {
    const calls: Array<[number, number, number, number]> = [];
    const ctx = { fillStyle: "", fillRect: (x: number, y: number, w: number, h: number) => calls.push([x, y, w, h]) } as unknown as CanvasRenderingContext2D;
    for (const gym of [false, true]) {
      calls.length = 0;
      drawChainBackdrop(ctx, 1234, gym);
      expect(calls.length).toBeGreaterThan(200);
      const plats = gym ? GYM_PLATFORMS : PLATFORMS;
      for (const p of [plats.foe, plats.player]) {
        expect(p.cx - p.rx).toBeGreaterThanOrEqual(0);
        expect(p.cx + p.rx).toBeLessThanOrEqual(LW);
      }
    }
  });
});
