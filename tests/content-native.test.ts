import { describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compileNative, runNative, findPackages } from "@/lib/content/native";
import { makeRng, seedFor } from "@/lib/content/rng";
import type { FunctionSpec } from "@/lib/judge/harness/driver";

const spec: FunctionSpec = { kind: "function", name: "addOne", returns: "int", params: [{ type: "int", name: "x" }] };
const cache = mkdtempSync(join(tmpdir(), "native-"));

describe("rng", () => {
  it("is deterministic per seed and respects bounds", () => {
    const a = makeRng(42).ints(50, -5, 5);
    expect(a).toEqual(makeRng(42).ints(50, -5, 5));
    expect(a.every((v) => v >= -5 && v <= 5)).toBe(true);
    expect(new Set(a).size).toBeGreaterThan(5);
  });
  it("shuffles into a permutation and seeds are stable per label", () => {
    const s = makeRng(7).shuffle([1, 2, 3, 4, 5, 6]);
    expect([...s].sort()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(seedFor("p", "basic")).toBe(seedFor("p", "basic"));
    expect(seedFor("p", "basic")).not.toBe(seedFor("p", "edge"));
  });
});

describe("native runner", () => {
  const code = "class Solution { public: int addOne(int x) { return x + 1; } };";
  it("compiles, caches and runs a batch", () => {
    const c = compileNative(spec, code, cache);
    expect(c.ok).toBe(true);
    expect(compileNative(spec, code, cache).bin).toBe(c.bin);
    const r = runNative(c.bin, [["1"], ["41"]], 5000);
    expect(r).toMatchObject({ status: "ok", outputs: ["2", "42"] });
  });
  it("reports compile errors", () => {
    const c = compileNative(spec, "class Solution { public: int addOne(int x) { return y; } };", cache);
    expect(c.ok).toBe(false);
    expect(c.diagnostics).toContain("error");
  });
  it("maps a hang to TLE and a crash to RE", () => {
    const hang = compileNative(spec, "class Solution { public: int addOne(int x) { volatile long i = 0; while (true) i = i + 1; return x; } };", cache);
    expect(runNative(hang.bin, [["1"]], 300).status).toBe("TLE");
    const crash = compileNative(spec, "class Solution { public: int addOne(int x) { std::abort(); } };", cache);
    expect(runNative(crash.bin, [["1"]], 3000).status).toBe("RE");
  });
  it("finds no packages in a missing root", () => {
    expect(findPackages(join(cache, "nope"))).toEqual([]);
  });
});
