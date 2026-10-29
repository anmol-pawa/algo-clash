/** `npm run content:verify` entry point: every real problem under content/problems must pass the native pipeline. */
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findPackages, loadPackage } from "../lib/content/native";
import { verifyPackage } from "../lib/content/verify";
import { findPrerequisiteCycle } from "../lib/content/validate";

const dirs = findPackages(join(process.cwd(), "content", "problems"));
const write = process.env.CONTENT_WRITE === "1";

describe("content/problems", async () => {
  const pkgs = await Promise.all(dirs.map(loadPackage));
  const ids = new Set(pkgs.map((p) => p.id));
  it("has unique ids, folder names that match, and no prerequisite cycles", () => {
    expect(ids.size).toBe(pkgs.length);
    for (const p of pkgs) expect(p.dir.endsWith(`/${p.id}`)).toBe(true);
    expect(findPrerequisiteCycle(pkgs.map((p) => p.meta))).toBeNull();
  });
  for (const p of pkgs) {
    it(`${p.id} passes native verification`, () => {
      expect(verifyPackage(p, { knownIds: ids, write }).errors).toEqual([]);
    });
  }
});
