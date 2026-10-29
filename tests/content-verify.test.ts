import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findPackages, loadPackage } from "../lib/content/native";
import { verifyPackage } from "../lib/content/verify";

const FIXTURE = join(__dirname, "fixtures", "problems", "R2", "pair-count");

/** Copy the fixture to a temp dir inside the repo's tests tree so relative imports in meta.ts still resolve. */
function scratch(): string {
  const dir = mkdtempSync(join(__dirname, "fixtures", "problems", "R2", ".tmp-"));
  cpSync(FIXTURE, dir, { recursive: true });
  return dir;
}

describe("content:verify pipeline (fixture package)", () => {
  it("fixture is discoverable", () => {
    expect(findPackages(join(__dirname, "fixtures", "problems")).some((d) => d.endsWith("pair-count"))).toBe(true);
  });

  it("passes: tests.json fresh, stress agrees, wrong solutions rejected", async () => {
    const r = verifyPackage(await loadPackage(FIXTURE));
    expect(r.errors).toEqual([]);
    expect(r.tests.map((t) => t.group).filter((g, i, a) => a.indexOf(g) === i).sort()).toEqual(["adversarial", "basic", "edge", "perf"]);
    expect(r.tests[0].expected).toBe("2");
  });

  it("reports a missing tests.json and writes it on request", async () => {
    const dir = scratch();
    try {
      rmSync(join(dir, "tests.json"));
      const pkg = await loadPackage(dir);
      expect(verifyPackage(pkg).errors.join("\n")).toMatch(/tests\.json is missing/);
      expect(verifyPackage(pkg, { write: true }).errors).toEqual([]);
      expect(existsSync(join(dir, "tests.json"))).toBe(true);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  it("reports stale tests.json", async () => {
    const dir = scratch();
    try {
      const t = JSON.parse(readFileSync(join(dir, "tests.json"), "utf8"));
      t[0].expected = "999";
      writeFileSync(join(dir, "tests.json"), JSON.stringify(t));
      expect(verifyPackage(await loadPackage(dir)).errors.join("\n")).toMatch(/stale/);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  it("flags a wrong solution that is actually correct, and a reference that disagrees with the brute", async () => {
    const dir = scratch();
    try {
      cpSync(join(dir, "solution.cpp"), join(dir, "wrong", "secretly-right.cpp"));
      expect(verifyPackage(await loadPackage(dir)).errors.join("\n")).toMatch(/secretly-right\.cpp passes every hidden test/);
      rmSync(join(dir, "wrong", "secretly-right.cpp"));
      writeFileSync(join(dir, "solution.cpp"), readFileSync(join(dir, "wrong", "counts-self.cpp"), "utf8"));
      expect(verifyPackage(await loadPackage(dir), { write: true }).errors.join("\n")).toMatch(/disagree/);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });
});
