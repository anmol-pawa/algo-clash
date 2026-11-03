import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allGyms, syntaxShoresGym as gym } from "../content/gyms/r0";
import { FOE_MAX_HP } from "../lib/battle/damage";
import { GymError, SHIELD_MAX, SHIELD_START, answerBlitz, battleResult, shuffledOptions, blitzCorrect, coreFoeHp, startGym } from "../lib/gym/machine";
import { applyGymWin, blitzSecondsLeft, hasBadge, SHARDS_FLAG } from "../lib/gym/progress";
import { newCoreSave } from "../lib/save/schema";
import type { GymState } from "../lib/gym/types";

const answerAll = (s: GymState, right: boolean, seconds = 5): GymState => {
  for (const item of gym.blitz) s = answerBlitz(gym, s, right ? item.answer : item.options.find((o) => o !== item.answer)!, seconds);
  return s;
};

describe("gym content", () => {
  for (const g of allGyms) {
    it(`${g.id}: items are well formed`, () => {
      expect(g.blitz).toHaveLength(8);
      expect(g.blitz.filter((b) => b.review)).toHaveLength(2);
      expect(new Set(g.blitz.map((b) => b.id)).size).toBe(g.blitz.length);
      for (const b of g.blitz) {
        expect(b.options).toHaveLength(4);
        expect(new Set(b.options).size).toBe(4);
        expect(b.options.filter((o) => o === b.answer)).toHaveLength(1);
        expect(b.why.length).toBeGreaterThan(10);
      }
    });
    it(`${g.id}: shuffled options are a stable permutation and the answer moves around`, () => {
      const slots = new Set<number>();
      for (const b of g.blitz) {
        const o = shuffledOptions(b, 7);
        expect([...o].sort()).toEqual([...b.options].sort());
        expect(shuffledOptions(b, 7)).toEqual(o);
        slots.add(o.indexOf(b.answer));
      }
      expect(slots.size).toBeGreaterThan(1);
    });
    it(`${g.id}: core and signature problems exist and differ`, () => {
      for (const id of [g.coreProblemId, g.signatureProblemId]) expect(existsSync(join(process.cwd(), "content", "problems", g.region, id, "solution.cpp"))).toBe(true);
      expect(g.coreProblemId).not.toBe(g.signatureProblemId);
    });
  }
});

describe("gym machine", () => {
  it("starts in the blitz with the starting shield", () => {
    const s = startGym(gym);
    expect(s.phase).toBe("blitz");
    expect(s.shield).toBe(SHIELD_START);
  });
  it("correct answers break the shield; a miss regenerates it", () => {
    let s = startGym(gym);
    s = answerBlitz(gym, s, gym.blitz[0].answer, 3);
    expect(s.shield).toBe(SHIELD_START - 1);
    s = answerBlitz(gym, s, null, 20);
    expect(s.shield).toBe(SHIELD_START);
    expect(s.answers[1].correct).toBe(false);
  });
  it("a right answer after the time limit is a miss", () => {
    const s = answerBlitz(gym, startGym(gym), gym.blitz[0].answer, gym.blitzSeconds + 0.1);
    expect(s.answers[0].correct).toBe(false);
    expect(s.shield).toBe(SHIELD_START + 1);
  });
  it("rejects an unknown option and answers after the blitz", () => {
    expect(() => answerBlitz(gym, startGym(gym), "nonsense", 1)).toThrow(GymError);
    const done = answerAll(startGym(gym), true);
    expect(done.phase).toBe("core");
    expect(() => answerBlitz(gym, done, null, 1)).toThrow(GymError);
  });
  it("shield stays within bounds", () => {
    expect(answerAll(startGym(gym), false).shield).toBe(SHIELD_MAX);
    expect(answerAll(startGym(gym), true).shield).toBe(0);
  });
  it("the head start scales with the shield and never exceeds full HP", () => {
    expect(coreFoeHp(answerAll(startGym(gym), true))).toBe(FOE_MAX_HP - 8 * SHIELD_START);
    expect(coreFoeHp(answerAll(startGym(gym), false))).toBe(FOE_MAX_HP);
    expect(blitzCorrect(answerAll(startGym(gym), true))).toBe(8);
  });
  it("walks core then signature to a win with the badge and a shard", () => {
    let s = answerAll(startGym(gym), true);
    s = battleResult(gym, s, "won");
    expect(s.phase).toBe("signature");
    s = battleResult(gym, s, "won");
    expect(s.phase).toBe("won");
    expect(s.reward).toEqual({ badge: "badge-lighthouse", shards: 1 });
  });
  it("a faint retries the same phase and keeps the blitz", () => {
    let s = answerAll(startGym(gym), true);
    s = battleResult(gym, s, "fainted");
    expect(s.phase).toBe("core");
    expect(s.coreFaints).toBe(1);
    expect(s.answers).toHaveLength(8);
    s = battleResult(gym, s, "won");
    s = battleResult(gym, s, "fainted");
    expect(s.phase).toBe("signature");
    expect(s.signatureFaints).toBe(1);
  });
  it("retreating abandons the gym; no battle outside phases 2 and 3", () => {
    const s = battleResult(gym, answerAll(startGym(gym), true), "retreated");
    expect(s.phase).toBe("abandoned");
    expect(s.reward).toBeNull();
    expect(() => battleResult(gym, startGym(gym), "won")).toThrow(GymError);
    expect(() => battleResult(gym, s, "won")).toThrow(GymError);
  });
});

describe("gym persistence", () => {
  it("a win records the badge and one shard, and a rematch pays nothing more", () => {
    const c0 = newCoreSave(0);
    expect(hasBadge(c0, gym)).toBe(false);
    const c1 = applyGymWin(c0, gym);
    expect(hasBadge(c1, gym)).toBe(true);
    expect(c1.flags[SHARDS_FLAG]).toBe(1);
    expect(applyGymWin(c1, gym)).toBe(c1);
    expect(c0.flags).toEqual({});
  });
  it("blitz seconds count down and clamp at zero", () => {
    expect(blitzSecondsLeft(1000, 1000, 20)).toBe(20);
    expect(blitzSecondsLeft(1000, 6500, 20)).toBe(15);
    expect(blitzSecondsLeft(1000, 99999, 20)).toBe(0);
  });
  it("kits match the problem packages", async () => {
    const { gymKits } = await import("../content/gyms/kits");
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) {
      const kit = gymKits[id];
      expect(kit).toBeDefined();
      expect(kit.statement).toBe(readFileSync(join(process.cwd(), "content", "problems", "R0", id, "problem.md"), "utf8"));
      expect(kit.starter.length).toBeGreaterThan(20);
    }
  });
});
