import { describe, expect, it } from "vitest";
import { WOODS_SOLID, WOODS_TILE, WOODS_TILE_NAMES, buildWoodsTileset } from "@/game/sprites/woodsTiles";

const eq = (a: Uint8Array, b: Uint8Array) => Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;

describe("Window Woods tileset", () => {
  const s = buildWoodsTileset();
  it("has every tile at 16x16 with valid palette indices", () => {
    expect([s.w, s.h]).toEqual([WOODS_TILE, WOODS_TILE]);
    for (const n of WOODS_TILE_NAMES) {
      expect(s.anims[n].length).toBeGreaterThan(0);
      for (const f of s.anims[n]) {
        expect(f.grid.w).toBe(WOODS_TILE);
        expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
      }
    }
  });
  it("every tile is fully opaque (objects sit on a grass or water base)", () => {
    for (const n of WOODS_TILE_NAMES) for (const f of s.anims[n]) expect(f.grid.d.every((v) => v > 0)).toBe(true);
  });
  it("water and undergrowth animate; static tiles have one frame", () => {
    for (const n of ["stream", "bridge"] as const) {
      expect(s.anims[n]).toHaveLength(4);
      expect(eq(s.anims[n][0].grid.d, s.anims[n][1].grid.d)).toBe(false);
    }
    expect(s.anims.fern).toHaveLength(2);
    expect(eq(s.anims.fern[0].grid.d, s.anims.fern[1].grid.d)).toBe(false);
    expect(s.anims.pine).toHaveLength(1);
  });
  it("is deterministic and grass variants differ", () => {
    const t = buildWoodsTileset();
    for (const n of WOODS_TILE_NAMES) expect(eq(t.anims[n][0].grid.d, s.anims[n][0].grid.d)).toBe(true);
    expect(eq(s.anims.grass[0].grid.d, s.anims.grass2[0].grid.d)).toBe(false);
  });
  it("pine uses the dark outline and needle ramp, never light grass on its tiers", () => {
    const g = s.anims.pine[0].grid;
    expect(g.get(8, 8)).toBeGreaterThanOrEqual(6);
    expect(g.get(8, 8)).toBeLessThanOrEqual(9);
  });
  it("solid set names real tiles; paths, ferns and the bridge are walkable", () => {
    for (const n of WOODS_SOLID) expect(WOODS_TILE_NAMES).toContain(n);
    for (const n of ["grass", "path", "pathEdge", "fern", "bridge", "leafPile", "mushroom"] as const)
      expect(WOODS_SOLID.has(n)).toBe(false);
  });
});
