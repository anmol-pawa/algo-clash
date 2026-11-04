import { describe, expect, it } from "vitest";
import { CHARGE_MS, EVOLUTION_MS, evolutionFrame, flickerPeriod } from "@/lib/evolution/timeline";
import { VECTORLING_PALETTE, buildVectorling } from "@/game/sprites/vectorling";

describe("evolution timeline", () => {
  it("starts as the old form and ends as the new form, done", () => {
    expect(evolutionFrame(0).form).toBe("old");
    const end = evolutionFrame(EVOLUTION_MS);
    expect(end).toMatchObject({ form: "new", white: false, done: true });
  });
  it("swaps forms repeatedly during the flicker and never finishes early", () => {
    const forms = new Set<string>();
    let swaps = 0, prev = "";
    for (let t = CHARGE_MS; t < EVOLUTION_MS - 900; t += 10) {
      const f = evolutionFrame(t);
      expect(f.done).toBe(false);
      forms.add(f.form);
      if (prev && f.form !== prev) swaps++;
      prev = f.form;
    }
    expect(forms.size).toBe(2);
    expect(swaps).toBeGreaterThan(8);
  });
  it("flicker accelerates", () => {
    expect(flickerPeriod(0)).toBeGreaterThan(flickerPeriod(1));
    expect(flickerPeriod(1)).toBeGreaterThan(0);
  });
});

describe("Vectorling sprite", () => {
  for (const view of ["front", "back"] as const) {
    const sheet = buildVectorling(view);
    it(`${view}: 64x64, five animations, valid palette indices, differing idle frames`, () => {
      expect([sheet.w, sheet.h]).toEqual([64, 64]);
      expect(Object.keys(sheet.anims).sort()).toEqual(["attack", "evolve", "faint", "hurt", "idle"]);
      for (const frames of Object.values(sheet.anims)) for (const f of frames) {
        expect(Math.max(...f.grid.d)).toBeLessThan(VECTORLING_PALETTE.length);
        expect(f.grid.d.some((v) => v !== 0)).toBe(true);
      }
      expect(Buffer.compare(Buffer.from(sheet.anims.idle[0].grid.d), Buffer.from(sheet.anims.idle[1].grid.d))).not.toBe(0);
      const fa = sheet.anims.faint;
      expect(fa[fa.length - 1].alpha).toBeLessThan(fa[0].alpha);
    });
  }
});
