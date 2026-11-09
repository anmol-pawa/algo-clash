import { describe, expect, it } from "vitest";
import { BUDGET_TABLE, budgetFor, fits, opCount } from "../lib/complexity/constraints";
import { KNOWN, evaluate, ratioSettles, solve } from "../lib/complexity/recurrence";

describe("constraint table", () => {
  it("maps n to the slowest class that fits", () => {
    expect(budgetFor(8).fits).toBe("O(n!)");
    expect(budgetFor(20).fits).toBe("O(2^n)");
    expect(budgetFor(21).fits).toBe("O(n^3)");
    expect(budgetFor(500).fits).toBe("O(n^3)");
    expect(budgetFor(5000).fits).toBe("O(n^2)");
    expect(budgetFor(100_000).fits).toBe("O(n log n)");
    expect(budgetFor(1_000_000).fits).toBe("O(n log n)");
    expect(budgetFor(10_000_000).fits).toBe("O(n)");
    expect(budgetFor(1e12).fits).toBe("O(log n) or O(1)");
    expect(() => budgetFor(0)).toThrow();
  });
  it("is consistent with the operation counts at each boundary", () => {
    expect(fits("n!", 10)).toBe(true);
    expect(fits("n!", 12)).toBe(false);
    expect(fits("2^n", 20)).toBe(true);
    expect(fits("n^3", 500)).toBe(true);
    expect(fits("n^3", 5000)).toBe(false);
    expect(fits("n^2", 5000)).toBe(true);
    expect(fits("n^2", 100_000)).toBe(false);
    expect(fits("n log n", 1_000_000)).toBe(true);
    expect(fits("n", 100_000_000)).toBe(true);
    expect(opCount("n!", 5)).toBe(120);
    expect(BUDGET_TABLE.map((r) => r.maxN)).toEqual([...BUDGET_TABLE.map((r) => r.maxN)].sort((x, y) => x - y));
  });
});

describe("recurrence solver", () => {
  it("solves the textbook shapes", () => {
    const t = (i: number) => solve(KNOWN[i].rec).theta;
    expect(t(0)).toBe("Θ(log n)");
    expect(t(1)).toBe("Θ(n log n)");
    expect(t(2)).toBe("Θ(n)");
    expect(t(3)).toBe("Θ(n)");
    expect(t(4)).toBe("Θ(n^2)");
    expect(t(5)).toBe("Θ(n^1.585)");
  });
  it("reports the master-theorem case and handles log factors", () => {
    expect(solve({ a: 2, b: 2, c: 0 }).case).toBe(1);
    expect(solve({ a: 2, b: 2, c: 1 }).case).toBe(2);
    expect(solve({ a: 1, b: 2, c: 1 }).case).toBe(3);
    expect(solve({ a: 2, b: 2, c: 1, k: 1 }).theta).toBe("Θ(n log^2 n)");
    expect(solve({ a: 1, b: 2, c: 0, k: 0 }).theta).toBe("Θ(log n)");
    expect(() => solve({ a: 2, b: 1, c: 1 })).toThrow();
  });
  it("matches the evaluated recurrence numerically", () => {
    expect(evaluate({ a: 2, b: 2, c: 1 }, 8)).toBe(32); // 8·log2(8)+8
    for (const k of KNOWN) expect(ratioSettles(k.rec, solve(k.rec)), k.name).toBe(true);
    const wrong = { nExp: 2, logExp: 0, case: 3 as const, theta: "Θ(n^2)" };
    expect(ratioSettles({ a: 2, b: 2, c: 1 }, wrong)).toBe(false);
  });
});
