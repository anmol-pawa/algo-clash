import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { judgeProblem, type JudgeDeps } from "@/lib/judge/judge";
import type { DriverSpec } from "@/lib/judge/harness/driver";

const dir = mkdtempSync(join(tmpdir(), "algo-judge-"));
let n = 0;

/** Native stand-in for the worker pair: compile with g++, "wasm" is the binary path as bytes. */
const native: JudgeDeps = {
  async compile(source) {
    const base = join(dir, `p${n++}`);
    writeFileSync(`${base}.cpp`, source);
    const r = spawnSync("g++", ["-std=c++20", "-O1", "-fno-exceptions", `${base}.cpp`, "-o", base], { encoding: "utf8" });
    return { ok: r.status === 0, wasm: r.status === 0 ? new TextEncoder().encode(base) : undefined, diagnostics: r.stderr, timings: {} };
  },
  async run(wasm, stdin, timeoutMs) {
    const bin = new TextDecoder().decode(wasm);
    const r = spawnSync(bin, [], { input: stdin, encoding: "utf8", timeout: timeoutMs });
    const timedOut = r.error !== undefined;
    return { status: timedOut ? "TLE" : r.status === 0 ? "ok" : "RE", exitCode: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "", wallMs: 1, detail: r.signal ?? "", memPages: 0 };
  },
};

const spec: DriverSpec = { kind: "function", name: "twoSum", returns: "vector<int>", params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "target" }] };
const tests = [
  { input: "[2,7,11,15]\n9", expected: "[0,1]" },
  { input: "[3,2,4]\n6", expected: "[1,2]" },
  { input: "[3,3]\n6", expected: "[0,1]" },
];
const wrap = (body: string) => `#include <bits/stdc++.h>\nusing namespace std;\nclass Solution { public: vector<int> twoSum(vector<int>& nums, int target) { ${body} } };`;
const base = { spec, tests, timeLimitMs: 1000 };

describe("judgeProblem", () => {
  it("accepts a correct solution", async () => {
    const code = wrap("unordered_map<int,int> m; for (int i = 0; i < (int)nums.size(); ++i) { auto it = m.find(target - nums[i]); if (it != m.end()) return {it->second, i}; m[nums[i]] = i; } return {};");
    const r = await judgeProblem({ ...base, code }, native);
    expect(r.verdict).toBe("AC");
    expect(r.outcomes).toHaveLength(3);
  });

  it("reports the first wrong answer", async () => {
    const r = await judgeProblem({ ...base, code: wrap("return {0, 1};") }, native);
    expect(r.verdict).toBe("WA");
    expect(r.failedAt).toBe(1);
    expect(r.outcomes[1].got).toBe("[0,1]");
    expect(r.outcomes[1].expected).toBe("[1,2]");
  });

  it("attributes a crash to its test via the per-test fallback", async () => {
    const r = await judgeProblem({ ...base, code: wrap("if (target == 6) abort(); return {0, 1};") }, native);
    expect(r.verdict).toBe("RE");
    expect(r.failedAt).toBe(1);
  });

  it("reports TLE", async () => {
    const r = await judgeProblem({ ...base, timeLimitMs: 200, code: wrap("while (true) {} return {};") }, native);
    expect(r.verdict).toBe("TLE");
  });

  it("maps a compile error to a friendly explanation", async () => {
    const r = await judgeProblem({ ...base, code: wrap("return {0, 1}") }, native);
    expect(r.verdict).toBe("CE");
    expect(r.diagnostics).toContain("error");
  });
});
