/** `npm run content:verify`: regenerates/validates every problem package under content/problems (ARCH §2.4).
 *  Set CONTENT_WRITE=1 (npm run content:gen) to rewrite tests.json files. */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findPackages, loadPackage, type ProblemPackage } from "@/lib/content/native";
import { generateTests, verifyPackage } from "@/lib/content/verify";
import { PATTERNS } from "@/content/patterns";
import { findPrerequisiteCycle } from "@/lib/content/validate";

const ROOT = join(process.cwd(), "content", "problems");
const WRITE = process.env.CONTENT_WRITE === "1";
const stable = (v: unknown) => JSON.stringify(v, null, 1) + "\n";

describe("content packages", async () => {
  const dirs = findPackages(ROOT);
  const pkgs = await Promise.all(dirs.map(loadPackage));
  const ids = new Set(pkgs.map((p) => p.id));

  it("has unique ids that match folder names and no prerequisite cycle", () => {
    expect(ids.size).toBe(pkgs.length);
    for (const p of pkgs) expect(p.dir.endsWith(`/${p.id}`)).toBe(true);
    expect(findPrerequisiteCycle(pkgs.map((p) => p.meta))).toBeNull();
  });

  for (const pkg of pkgs) {
    it(`${pkg.id}: generated tests are fresh and the package verifies`, () => {
      const { tests, errors } = generateTests(pkg);
      expect(errors).toEqual([]);
      const file = join(pkg.dir, "tests.json");
      if (WRITE) writeFileSync(file, stable(tests));
      else {
        expect(existsSync(file), "tests.json missing: run `npm run content:gen`").toBe(true);
        expect(readFileSync(file, "utf8"), "tests.json is stale: run `npm run content:gen`").toBe(stable(tests));
      }
      expect(verifyPackage(pkg, ids, tests)).toEqual([]);
    }, 300000);
  }

  it("pattern taxonomy is non-empty", () => expect(PATTERNS.length).toBeGreaterThan(0));
});

/** A tiny in-memory package proving the verifier accepts good work and rejects each kind of bad work. */
describe("verifyPackage on a synthetic package", () => {
  const fn = (body: string) => `class Solution {\npublic:\n  int maxPairSum(vector<int>& a) {\n${body}\n  }\n};`;
  const good = fn(`    int best = -1;\n    for (int i = 0; i < (int)a.size(); ++i) for (int j = i + 1; j < (int)a.size(); ++j) best = max(best, a[i] + a[j]);\n    return best;`);
  const make = (over: Partial<ProblemPackage> = {}): ProblemPackage => ({
    dir: "/tmp/x",
    id: "max-pair-sum",
    meta: {
      id: "max-pair-sum", region: "R1", title: "Twin Peaks", difficulty: "E", patterns: [PATTERNS[0].id], signals: ["pair"], prerequisites: [], parSeconds: 120, timeLimitMs: 1000,
      testWeights: { basic: 0.4, edge: 0.3, adversarial: 0.3, perf: 0 }, similar: [],
      spec: { kind: "function", name: "maxPairSum", returns: "int", params: [{ type: "vector<int>&", name: "a" }] },
    },
    statement: "# Twin Peaks\n\n## Examples\n\nx\n\n## Constraints\n\nx\n",
    hints: "## Nudge\n\nthink about pairs\n\n## Approach\n\nsort the numbers\n\n## Key insight\n\ntake the two largest\n",
    editorial: "",
    solution: fn(`    int m1 = -1, m2 = -1;\n    for (int x : a) { if (x > m1) { m2 = m1; m1 = x; } else if (x > m2) m2 = x; }\n    return m2 < 0 ? -1 : m1 + m2;`),
    brute: good,
    wrong: [
      { name: "greedy", code: fn(`    return a.size() < 2 ? -1 : a[0] + a[1];`) },
      { name: "off", code: fn(`    int m = -1; for (int x : a) m = max(m, x); return m;`) },
    ],
    gen: {
      small: (r) => { const n = r.int(0, 6); return [`[${r.ints(n, 0, 9).join(",")}]`]; },
      groups: { basic: [["[1,2,3]"], ["[5,1,9,2]"]], edge: [["[]"], ["[4]"], ["[0,0]"]], adversarial: [["[9,9,9,9]"], ["[1,9,2,8]"]], perf: [] },
    },
    ...over,
  });

  it("generates tests and reports only editorial problems for a good solution", () => {
    const pkg = make();
    const { tests, errors } = generateTests(pkg);
    expect(errors).toEqual([]);
    expect(tests.length).toBe(7);
    expect(tests.find((t) => t.input === "[1,2,3]")?.expected).toBe("5");
    const errs = verifyPackage(pkg, new Set(), tests);
    expect(errs.filter((e) => !e.startsWith("editorial") && !e.startsWith("\"Optimal\""))).toEqual([]);
  });

  it("flags a reference that disagrees with the brute force", () => {
    const pkg = make({ solution: fn(`    return a.empty() ? -1 : a[0];`) });
    const { tests } = generateTests(pkg);
    expect(verifyPackage(pkg, new Set(), tests).some((e) => e.startsWith("stress:"))).toBe(true);
  });

  it("flags a wrong solution that passes every hidden test", () => {
    const pkg = make({ wrong: [{ name: "same", code: good }, { name: "off", code: fn(`    return 0;`) }] });
    const { tests } = generateTests(pkg);
    const errs = verifyPackage(pkg, new Set(), tests);
    expect(errs).toContain("wrong/same.cpp passes every hidden test");
    expect(errs.some((e) => e.includes("wrong/off.cpp"))).toBe(false);
  });

  it("rejects a hung wrong solution as TLE and requires a tle* file for mediums", () => {
    const hang = make({ wrong: [{ name: "tle_loop", code: fn(`    while (true) {}\n    return 0;`) }, { name: "b", code: fn(`    return 0;`) }] });
    const { tests } = generateTests(hang);
    expect(verifyPackage(hang, new Set(), tests).some((e) => e.includes("wrong/tle_loop"))).toBe(false);
    const med = make({ meta: { ...make().meta, difficulty: "M" } });
    expect(verifyPackage(med, new Set(), generateTests(med).tests).some((e) => e.includes("TLE brute force"))).toBe(true);
  });
});
