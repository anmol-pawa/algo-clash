import { describe, expect, it } from "vitest";
import { CHAIN_PALETTE, CHAIN_SOLID, CHAIN_TILE, CHAIN_TILE_NAMES, buildChainTileset } from "@/game/sprites/chainTiles";

describe("Chainlink Caves tileset", () => {
  const sheet = buildChainTileset();
  it("has a 16x16 opaque tile for every name, using only palette slots", () => {
    expect(sheet.w).toBe(CHAIN_TILE);
    for (const n of CHAIN_TILE_NAMES) {
      for (const f of sheet.anims[n]) {
        expect(f.grid.w).toBe(16);
        expect(f.grid.h).toBe(16);
        for (const v of f.grid.d) {
          expect(v).toBeGreaterThan(0);
          expect(v).toBeLessThan(CHAIN_PALETTE.length);
        }
      }
    }
  });
  it("animates lantern, crystal, nodepad, pool and chains with frames that differ", () => {
    for (const n of ["lantern", "crystal", "nodepad", "pool", "chains"]) {
      const fr = sheet.anims[n];
      expect(fr.length).toBeGreaterThan(1);
      expect(Array.from(fr[0].grid.d)).not.toEqual(Array.from(fr[1].grid.d));
    }
  });
  it("is deterministic and keeps solids a subset of the names", () => {
    const again = buildChainTileset();
    for (const n of CHAIN_TILE_NAMES) expect(Array.from(again.anims[n][0].grid.d)).toEqual(Array.from(sheet.anims[n][0].grid.d));
    for (const s of CHAIN_SOLID) expect(CHAIN_TILE_NAMES).toContain(s);
    for (const w of ["floor", "linkpath", "nodepad", "bridge", "stairs"]) expect(CHAIN_SOLID.has(w as never)).toBe(false);
  });
});
