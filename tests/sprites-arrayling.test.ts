import { describe, expect, it } from "vitest";
import { buildArrayling } from "@/game/sprites/arrayling";

describe("Arrayling sprite sheets", () => {
  for (const view of ["front", "back"] as const) {
    const s = buildArrayling(view);
    it(`${view}: has all animations, valid indices, non-empty, 64x64`, () => {
      expect(s.w).toBe(64);
      for (const a of ["idle", "attack", "hurt", "faint", "evolve"]) {
        expect(s.anims[a].length).toBeGreaterThanOrEqual(2);
        for (const f of s.anims[a]) {
          expect(f.grid.d.some((v) => v > 0)).toBe(true);
          expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
          expect(f.alpha).toBeGreaterThan(0);
        }
      }
      expect(s.anims.idle.length).toBeGreaterThanOrEqual(4);
    });
    it(`${view}: idle frames differ and the sprite uses 3+ shade levels`, () => {
      const [a, b] = s.anims.idle;
      expect(Buffer.compare(Buffer.from(a.grid.d), Buffer.from(b.grid.d))).not.toBe(0);
      const used = new Set(a.grid.d);
      expect([2, 3, 4, 5, 6].filter((i) => used.has(i)).length).toBeGreaterThanOrEqual(3);
    });
    it(`${view}: hurt/evolve flash is a pure white silhouette`, () => {
      const used = new Set(s.anims.evolve[0].grid.d);
      expect([...used].sort()).toEqual([0, 14]);
    });
  }
  it("front and back differ", () => {
    const f = buildArrayling("front").anims.idle[0].grid.d, b = buildArrayling("back").anims.idle[0].grid.d;
    expect(Buffer.compare(Buffer.from(f), Buffer.from(b))).not.toBe(0);
  });
});
