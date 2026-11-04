import { describe, expect, it } from "vitest";
import { applyAttempt, DAY_MS, dueItems, emptyMastery, markSeen, tierIndex, tierOf, type SolveEvent } from "@/lib/srs/scheduler";
import { capMultiplier, overdueDays, RUST_MULTIPLIER_CAP, rustLevel } from "@/lib/srs/rust";
import { itemScore, patternMastery, structlingLevel } from "@/lib/srs/aggregate";
import { sanitizeCore } from "@/lib/save/schema";
import type { ProblemMastery } from "@/lib/save/schema";

const T0 = 1_700_000_000_000;
const PAR = 600;
const ok = (at: number, o: Partial<SolveEvent> = {}): SolveEvent => ({ at, solved: true, assisted: false, seconds: 300, parSeconds: PAR, ...o });

describe("mastery ladder", () => {
  it("walks unseen → seen → learning → practiced → mastered with the GDD intervals", () => {
    let m = markSeen(emptyMastery());
    expect(tierOf(m)).toBe("seen");
    m = applyAttempt(m, ok(T0));
    expect([tierOf(m), m.intervalDays, m.due]).toEqual(["learning", 1, T0 + DAY_MS]);
    m = applyAttempt(m, ok(m.due));
    expect([tierOf(m), m.intervalDays]).toEqual(["practiced", 3]);
    m = applyAttempt(m, ok(m.due, { seconds: 1000 })); // 3rd spaced solve but slower than 2x par? 1000 < 1200 so it is mastered
    expect([tierOf(m), m.intervalDays]).toEqual(["mastered", 16]);
  });

  it("a third solve over 2x par stays practiced with a 7 day interval", () => {
    let m = applyAttempt(emptyMastery(), ok(T0));
    m = applyAttempt(m, ok(m.due));
    m = applyAttempt(m, ok(m.due, { seconds: 1300 }));
    expect([tierOf(m), m.intervalDays]).toEqual(["practiced", 7]);
  });

  it("ingrained needs a blank solve under par after 30 days", () => {
    let m = applyAttempt(emptyMastery(), ok(T0));
    m = applyAttempt(m, ok(m.due));
    m = applyAttempt(m, ok(m.due));
    expect(tierOf(m)).toBe("mastered");
    const early = applyAttempt(m, ok(m.due, { seconds: 100, fromBlank: true }));
    expect(tierOf(early)).toBe("mastered"); // first solve only ~5 days ago
    const late = applyAttempt({ ...m, due: T0 + 40 * DAY_MS }, ok(T0 + 40 * DAY_MS, { seconds: 100, fromBlank: true }));
    expect([tierOf(late), late.intervalDays]).toEqual(["ingrained", 35]);
    const notBlank = applyAttempt({ ...m, due: T0 + 40 * DAY_MS }, ok(T0 + 40 * DAY_MS, { seconds: 100 }));
    expect(tierOf(notBlank)).toBe("mastered");
    const again = applyAttempt(late, ok(late.due, { seconds: 100, fromBlank: true }));
    expect(again.intervalDays).toBe(53); // 35 * 1.5 = 52.5, rounded
  });

  it("assisted solves never advance and reschedule one day later", () => {
    const m = applyAttempt(emptyMastery(), ok(T0, { assisted: true }));
    expect([tierOf(m), m.due]).toEqual(["seen", T0 + DAY_MS]);
    const l = applyAttempt(applyAttempt(emptyMastery(), ok(T0)), ok(T0 + DAY_MS, { assisted: true }));
    expect(tierOf(l)).toBe("learning");
    expect(l.due).toBe(T0 + 2 * DAY_MS);
  });

  it("cramming before the due date earns nothing", () => {
    const m = applyAttempt(emptyMastery(), ok(T0));
    const c = applyAttempt(m, ok(T0 + 1000));
    expect([tierOf(c), c.due, c.intervalDays]).toEqual(["learning", m.due, m.intervalDays]);
  });

  it("a failed review drops one tier and is due in a day; a failed first try only marks Seen", () => {
    let m = applyAttempt(emptyMastery(), ok(T0));
    m = applyAttempt(m, ok(m.due));
    const f = applyAttempt(m, { ...ok(m.due), solved: false });
    expect([tierOf(f), f.due]).toEqual(["learning", m.due + DAY_MS]);
    expect(tierOf(applyAttempt(emptyMastery(), { ...ok(T0), solved: false }))).toBe("seen");
  });

  it("normalises legacy states and never mutates its input", () => {
    expect(tierOf({ state: "solved", solves: 1 })).toBe("learning");
    expect(tierOf({ state: "rusty", solves: 3 })).toBe("practiced");
    const m = emptyMastery();
    const frozen = Object.freeze({ ...m });
    expect(() => applyAttempt(frozen, ok(T0))).not.toThrow();
  });

  it("dueItems lists overdue learned items, most overdue first", () => {
    const a = applyAttempt(emptyMastery(), ok(T0));
    const b = applyAttempt(emptyMastery(), ok(T0 - 3 * DAY_MS));
    const c = markSeen(emptyMastery());
    expect(dueItems({ a, b, c }, T0 + 5 * DAY_MS)).toEqual(["b", "a"]);
    expect(dueItems({ a }, T0)).toEqual([]);
  });
});

