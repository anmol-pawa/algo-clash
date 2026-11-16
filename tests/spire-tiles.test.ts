import { describe, expect, it } from "vitest";
import { SPIRE_PALETTE, SPIRE_SOLID, SPIRE_TILE, SPIRE_TILE_NAMES, buildSpireTileset } from "@/game/sprites/spireTiles";

describe("Stackspire tileset", () => {
  const sheet = buildSpireTileset();
  it("has a 16x16 opaque tile for every name, using only palette slots", () => {
    expect(sheet.w).toBe(SPIRE_TILE);
    for (const n of SPIRE_TILE_NAMES) {
      for (const f of sheet.anims[n]) {
        expect(f.grid.w).toBe(16);
        expect(f.grid.h).toBe(16);
        for (const v of f.grid.d) {
          expect(v).toBeGreaterThan(0);
          expect(v).toBeLessThan(SPIRE_PALETTE.length);
        }
      }
    }
  });
  it("animates torch, banner, rune and sky with frames that differ", () => {
    for (const n of ["torch", "banner", "rune", "sky"]) {
      const fr = sheet.anims[n];
      expect(fr.length).toBeGreaterThan(1);
      expect(Array.from(fr[0].grid.d)).not.toEqual(Array.from(fr[1].grid.d));
    }
  });
  it("is deterministic and keeps solids a subset of the names", () => {
    const again = buildSpireTileset();
    for (const n of SPIRE_TILE_NAMES) expect(Array.from(again.anims[n][0].grid.d)).toEqual(Array.from(sheet.anims[n][0].grid.d));
    for (const s of SPIRE_SOLID) expect(SPIRE_TILE_NAMES).toContain(s);
    for (const w of ["floor", "path", "rune", "stairs"]) expect(SPIRE_SOLID.has(w as never)).toBe(false);
  });
});
