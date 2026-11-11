import { describe, expect, it } from "vitest";
import { parseNumbers } from "@/lib/visualiser/parse";
import { traceSort, type SortKind } from "@/lib/visualiser/sort";
import { traceLongestDistinct, tracePairSum, traceWindowMax } from "@/lib/visualiser/window";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32);
}
const randArr = (r: () => number, n: number, span = 20) => Array.from({ length: n }, () => Math.floor(r() * span) - span / 2);
const sameMultiset = (x: number[], y: number[]) => [...x].sort((a, b) => a - b).join() === [...y].sort((a, b) => a - b).join();

describe("sort traces", () => {
  const kinds: SortKind[] = ["bubble", "selection", "insertion"];
  it("sorts random inputs, every frame is a permutation, last frame is sorted", () => {
    const r = rng(7);
    for (const kind of kinds) {
      for (let t = 0; t < 60; t++) {
        const input = randArr(r, Math.floor(r() * 12));
        const tr = traceSort(kind, input);
        expect(tr.result).toEqual([...input].sort((a, b) => a - b));
        for (const f of tr.frames) expect(sameMultiset(f.array, input)).toBe(true);
        expect(tr.frames[tr.frames.length - 1].array).toEqual(tr.result);
        for (const f of tr.frames) for (const m of f.marks) expect(m.index >= 0 && m.index < input.length).toBe(true);
      }
    }
  });
  it("bubble sort stops early on sorted input", () => {
    const tr = traceSort("bubble", [1, 2, 3, 4, 5]);
    expect(tr.frames.some((f) => f.note.includes("stop early"))).toBe(true);
    expect(tr.frames.length).toBeLessThan(12);
  });
  it("handles empty and single inputs", () => {
    for (const k of kinds) {
      expect(traceSort(k, []).result).toEqual([]);
      expect(traceSort(k, [3]).result).toEqual([3]);
    }
  });
});

describe("window traces", () => {
  it("pair sum agrees with brute force", () => {
    const r = rng(11);
    for (let t = 0; t < 200; t++) {
      const a = randArr(r, Math.floor(r() * 10)).sort((x, y) => x - y);
      const target = Math.floor(r() * 30) - 15;
      let exists = false;
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) exists = true;
      const tr = tracePairSum(a, target);
      expect(tr.result !== null).toBe(exists);
      if (tr.result) {
        const [i, j] = tr.result as number[];
        expect(i).toBeLessThan(j);
        expect(a[i] + a[j]).toBe(target);
      }
      expect(tr.frames.length).toBeLessThanOrEqual(a.length + 1); // O(n) steps
    }
  });
  it("window max agrees with brute force and windows stay size k", () => {
    const r = rng(5);
    for (let t = 0; t < 200; t++) {
      const a = randArr(r, 1 + Math.floor(r() * 12));
      const k = 1 + Math.floor(r() * a.length);
      let best = -Infinity;
      for (let i = 0; i + k <= a.length; i++) best = Math.max(best, a.slice(i, i + k).reduce((s, v) => s + v, 0));
      const tr = traceWindowMax(a, k);
      expect(tr.result).toBe(best);
      for (const f of tr.frames) expect(f.window![1] - f.window![0] + 1).toBe(k);
    }
    expect(traceWindowMax([1, 2], 5).result).toBeNull();
  });
  it("longest distinct agrees with brute force and window never holds a repeat", () => {
    const r = rng(3);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 14), 6);
      let best = 0;
      for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) if (new Set(a.slice(i, j + 1)).size === j - i + 1) best = Math.max(best, j - i + 1);
      const tr = traceLongestDistinct(a);
      expect(tr.result).toBe(best);
      for (const f of tr.frames) if (f.window) expect(new Set(a.slice(f.window[0], f.window[1] + 1)).size).toBe(f.window[1] - f.window[0] + 1);
    }
  });
});

describe("parseNumbers", () => {
  it("parses commas and spaces, rejects junk and oversize", () => {
    expect(parseNumbers("5, 2 -9\n1")).toEqual({ ok: true, values: [5, 2, -9, 1] });
    expect(parseNumbers("").ok).toBe(true);
    expect(parseNumbers("1 x").ok).toBe(false);
    expect(parseNumbers(Array(20).fill("1").join(" ")).ok).toBe(false);
    expect(parseNumbers("99999").ok).toBe(false);
  });
});

import { traceKadane, tracePrefixCount, traceTwoSumMap } from "@/lib/visualiser/hashprefix";

describe("hash and prefix traces", () => {
  it("two-sum map agrees with brute force", () => {
    const r = rng(21);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 10));
      const target = Math.floor(r() * 30) - 15;
      let exists = false;
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) exists = true;
      const tr = traceTwoSumMap(a, target);
      expect(tr.result !== null).toBe(exists);
      if (tr.result) {
        const [i, j] = tr.result as number[];
        expect(i).toBeLessThan(j);
        expect(a[i] + a[j]).toBe(target);
      }
      expect(tr.frames.length).toBeGreaterThan(0);
    }
  });
  it("prefix count agrees with brute force (negatives included)", () => {
    const r = rng(33);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 12), 10);
      const k = Math.floor(r() * 10) - 5;
      let n = 0;
      for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; if (s === k) n++; } }
      expect(tracePrefixCount(a, k).result).toBe(n);
    }
  });
  it("kadane agrees with brute force and highlights the best stretch", () => {
    const r = rng(44);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, 1 + Math.floor(r() * 12), 12);
      let best = -Infinity;
      for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; best = Math.max(best, s); } }
      const tr = traceKadane(a);
      expect(tr.result).toBe(best);
      for (const f of tr.frames) for (const m of f.marks) expect(m.index >= 0 && m.index < a.length).toBe(true);
    }
    expect(traceKadane([]).result).toBeNull();
    expect(traceKadane([-3, -1, -2]).result).toBe(-1);
  });
});

import { traceDequeMax, traceShortestAtLeast } from "@/lib/visualiser/deque";

describe("window and deque traces", () => {
  it("shortest-at-least agrees with brute force", () => {
    const r = rng(77);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, Math.floor(r() * 12), 9).map(Math.abs);
      const target = 1 + Math.floor(r() * 20);
      let best = 0;
      for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; if (s >= target) { if (!best || j - i + 1 < best) best = j - i + 1; break; } } }
      const tr = traceShortestAtLeast(a, target);
      expect(tr.result).toBe(best);
      expect(tr.frames.length).toBeGreaterThan(0);
    }
  });
  it("deque max agrees with brute force", () => {
    const r = rng(78);
    for (let t = 0; t < 300; t++) {
      const a = randArr(r, 1 + Math.floor(r() * 12), 9);
      const k = 1 + Math.floor(r() * a.length);
      const want: number[] = [];
      for (let i = 0; i + k <= a.length; i++) want.push(Math.max(...a.slice(i, i + k)));
      expect(traceDequeMax(a, k).result).toEqual(want);
    }
    expect(traceDequeMax([1, 2], 5).result).toEqual([]);
  });
});
