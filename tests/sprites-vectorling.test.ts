import { describe, expect, it } from "vitest";
import { buildVectorling } from "@/game/sprites/vectorling";
import { buildArrayling } from "@/game/sprites/arrayling";
import { evolutionSteps } from "@/game/sprites/morph";

describe("Vectorling sprite sheets", () => {
  for (const view of ["front", "back"] as const) {
    const s = buildVectorling(view);
    it(`${view}: all animations, valid indices, 64x64, 3+ shade levels`, () => {
      expect(s.w).toBe(64);
      for (const a of ["idle", "attack", "hurt", "faint", "evolve"]) {
        expect(s.anims[a].length).toBeGreaterThanOrEqual(2);
        for (const f of s.anims[a]) {
          expect(f.grid.d.some((v) => v > 0)).toBe(true);
          expect(f.grid.d.every((v) => v < s.palette.length)).toBe(true);
        }
      }
      expect(s.anims.idle.length).toBeGreaterThanOrEqual(4);
      const used = new Set(s.anims.idle[0].grid.d);
      expect([2, 3, 4, 5, 6].filter((i) => used.has(i)).length).toBeGreaterThanOrEqual(3);
      expect([...new Set(s.anims.evolve[0].grid.d)].sort()).toEqual([0, 14]);
    });
  }
  it("differs from the Arrayling", () => {
    const a = buildArrayling("front").anims.idle[0].grid.d, v = buildVectorling("front").anims.idle[0].grid.d;
    expect(Buffer.compare(Buffer.from(a), Buffer.from(v))).not.toBe(0);
  });
});

describe("evolution morph", () => {
  const from = buildArrayling("front").anims.idle[0].grid, to = buildVectorling("front").anims.idle[0].grid;
  const steps = evolutionSteps(from, to);
  it("starts as the old form and ends as the new one", () => {
    expect(steps[0].grid).toBe(from);
    expect(steps[steps.length - 1].grid).toBe(to);
  });
  it("passes through pure white silhouettes only in the middle", () => {
    const mid = steps.slice(6, 12);
    for (const s of mid) expect([...new Set(s.grid.d)].every((v) => v === 0 || v === 14)).toBe(true);
  });
  it("final opaque pixel count equals the target", () => {
    const opaque = (g: { d: Uint8Array }) => g.d.filter(Boolean).length;
    expect(opaque(steps[steps.length - 1].grid)).toBe(opaque(to));
    expect(steps.every((s) => s.ms > 0)).toBe(true);
  });
});
