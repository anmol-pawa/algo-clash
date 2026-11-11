import { describe, expect, it } from "vitest";
import { HYDRA_PALETTE, buildHydra } from "@/game/sprites/hydra";

describe("Hydra of Hashwood sprite", () => {
  const sheet = buildHydra();
  it("is 96x96 with idle, attack, hurt and faint animations", () => {
    expect([sheet.w, sheet.h]).toEqual([96, 96]);
    expect(Object.keys(sheet.anims).sort()).toEqual(["attack", "faint", "hurt", "idle"]);
    expect(sheet.anims.idle.length).toBeGreaterThanOrEqual(2);
    expect(sheet.anims.attack.length).toBeGreaterThanOrEqual(3);
  });
  it("only uses palette indices and has opaque pixels in every frame", () => {
    for (const frames of Object.values(sheet.anims)) for (const f of frames) {
      expect(f.grid.w).toBe(96);
      expect(Math.max(...f.grid.d)).toBeLessThan(HYDRA_PALETTE.length);
      expect(f.grid.d.some((v) => v !== 0)).toBe(true);
    }
  });
  it("faint fades out and frames differ between idle poses", () => {
    const fa = sheet.anims.faint;
    expect(fa[fa.length - 1].alpha).toBeLessThan(fa[0].alpha);
    expect(Buffer.compare(Buffer.from(sheet.anims.idle[0].grid.d), Buffer.from(sheet.anims.idle[1].grid.d))).not.toBe(0);
  });
});
