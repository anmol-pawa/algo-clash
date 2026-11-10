import { describe, expect, it } from "vitest";
import { ATOLL_SOLID, ATOLL_TILE, ATOLL_TILE_NAMES, buildAtollTileset } from "@/game/sprites/atollTiles";

const eq = (a: Uint8Array, b: Uint8Array) => Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;

describe("Array Atoll tileset", () => {
  const s = buildAtollTileset();
  it("has every tile at 16x16 with valid palette indices", () => {
    expect([s.w, s.h]).toEqual([ATOLL_TILE, ATOLL_TILE]);
    for (const n of ATOLL_TILE_NAMES) {
      expect(s.anims[n].length).toBeGreaterThan(0);
      for (const f of s.anims[n]) {
        expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
      }
    }
  });
  it("ground, water and object tiles have no transparent holes except outlined objects' edges", () => {
    for (const n of ["sand", "sand2", "wetSand", "shallows", "deepWater", "boardwalk", "seagrass", "tidePool"] as const)
      for (const f of s.anims[n]) expect(f.grid.d.every((v) => v > 0)).toBe(true);
  });
  it("water-like tiles animate and static tiles have one frame", () => {
    for (const n of ["shallows", "deepWater", "tidePool"] as const) {
      expect(s.anims[n]).toHaveLength(4);
      expect(eq(s.anims[n][0].grid.d, s.anims[n][1].grid.d)).toBe(false);
    }
    expect(s.anims.seagrass).toHaveLength(2);
    expect(s.anims.sand).toHaveLength(1);
  });
  it("is deterministic and sand variants differ", () => {
    const t = buildAtollTileset();
    for (const n of ATOLL_TILE_NAMES) expect(eq(t.anims[n][0].grid.d, s.anims[n][0].grid.d)).toBe(true);
    expect(eq(s.anims.sand[0].grid.d, s.anims.sand2[0].grid.d)).toBe(false);
  });
  it("solid set names real tiles; sand, shallows and boardwalk are walkable", () => {
    for (const n of ATOLL_SOLID) expect(ATOLL_TILE_NAMES).toContain(n);
    for (const n of ["sand", "wetSand", "shallows", "boardwalk", "shell", "tidePool", "seagrass"] as const)
      expect(ATOLL_SOLID.has(n)).toBe(false);
  });
});
