import { describe, expect, it } from "vitest";
import { traceKadane, tracePrefixCount, traceTwoSumMap } from "@/lib/visualiser/hashing";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const randArr = (r: () => number, n: number, span = 12) => Array.from({ length: n }, () => Math.floor(r() * span) - span / 2);

describe("hashing traces", () => {
  it("two-sum map agrees with brute force, one pass, table never exceeds n", () => {
    const r = rng(21);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 11));
      const target = Math.floor(r() * 16) - 8;
      let exists = false;
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) exists = true;
      const tr = traceTwoSumMap(a, target);
      expect(tr.result !== null).toBe(exists);
      if (tr.result) {
        const [j, i] = tr.result as number[];
        expect(j).toBeLessThan(i);
        expect(a[j] + a[i]).toBe(target);
      }
      for (const f of tr.frames) expect(f.table!.entries.length).toBeLessThanOrEqual(a.length);
    }
  });
  it("prefix count agrees with brute force, negatives included", () => {
    const r = rng(8);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 13), 8);
      const k = Math.floor(r() * 8) - 4;
      let want = 0;
      for (let i = 0; i < a.length; i++) {
        let s = 0;
        for (let j = i; j < a.length; j++) { s += a[j]; if (s === k) want++; }
      }
      const tr = tracePrefixCount(a, k);
      expect(tr.result).toBe(want);
      expect(tr.frames).toHaveLength(a.length + 1);
    }
  });
  it("kadane agrees with brute force and the window holds the running stretch", () => {
    const r = rng(33);
    for (let t = 1; t < 300; t++) {
      const a = randArr(r, 1 + Math.floor(r() * 12), 14);
      let best = -Infinity;
      for (let i = 0; i < a.length; i++) {
        let s = 0;
        for (let j = i; j < a.length; j++) { s += a[j]; best = Math.max(best, s); }
      }
      const tr = traceKadane(a);
      expect(tr.result).toBe(best);
      for (const f of tr.frames) {
        const [lo, hi] = f.window!;
        expect(a.slice(lo, hi + 1).reduce((x, y) => x + y, 0)).toBe(f.state!.cur);
      }
    }
    expect(traceKadane([]).result).toBeNull();
    expect(traceKadane([-3, -1, -2]).result).toBe(-1);
  });
});
