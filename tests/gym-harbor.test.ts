import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { hashwoodHarborGym as gym, hashFloodRules } from "../content/gyms/r4";
import { harborGymKits } from "../content/gyms/kitsR4";
import { answerBlitz, battleResult, shuffledOptions, startGym } from "../lib/gym/machine";
import { applyGymWin, hasBadge } from "../lib/gym/progress";
import { findForbidden } from "../lib/gym/twist";
import { newCoreSave } from "../lib/save/schema";
import { buildHydra } from "../game/sprites/hydra";
import { HASHWOOD_HARBOR } from "../lib/overworld/harbor";
import { parseMap, isBlocked, DIRS, DELTA } from "../lib/overworld/map";

const read = (id: string, f: string): string => readFileSync(join(process.cwd(), "content", "problems", "R4", id, f), "utf8");

describe("Hashwood Harbor gym content", () => {
  it("has 8 well-formed blitz items, 2 of them review", () => {
    expect(gym.blitz).toHaveLength(8);
    expect(gym.blitz.filter((b) => b.review)).toHaveLength(2);
    expect(new Set(gym.blitz.map((b) => b.id)).size).toBe(8);
    for (const b of gym.blitz) {
      expect(b.options).toHaveLength(4);
      expect(new Set(b.options).size).toBe(4);
      expect(b.options.filter((o) => o === b.answer)).toHaveLength(1);
      expect(shuffledOptions(b, 5).sort()).toEqual([...b.options].sort());
    }
  });
  it("core and signature are real R4 packages (a medium, then a hard)", () => {
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) expect(existsSync(join(process.cwd(), "content", "problems", "R4", id, "solution.cpp"))).toBe(true);
    expect(harborGymKits[gym.coreProblemId].difficulty).toBe("M");
    expect(harborGymKits[gym.signatureProblemId].difficulty).toBe("H");
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) {
      expect(harborGymKits[id].statement).toBe(read(id, "problem.md"));
      expect(harborGymKits[id].starter).toContain("// TODO");
    }
  });
  it("walks blitz, core, signature to the Bucket Badge and one shard, once", () => {
    let s = startGym(gym);
    for (const b of gym.blitz) s = answerBlitz(gym, s, b.answer, 4);
    s = battleResult(gym, battleResult(gym, s, "won"), "won");
    expect(s.phase).toBe("won");
    const c = applyGymWin(newCoreSave(0), gym);
    expect(hasBadge(c, gym)).toBe(true);
    expect(applyGymWin(c, gym)).toBe(c);
  });
  it("the Hydra sheet has the stage animations", () => {
    const sheet = buildHydra();
    for (const a of ["idle", "attack", "hurt", "faint"]) expect(sheet.anims[a]?.length).toBeGreaterThan(0);
  });
  it("the harbor map door opens the gym and is reachable on foot", () => {
    const door = HASHWOOD_HARBOR.doors!.find((d) => d.href === "/gym/harbor/")!;
    expect(door).toBeTruthy();
    const map = parseMap(HASHWOOD_HARBOR);
    expect(isBlocked(map, door.x, door.y)).toBe(false);
    const seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
    const q = [[map.spawn.x, map.spawn.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      for (const d of DIRS) {
        const nx = x + DELTA[d].dx, ny = y + DELTA[d].dy, k = `${nx},${ny}`;
        if (!seen.has(k) && !isBlocked(map, nx, ny)) { seen.add(k); q.push([nx, ny]); }
      }
    }
    expect(seen.has(`${door.x},${door.y}`)).toBe(true);
  });
});

describe("Hash flood twist", () => {
  const readP = (id: string, f: string): string => read(id, f);
  it("accepts the reference solution and the other correct shapes", () => {
    expect(findForbidden(readP("longest-echo", "solution.cpp"), hashFloodRules)).toBeNull();
    expect(findForbidden(readP("longest-echo", "wrong/tle-every-length.cpp"), hashFloodRules)).toBeNull(); // string-keyed set, no unsafe hash
  });
  it("rejects a number-keyed hash that never compares the real letters", () => {
    expect(findForbidden(readP("longest-echo", "wrong/overflow-hash-no-verify.cpp"), hashFloodRules)).toMatch(/Hash flood/);
  });
  it("ignores words inside comments and strings", () => {
    const src = "class Solution { string f(string s) { // unordered_map<long long, int> m;\n return \"unordered_set<int>\"; } };";
    expect(findForbidden(src, hashFloodRules)).toBeNull();
  });
  it("accepts equality checks on substrings as verification", () => {
    const src = "unordered_map<int, int> m; bool ok = s.substr(a, k) == s.substr(b, k);";
    expect(findForbidden(src, hashFloodRules)).toBeNull();
  });
});
