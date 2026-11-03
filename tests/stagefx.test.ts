import { describe, expect, it } from "vitest";
import { HITSTOP_MS, INTRO_MS, NUMBER_MS, STINGER_MS, createFx, hitFoe, hitPlayer, shakeFor, shakeOffset, showVerdict, slideOffset, tick } from "@/lib/battle/stagefx";

describe("stage effects", () => {
  it("slides in over the intro and settles at zero offset", () => {
    const fx = createFx();
    expect(slideOffset(fx.intro)).toBe(1);
    tick(fx, INTRO_MS);
    expect(fx.intro).toBe(1);
    expect(slideOffset(fx.intro)).toBe(0);
    expect(slideOffset(0.5, 0.5)).toBe(1);
  });
  it("hit-stop freezes the clock, then resumes", () => {
    const fx = createFx();
    hitFoe(fx, 25);
    expect(fx.hitstop).toBe(HITSTOP_MS);
    tick(fx, 40);
    expect(fx.time).toBe(0);
    tick(fx, 40);
    expect(fx.hitstop).toBe(0);
    tick(fx, 50);
    expect(fx.time).toBe(50);
  });
  it("damage drains the foe bar gradually and faints at zero", () => {
    const fx = createFx(5, 100);
    hitFoe(fx, 30);
    expect(fx.hp.foe.target).toBe(70);
    expect(fx.pose.foe.name).toBe("hurt");
    tick(fx, 100);
    tick(fx, 100);
    expect(fx.hp.foe.shown).toBeLessThan(100);
    expect(fx.hp.foe.shown).toBeGreaterThanOrEqual(70);
    tick(fx, 5000);
    expect(fx.hp.foe.shown).toBe(70);
    expect(fx.pose.foe.name).toBe("idle");
    hitFoe(fx, 500);
    expect(fx.hp.foe.target).toBe(0);
    expect(fx.pose.foe.name).toBe("faint");
    tick(fx, 5000);
    expect(fx.pose.foe.name).toBe("faint");
  });
  it("a wrong submission costs hearts and never below zero", () => {
    const fx = createFx(2, 100);
    hitPlayer(fx);
    hitPlayer(fx);
    hitPlayer(fx);
    expect(fx.hp.player.target).toBe(0);
    expect(fx.pose.player.name).toBe("faint");
    expect(fx.pose.foe.name).toBe("attack");
  });
  it("damage numbers and stingers expire", () => {
    const fx = createFx();
    hitFoe(fx, 10, true);
    showVerdict(fx, "AC");
    expect(fx.numbers).toHaveLength(1);
    tick(fx, HITSTOP_MS);
    tick(fx, NUMBER_MS + 1);
    expect(fx.numbers).toHaveLength(0);
    expect(fx.stinger).not.toBeNull();
    tick(fx, STINGER_MS);
    expect(fx.stinger).toBeNull();
  });
  it("shake scales with damage, decays and is zero at rest", () => {
    expect(shakeFor(80, 100)).toBeGreaterThan(shakeFor(10, 100));
    const fx = createFx();
    expect(shakeOffset(fx)).toEqual({ x: 0, y: 0 });
    hitFoe(fx, 100);
    tick(fx, HITSTOP_MS);
    tick(fx, 16);
    expect(fx.shake).toBeGreaterThan(0);
    tick(fx, 2000);
    expect(fx.shake).toBe(0);
  });
});
