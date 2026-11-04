import { describe, expect, it } from "vitest";
import { EVOLVE_TOTAL_MS, evolveState, flipAt } from "@/lib/evolution/timeline";
import { applyEvolution, speciesStage } from "@/lib/evolution/progress";
import { buildVectorling, VECTORLING_PALETTE } from "@/game/sprites/vectorling";
import { applyGymWin } from "@/lib/gym/progress";
import { syntaxShoresGym } from "@/content/gyms/r0";
import type { CoreSave } from "@/lib/save/schema";

const core = (flags: CoreSave["flags"] = {}): CoreSave => ({ flags } as CoreSave);

describe("evolution timeline", () => {
  it("starts as the old form and ends as the new form", () => {
    expect(evolveState(0)).toMatchObject({ phase: "intro", sprite: "old", white: false });
    expect(evolveState(EVOLVE_TOTAL_MS)).toMatchObject({ phase: "done", sprite: "new", white: false, flash: 0 });
  });
  it("goes through intro, morph, flash, reveal in order", () => {
    const order: string[] = [];
    for (let t = 0; t <= EVOLVE_TOTAL_MS; t += 20) {
      const p = evolveState(t).phase;
      if (order[order.length - 1] !== p) order.push(p);
    }
    expect(order).toEqual(["intro", "morph", "flash", "reveal", "done"]);
  });
  it("the morph flips between silhouettes ever faster and ends on the new form", () => {
    const flips: number[] = [];
    let prev = flipAt(0);
    for (let i = 1; i <= 1000; i++) { const s = flipAt(i / 1000); if (s !== prev) flips.push(i / 1000); prev = s; }
    expect(flips.length).toBeGreaterThanOrEqual(6);
    const gaps = flips.slice(1).map((f, i) => f - flips[i]);
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeLessThanOrEqual(gaps[i - 1] + 0.002);
  });
  it("the flash peaks at 1 and reduced motion skips to the end", () => {
    const peak = Math.max(...Array.from({ length: 100 }, (_, i) => evolveState(1200 + 2400 + i * 4).flash));
    expect(peak).toBeGreaterThan(0.95);
    expect(evolveState(100, true).phase).toBe("done");
  });
});

describe("evolution progress", () => {
  it("defaults to stage 1, raises idempotently and never lowers", () => {
    expect(speciesStage(core(), "arrayling")).toBe(1);
    const a = applyEvolution(core(), "arrayling", 2);
    expect(speciesStage(a, "arrayling")).toBe(2);
    expect(applyEvolution(a, "arrayling", 2)).toBe(a);
    expect(applyEvolution(a, "arrayling", 1)).toBe(a);
  });
  it("composes with the gym win", () => {
    const c = applyEvolution(applyGymWin(core(), syntaxShoresGym), "arrayling", 2);
    expect(c.flags["badge:" + syntaxShoresGym.badge.id]).toBe(true);
    expect(speciesStage(c, "arrayling")).toBe(2);
  });
});

describe("Vectorling sprite", () => {
  for (const view of ["front", "back"] as const) {
    const sheet = buildVectorling(view);
    it(`${view}: 64x64, all five animations, valid palette`, () => {
      expect([sheet.w, sheet.h]).toEqual([64, 64]);
      expect(Object.keys(sheet.anims).sort()).toEqual(["attack", "evolve", "faint", "hurt", "idle"]);
      for (const frames of Object.values(sheet.anims)) for (const f of frames) {
        expect(Math.max(...f.grid.d)).toBeLessThan(VECTORLING_PALETTE.length);
        expect(f.grid.d.some((v) => v !== 0)).toBe(true);
      }
      expect(Buffer.compare(Buffer.from(sheet.anims.idle[0].grid.d), Buffer.from(sheet.anims.idle[1].grid.d))).not.toBe(0);
    });
  }
});
