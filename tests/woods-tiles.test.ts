import { describe, expect, it } from "vitest";
import { WOODS_SOLID, WOODS_TILE, WOODS_TILE_NAMES, buildWoodsTileset } from "@/game/sprites/woodsTiles";

const eq = (a: Uint8Array, b: Uint8Array) => Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;

describe("Window Woods tileset", () => {
  const s = buildWoodsTileset();
  it("has every tile at 16x16 with valid palette indices", () => {
    expect([s.w, s.h]).toEqual([WOODS_TILE, WOODS_TILE]);
    for (const n of WOODS_TILE_NAMES) {
      expect(s.anims[n].length).toBeGreaterThan(0);
      for (const f of s.anims[n]) expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
    }
  });
  it("ground and water tiles have no transparent holes", () => {
    for (const n of ["grass", "grass2", "path", "pathEdge", "tallGrass", "flowers", "pond", "leaves", "lightShaft"] as const)
      for (const f of s.anims[n]) expect(f.grid.d.every((v) => v > 0)).toBe(true);
  });
  it("the pond and tall grass animate, others are static", () => {
    expect(s.anims.pond).toHaveLength(4);
    expect(eq(s.anims.pond[0].grid.d, s.anims.pond[1].grid.d)).toBe(false);
    expect(s.anims.tallGrass).toHaveLength(2);
    expect(eq(s.anims.tallGrass[0].grid.d, s.anims.tallGrass[1].grid.d)).toBe(false);
    expect(s.anims.pine).toHaveLength(1);
  });
  it("is deterministic and grass variants differ", () => {
    const t = buildWoodsTileset();
    for (const n of WOODS_TILE_NAMES) expect(eq(t.anims[n][0].grid.d, s.anims[n][0].grid.d)).toBe(true);
    expect(eq(s.anims.grass[0].grid.d, s.anims.grass2[0].grid.d)).toBe(false);
  });
  it("solid set names real tiles; ground, path and tall grass are walkable", () => {
    for (const n of WOODS_SOLID) expect(WOODS_TILE_NAMES).toContain(n);
    for (const n of ["grass", "path", "pathEdge", "tallGrass", "flowers", "leaves", "mushroom"] as const)
      expect(WOODS_SOLID.has(n)).toBe(false);
  });
});
