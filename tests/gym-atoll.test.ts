import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { arrayAtollGym as gym, dryTideRules } from "../content/gyms/r2";
import { atollGymKits } from "../content/gyms/kitsR2";
import { answerBlitz, battleResult, shuffledOptions, startGym } from "../lib/gym/machine";
import { applyGymWin, hasBadge } from "../lib/gym/progress";
import { blankNonCode, findForbidden } from "../lib/gym/twist";
import { newCoreSave } from "../lib/save/schema";
import { buildTidecaller } from "../game/sprites/tidecaller";
import { ARRAY_ATOLL as atollMap } from "../lib/overworld/atoll";

const read = (id: string, f: string): string => readFileSync(join(process.cwd(), "content", "problems", "R2", id, f), "utf8");

describe("Array Atoll gym content", () => {
  it("has 8 well-formed blitz items, 2 of them review", () => {
    expect(gym.blitz).toHaveLength(8);
    expect(gym.blitz.filter((b) => b.review)).toHaveLength(2);
    expect(new Set(gym.blitz.map((b) => b.id)).size).toBe(8);
    for (const b of gym.blitz) {
      expect(b.options).toHaveLength(4);
      expect(new Set(b.options).size).toBe(4);
      expect(b.options.filter((o) => o === b.answer)).toHaveLength(1);
      expect(shuffledOptions(b, 3).sort()).toEqual([...b.options].sort());
    }
  });
  it("core and signature are real R2 packages (a medium, then a hard)", () => {
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) expect(existsSync(join(process.cwd(), "content", "problems", "R2", id, "solution.cpp"))).toBe(true);
    expect(atollGymKits[gym.coreProblemId].difficulty).toBe("M");
    expect(atollGymKits[gym.signatureProblemId].difficulty).toBe("H");
  });
  it("kits equal the problem packages", () => {
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) {
      expect(atollGymKits[id].statement).toBe(read(id, "problem.md"));
      expect(atollGymKits[id].starter).toContain("// TODO");
    }
  });
  it("walks blitz, core, signature to the Tide Badge and one shard", () => {
    let s = startGym(gym);
    for (const b of gym.blitz) s = answerBlitz(gym, s, b.answer, 4);
    s = battleResult(gym, battleResult(gym, s, "won"), "won");
    expect(s.phase).toBe("won");
    const c = applyGymWin(newCoreSave(0), gym);
    expect(hasBadge(c, gym)).toBe(true);
    expect(applyGymWin(c, gym)).toBe(c);
  });
  it("the leader sheet has the animations the stage needs and the atoll map door opens the atoll gym", () => {
    const sheet = buildTidecaller();
    for (const a of ["idle", "attack", "hurt", "faint"]) expect(sheet.anims[a]?.length).toBeGreaterThan(0);
    expect(atollMap.doors!.map((d) => d.href)).toContain("/gym/atoll/");
  });
});

describe("Dry tide twist", () => {
  it("accepts the reference Tide Pools solution", () => {
    expect(findForbidden(read("tide-pools", "solution.cpp"), dryTideRules)).toBeNull();
  });
  it("rejects the hash-map solution of the core problem and a prefix-max array solution", () => {
    expect(findForbidden(read("exact-stretches", "solution.cpp"), dryTideRules)).toMatch(/Dry tide/);
    const arrays = `class Solution { public: long long poolVolume(vector<int> h) { vector<int> lm(h.size()); return 0; } };`;
    expect(findForbidden(arrays, dryTideRules)).toMatch(/only the input vector/);
    expect(findForbidden("class S { long long f(vector<int> h) { stack<int> st; } };", dryTideRules)).toMatch(/no map, set, stack/);
    expect(findForbidden("class S { long long f(vector<int> h) { int* p = new int[3]; } };", dryTideRules)).toMatch(/heap/);
  });
  it("ignores container names inside comments and string literals", () => {
    const code = `class Solution { public:\n long long poolVolume(vector<int> h) { // not a map<int,int>, no stack<int>\n const char* s = "unordered_map<int,int> new vector<int>"; /* set<int> */ return 0; } };`;
    expect(findForbidden(code, dryTideRules)).toBeNull();
    expect(blankNonCode("a // x\nb")).toBe("a     \nb");
  });
  it("does not trip on identifiers that merely contain a rule word", () => {
    expect(findForbidden("int newest = 0; int bitset_count = 1; int mapped = 2; auto stacks = 3;", dryTideRules)).toBeNull();
  });
});

describe("Dry tide applies to the player's code only", () => {
  it("the generated harness around a passing solution would trip the rules, so the arena must check the raw code", async () => {
    const { generateSource } = await import("../lib/judge/harness/driver");
    const { meta } = await import("../content/problems/R2/tide-pools/meta");
    const user = read("tide-pools", "solution.cpp");
    expect(findForbidden(user, dryTideRules)).toBeNull();
    expect(findForbidden(generateSource(meta.spec, user), dryTideRules)).not.toBeNull();
  });
});
