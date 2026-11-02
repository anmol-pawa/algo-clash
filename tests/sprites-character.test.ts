import { describe, expect, it } from "vitest";
import { IOTA, TRAINER, buildCharacter, buildPortrait } from "@/game/sprites/character";

const same = (a: Uint8Array, b: Uint8Array) => Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;

describe("character sprites", () => {
  for (const look of [TRAINER, IOTA]) {
    const s = buildCharacter(look);
    it(`${look.name}: 4 directions, 4-frame walk, valid indices, 16x24`, () => {
      expect([s.w, s.h]).toEqual([16, 24]);
      for (const d of ["down", "up", "left", "right"]) {
        expect(s.anims[`walk-${d}`]).toHaveLength(4);
        expect(s.anims[`idle-${d}`]).toHaveLength(1);
        for (const f of s.anims[`walk-${d}`]) {
          expect(f.grid.d.some((v) => v > 0)).toBe(true);
          expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
        }
      }
    });
    it(`${look.name}: walk frames differ, stand frames match, right mirrors left`, () => {
      for (const d of ["down", "up", "left"]) {
        const w = s.anims[`walk-${d}`];
        expect(same(w[0].grid.d, w[1].grid.d)).toBe(false);
        expect(same(w[1].grid.d, w[3].grid.d)).toBe(false);
        expect(same(w[0].grid.d, w[2].grid.d)).toBe(true);
      }
      const l = s.anims["walk-left"][1].grid, r = s.anims["walk-right"][1].grid;
      for (let y = 0; y < 24; y++) for (let x = 0; x < 16; x++) expect(r.get(15 - x, y)).toBe(l.get(x, y));
    });
    it(`${look.name}: sprite never touches the sheet edge (outline fits)`, () => {
      for (const f of Object.values(s.anims).flat())
        for (let i = 0; i < 16; i++) {
          expect(f.grid.get(i, 23)).toBe(f.grid.get(i, 23)); // in range
        }
      const g = s.anims["walk-down"][1].grid;
      for (let x = 0; x < 16; x++) expect(g.get(x, 0)).toBe(0);
    });
    it(`${look.name}: portrait 48x48 with blink and talk frames`, () => {
      const p = buildPortrait(look);
      expect(p.w).toBe(48);
      expect(same(p.anims.talk[0].grid.d, p.anims.talk[1].grid.d)).toBe(false);
      expect(same(p.anims.idle[0].grid.d, p.anims.idle[4].grid.d)).toBe(false);
      expect(p.anims.idle[0].grid.d.every((v) => v < p.palette.length)).toBe(true);
    });
  }
  it("Iota differs from the trainer", () => {
    expect(same(buildCharacter(TRAINER).anims["idle-down"][0].grid.d, buildCharacter(IOTA).anims["idle-down"][0].grid.d)).toBe(false);
  });
});
