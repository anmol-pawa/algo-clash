import { describe, expect, it } from "vitest";
import { HARBOR_SOLID, HARBOR_TILE, HARBOR_TILE_NAMES, buildHarborTileset } from "@/game/sprites/harborTiles";

const eq = (a: Uint8Array, b: Uint8Array) => Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;

describe("Hashwood Harbor tileset", () => {
  const s = buildHarborTileset();
  it("has every tile at 16x16 with valid palette indices", () => {
    expect([s.w, s.h]).toEqual([HARBOR_TILE, HARBOR_TILE]);
    for (const n of HARBOR_TILE_NAMES) {
      expect(s.anims[n].length).toBeGreaterThan(0);
      for (const f of s.anims[n]) {
        expect(f.grid.w).toBe(HARBOR_TILE);
        expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
      }
    }
  });
  it("every tile is fully opaque", () => {
    for (const n of HARBOR_TILE_NAMES) for (const f of s.anims[n]) expect(f.grid.d.every((v) => v > 0)).toBe(true);
  });
  it("water, shore, boat, dock edge and lamp animate; static tiles have one frame", () => {
    for (const n of ["water", "dockEdge", "shore", "boat", "lamp"] as const) {
      expect(s.anims[n].length).toBeGreaterThan(1);
      expect(eq(s.anims[n][0].grid.d, s.anims[n][1].grid.d)).toBe(false);
    }
    expect(s.anims.crate).toHaveLength(1);
  });
  it("is deterministic and sand variants differ", () => {
    const t = buildHarborTileset();
    for (const n of HARBOR_TILE_NAMES) expect(eq(t.anims[n][0].grid.d, s.anims[n][0].grid.d)).toBe(true);
    expect(eq(s.anims.sand[0].grid.d, s.anims.sand2[0].grid.d)).toBe(false);
  });
  it("solid set names real tiles; ground tiles are walkable", () => {
    for (const n of HARBOR_SOLID) expect(HARBOR_TILE_NAMES).toContain(n);
    for (const n of ["sand", "sand2", "cobble", "planks", "dockEdge", "shore", "door"] as const)
      expect(HARBOR_SOLID.has(n)).toBe(false);
  });
});
