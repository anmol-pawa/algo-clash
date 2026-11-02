import { describe, expect, it } from "vitest";
import { SOLID, TILE, TILE_NAMES, buildTileset } from "@/game/sprites/tiles";

describe("Mainville tileset", () => {
  const s = buildTileset();
  it("has every named tile at 16x16 with valid palette indices and no transparent holes", () => {
    expect([s.w, s.h]).toEqual([TILE, TILE]);
    for (const n of TILE_NAMES) {
      expect(s.anims[n].length).toBeGreaterThan(0);
      for (const f of s.anims[n]) {
        expect(f.grid.d.every((v) => v > 0 && v < s.palette.length)).toBe(true);
      }
    }
  });
  it("water and tall grass animate; static tiles have one frame", () => {
    expect(s.anims.water).toHaveLength(4);
    expect(s.anims.tallGrass).toHaveLength(2);
    expect(s.anims.grass).toHaveLength(1);
    const a = s.anims.water[0].grid.d, b = s.anims.water[1].grid.d;
    expect(Buffer.compare(Buffer.from(a), Buffer.from(b))).not.toBe(0);
  });
  it("is deterministic", () => {
    const t = buildTileset();
    for (const n of TILE_NAMES)
      expect(Buffer.compare(Buffer.from(t.anims[n][0].grid.d), Buffer.from(s.anims[n][0].grid.d))).toBe(0);
  });
  it("grass variants differ and solid set only names real tiles", () => {
    expect(Buffer.compare(Buffer.from(s.anims.grass[0].grid.d), Buffer.from(s.anims.grass2[0].grid.d))).not.toBe(0);
    for (const n of SOLID) expect(TILE_NAMES).toContain(n);
    expect(SOLID.has("grass")).toBe(false);
    expect(SOLID.has("path")).toBe(false);
  });
});
