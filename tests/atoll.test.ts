import { describe, expect, it } from "vitest";
import { ATOLL_PALETTE, ATOLL_SOLID, ATOLL_TILE, ATOLL_TILE_NAMES, buildAtollTileset } from "@/game/sprites/atoll";
import { ATOLL } from "@/lib/overworld/atoll";
import { ENCOUNTER_TILES, parseMap } from "@/lib/overworld/map";
import { findPath } from "@/lib/overworld/walk";
import { MAINVILLE_DIALOGUES } from "@/lib/dialogue/mainville";

describe("Array Atoll tileset", () => {
  const s = buildAtollTileset();
  it("has every tile at 16x16 with valid palette indices and no holes", () => {
    expect([s.w, s.h]).toEqual([ATOLL_TILE, ATOLL_TILE]);
    for (const n of ATOLL_TILE_NAMES) for (const f of s.anims[n]) {
      expect(f.grid.d.every((v) => v > 0 && v < ATOLL_PALETTE.length)).toBe(true);
    }
  });
  it("animates water, shore and tide pools, and is deterministic", () => {
    for (const n of ["water", "deepWater", "shore"]) expect(s.anims[n]).toHaveLength(4);
    const a = s.anims.shore[0].grid.d, b = s.anims.shore[2].grid.d;
    expect(Buffer.compare(Buffer.from(a), Buffer.from(b))).not.toBe(0);
    const t = buildAtollTileset();
    for (const n of ATOLL_TILE_NAMES) expect(Buffer.compare(Buffer.from(t.anims[n][0].grid.d), Buffer.from(s.anims[n][0].grid.d))).toBe(0);
  });
  it("solid set names real tiles", () => {
    for (const n of ATOLL_SOLID) expect(ATOLL_TILE_NAMES).toContain(n);
    expect(ATOLL_SOLID.has("boardwalk")).toBe(false);
  });
});

describe("Array Atoll map", () => {
  const map = parseMap(ATOLL);
  it("parses with only known tiles and a Tide Hall door", () => {
    for (const row of map.tiles) for (const t of row) expect(ATOLL_TILE_NAMES).toContain(t);
    expect(map.tiles[ATOLL.doors![0].y][ATOLL.doors![0].x]).toBe("hutDoor");
    expect(ENCOUNTER_TILES.has("tidePool")).toBe(true);
    expect(MAINVILLE_DIALOGUES[ATOLL.signs![0].dialogue]).toBeDefined();
  });
  it("lets the player walk from the spawn to the door and to a tide pool", () => {
    const goal = (x: number, y: number) => findPath(map, map.spawn, { x, y });
    expect(goal(8, 4).length).toBeGreaterThan(0);
    expect(goal(11, 4).length).toBeGreaterThan(0);
  });
});