describe("properties (seeded random histories)", () => {
  function rng(seed: number) {
    return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  }
  it("holds invariants over 300 random histories", () => {
    for (let s = 1; s <= 300; s++) {
      const r = rng(s);
      let m: ProblemMastery = emptyMastery();
      let at = T0;
      for (let i = 0; i < 25; i++) {
        at += Math.floor(r() * 12 * DAY_MS);
        const ev: SolveEvent = { at, solved: r() < 0.75, assisted: r() < 0.3, seconds: Math.floor(r() * 2000), parSeconds: PAR, fromBlank: r() < 0.5 };
        const before = m;
        m = applyAttempt(before, ev);
        if (ev.solved && ev.assisted) expect(tierIndex(tierOf(m))).toBeLessThanOrEqual(Math.max(tierIndex(tierOf(before)), 1));
        if (ev.solved && ev.assisted && tierIndex(tierOf(before)) >= 2) expect(tierOf(m)).toBe(tierOf(before));
        if (tierIndex(tierOf(m)) >= 2) expect(m.due).toBeGreaterThan(0);
        expect(Number.isFinite(m.due) && m.intervalDays >= 0 && m.intervalDays <= 180).toBe(true);
        expect(tierIndex(tierOf(m)) - tierIndex(tierOf(before))).toBeLessThanOrEqual(1 + (tierOf(before) === "unseen" ? 1 : 0));
      }
    }
  });
});

describe("rust", () => {
  const learned = applyAttempt(emptyMastery(), ok(T0)); // due T0+1d, interval 1
  it("is clear before the due date and grows with lateness", () => {
    expect(rustLevel(learned, T0 + DAY_MS)).toBe(0);
    expect(rustLevel(learned, T0 + DAY_MS + 60_000)).toBe(1);
    expect(overdueDays(learned, T0 + 4 * DAY_MS)).toBe(3);
    expect(rustLevel(learned, T0 + 4 * DAY_MS)).toBe(2);
    expect(rustLevel(emptyMastery(), T0 + 99 * DAY_MS)).toBe(0);
  });
  it("is monotonic in time", () => {
    let last = 0;
    for (let d = 0; d < 60; d++) {
      const lv = rustLevel(learned, T0 + d * DAY_MS);
      expect(lv).toBeGreaterThanOrEqual(last);
      last = lv;
    }
  });
  it("caps the type multiplier only while rusty", () => {
    expect(capMultiplier(2, 1)).toBe(RUST_MULTIPLIER_CAP);
    expect(capMultiplier(2, 0)).toBe(2);
    expect(capMultiplier(1, 2)).toBe(1);
  });
});

describe("aggregation", () => {
  const mastered = (() => {
    let m = applyAttempt(emptyMastery(), ok(T0));
    m = applyAttempt(m, ok(m.due));
    return applyAttempt(m, ok(m.due));
  })();
  it("weights hards over easies and counts rust", () => {
    const items = [{ id: "e", difficulty: "E" as const }, { id: "h", difficulty: "H" as const }];
    const fresh = T0 + 5 * DAY_MS;
    expect(patternMastery(items, { e: mastered }, fresh)).toBeCloseTo(0.85 / 4, 5);
    expect(patternMastery(items, { h: mastered }, fresh)).toBeCloseTo((0.85 * 3) / 4, 5);
    expect(itemScore(mastered, mastered.due + 30 * DAY_MS)).toBeCloseTo(0.85 * 0.6, 5);
    expect(patternMastery([], {}, T0)).toBe(0);
  });
  it("structling level is the average of move mastery times 10", () => {
    expect(structlingLevel(["a", "b"], { a: mastered }, T0 + 5 * DAY_MS)).toBeCloseTo(4.3, 1);
    expect(structlingLevel([], {}, T0)).toBe(0);
  });
});

describe("save compatibility", () => {
  it("keeps new SRS fields and sanitises junk", () => {
    const c = sanitizeCore({ mastery: { p: { state: "practiced", solves: 2, spacedSolves: 2.4, firstSolvedAt: 5 }, q: { state: "ingrained", spacedSolves: "x" } } }, T0);
    expect(c.mastery.p).toMatchObject({ state: "practiced", spacedSolves: 2, firstSolvedAt: 5 });
    expect(c.mastery.q.spacedSolves).toBeUndefined();
  });
});
