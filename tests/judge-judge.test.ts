import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { judgeProblem, type JudgeDeps } from "@/lib/judge/judge";
import type { FunctionSpec } from "@/lib/judge/harness/driver";

/** Native stand-in for the workers: g++ compiles, the binary runs with a timeout. Same orchestration, real programs. */
const dir = mkdtempSync(join(tmpdir(), "judge-"));
let n = 0;
const bins = new Map<Uint8Array, string>();
const deps: JudgeDeps = {
  async compile(source) {
    const base = join(dir, `p${n++}`);
    writeFileSync(`${base}.cpp`, source);
    const r = spawnSync("g++", ["-std=c++20", "-fno-exceptions", "-O1", `${base}.cpp`, "-o", base], { encoding: "utf8" });
    const handle = new Uint8Array(1);
    bins.set(handle, base);
    return { ok: r.status === 0, wasm: r.status === 0 ? handle : undefined, diagnostics: r.stderr, timings: { compileMs: 1 } };
  },
  async run(wasm, stdin, timeoutMs) {
    const r = spawnSync(bins.get(wasm)!, [], { input: stdin, encoding: "utf8", timeout: timeoutMs });
    if (r.error || r.signal === "SIGTERM") return { status: "TLE", exitCode: -1, stdout: "", stderr: "", wallMs: timeoutMs, detail: "timeout", memPages: 0 };
    if (r.status !== 0) return { status: "RE", exitCode: r.status ?? -1, stdout: r.stdout, stderr: r.stderr, wallMs: 1, detail: "non-zero exit", memPages: 0 };
    return { status: "ok", exitCode: 0, stdout: r.stdout, stderr: r.stderr, wallMs: 1, detail: "", memPages: 0 };
  },
};

const spec: FunctionSpec = {
  kind: "function",
  name: "twoSum",
  returns: "vector<int>",
  params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "target" }],
};
const tests = [
  { input: "[2,7,11,15]\n9", expected: "[0,1]" },
  { input: "[3,2,4]\n6", expected: "[1,2]" },
  { input: "[3,3]\n6", expected: "[0,1]" },
];
const wrap = (body: string) => `class Solution { public: vector<int> twoSum(vector<int>& nums, int target) { ${body} } };`;
const opts = { timeLimitMs: 1000, batchCapMs: 3000 };

describe("judgeProblem", () => {
  it("accepts a correct solution", async () => {
    const code = wrap("unordered_map<int,int> m; for (int i = 0; i < (int)nums.size(); ++i) { auto it = m.find(target - nums[i]); if (it != m.end()) return {it->second, i}; m[nums[i]] = i; } return {};");
    const r = await judgeProblem(spec, code, tests, opts, deps);
    expect(r.verdict).toBe("AC");
    expect(r.outcomes).toHaveLength(3);
  });
  it("reports the first wrong answer", async () => {
    const r = await judgeProblem(spec, wrap("return {0, 1};"), tests, opts, deps);
    expect(r.verdict).toBe("WA");
    expect(r.failedAt).toBe(1);
    expect(r.outcomes[1]).toMatchObject({ got: "[0,1]", expected: "[1,2]" });
  });
  it("blames the crashing test, not the batch", async () => {
    const r = await judgeProblem(spec, wrap("if (nums.size() == 3) return {nums.at(9)}; return {0, 1};"), tests, opts, deps);
    expect(r.verdict).toBe("RE");
    expect(r.failedAt).toBe(1);
  });
  it("reports TLE on the test that hangs", async () => {
    const r = await judgeProblem(spec, wrap("if (nums.size() == 3) { volatile long x = 0; while (true) x = x + 1; } return {0, 1};"), tests, { timeLimitMs: 300, batchCapMs: 1000 }, deps);
    expect(r.verdict).toBe("TLE");
    expect(r.failedAt).toBe(1);
  });
  it("returns CE with a friendly first error", async () => {
    const r = await judgeProblem(spec, wrap("return undefinedName;"), tests, opts, deps);
    expect(r.verdict).toBe("CE");
    expect(r.firstError?.line).toBeGreaterThan(0);
    expect(r.diagnostics).toContain("undefinedName");
  });
});
