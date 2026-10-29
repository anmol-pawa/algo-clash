import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeRng } from "@/lib/content/rng";
import { answersFor, compileNative, loadProblemFiles, runNative } from "@/lib/content/native";
import type { FunctionSpec } from "@/lib/judge/harness/driver";

const spec: FunctionSpec = { kind: "function", name: "sumTo", returns: "long long", params: [{ type: "int", name: "n" }] };
const good = "class Solution { public: long long sumTo(int n) { return 1LL * n * (n + 1) / 2; } };";
const loop = "class Solution { public: long long sumTo(int n) { long long s = 0; for (int i = 1; i <= n; ++i) s += i; return s; } };";

describe("seeded rng", () => {
  it("is deterministic and in range", () => {
    const a = makeRng(7), b = makeRng(7);
    const xs = Array.from({ length: 50 }, () => a.int(-3, 3));
    expect(xs).toEqual(Array.from({ length: 50 }, () => b.int(-3, 3)));
    expect(Math.min(...xs)).toBe(-3);
    expect(Math.max(...xs)).toBe(3);
    expect(makeRng(1).int(0, 1000)).not.toBe(makeRng(2).int(0, 1000));
  });
  it("shuffle is a permutation and leaves the input alone", () => {
    const src = [1, 2, 3, 4, 5, 6];
    const out = makeRng(3).shuffle(src);
    expect([...out].sort()).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("native runner", () => {
  it("compiles, caches and runs a batch", () => {
    const c1 = compileNative(spec, good);
    const c2 = compileNative(spec, good);
    expect(c1.ok && c2.ok && c1.bin === c2.bin).toBe(true);
    expect(answersFor(spec, good, [["10"], ["100000"]], 5000, "good")).toEqual(["55", "5000050000"]);
    expect(answersFor(spec, loop, [["10"]], 5000, "loop")).toEqual(["55"]);
  });
  it("reports compile errors", () => {
    const c = compileNative(spec, "class Solution { public: long long sumTo(int n) { return x; } };");
    expect(c.ok).toBe(false);
    expect(() => answersFor(spec, "nope", [["1"]], 1000, "bad")).toThrow(/compile error/);
  });
  it("reports runtime errors and timeouts", () => {
    const re = compileNative(spec, "class Solution { public: long long sumTo(int n) { vector<int> v; return v.at(n); } };");
    const tle = compileNative(spec, "class Solution { public: long long sumTo(int n) { volatile int k = 0; while (k >= 0) { k = k + 0; } return n; } };");
    if (!re.ok || !tle.ok) throw new Error("setup");
    expect(runNative(re.bin, [["3"]], 5000).status).toBe("RE");
    expect(runNative(tle.bin, [["3"]], 300).status).toBe("TLE");
  });
});

describe("loadProblemFiles", () => {
  it("reads solution, brute, wrong/* and optional tests.json", () => {
    const dir = mkdtempSync(join(tmpdir(), "pkg-"));
    mkdirSync(join(dir, "wrong"));
    writeFileSync(join(dir, "solution.cpp"), good);
    writeFileSync(join(dir, "brute.cpp"), loop);
    writeFileSync(join(dir, "wrong", "b.cpp"), "b");
    writeFileSync(join(dir, "wrong", "a.cpp"), "a");
    const p = loadProblemFiles(dir);
    expect(p.wrong.map((w) => w.name)).toEqual(["a.cpp", "b.cpp"]);
    expect(p.tests).toBeNull();
    writeFileSync(join(dir, "tests.json"), JSON.stringify([{ input: "1", expected: "1", group: "basic" }]));
    expect(loadProblemFiles(dir).tests).toHaveLength(1);
  });
});
