import { describe, expect, it } from "vitest";
import { EFFECT_PALETTES, EFFECT_SIZE, effectFrames } from "@/game/battle/effects";
import { EFFECT_FRAMES, type EffectKind } from "@/lib/battle/stagefx";

describe("move effect frames", () => {
  for (const kind of ["slash", "burst", "bolt"] as EffectKind[]) {
    it(`${kind}: ${EFFECT_FRAMES} distinct non-empty frames within the palette`, () => {
      const frames = effectFrames(kind);
      expect(frames).toHaveLength(EFFECT_FRAMES);
      const keys = new Set<string>();
      for (const g of frames) {
        expect(g.w).toBe(EFFECT_SIZE);
        const filled = g.d.reduce((n, v) => n + (v ? 1 : 0), 0);
        expect(filled).toBeGreaterThan(20);
        expect(Math.max(...g.d)).toBeLessThan(EFFECT_PALETTES[kind].length);
        keys.add(g.d.join(","));
      }
      expect(keys.size).toBe(EFFECT_FRAMES);
    });
  }
});
