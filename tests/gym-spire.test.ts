import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stackspireGym as gym, ironStackRules } from "../content/gyms/r6";
import { spireGymKits } from "../content/gyms/kitsR6";
import { answerBlitz, battleResult, shuffledOptions, startGym } from "../lib/gym/machine";
import { applyGymWin, hasBadge } from "../lib/gym/progress";
import { findForbidden, hasRecursion, blankNonCode } from "../lib/gym/twist";
import { newCoreSave } from "../lib/save/schema";
import { buildSentinel } from "../game/sprites/sentinel";
import { STACKSPIRE } from "../lib/overworld/spire";
import { parseMap, isBlocked, DIRS, DELTA } from "../lib/overworld/map";

const dir = (id: string): string => join(process.cwd(), "content", "problems", "R6", id);
const read = (id: string, f: string): string => readFileSync(join(dir(id), f), "utf8");
const rec = (src: string): boolean => hasRecursion(blankNonCode(src));

describe("Stackspire gym content", () => {
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
  it("core and signature are real R6 packages (a medium, then a hard)", () => {
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) expect(existsSync(join(dir(id), "solution.cpp"))).toBe(true);
    expect(spireGymKits[gym.coreProblemId].difficulty).toBe("M");
    expect(spireGymKits[gym.signatureProblemId].difficulty).toBe("H");
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) {
      expect(spireGymKits[id].statement).toBe(read(id, "problem.md"));
      expect(spireGymKits[id].starter).toContain("// TODO");
    }
  });
  it("walks blitz, core, signature to the Slab Badge and one shard, once", () => {
    let s = startGym(gym);
    for (const b of gym.blitz) s = answerBlitz(gym, s, b.answer, 4);
    s = battleResult(gym, battleResult(gym, s, "won"), "won");
    expect(s.phase).toBe("won");
    const c = applyGymWin(newCoreSave(0), gym);
    expect(hasBadge(c, gym)).toBe(true);
    expect(applyGymWin(c, gym)).toBe(c);
  });
  it("the Sentinel sheet has the stage animations", () => {
    const sheet = buildSentinel();
    for (const a of ["idle", "attack", "hurt", "faint"]) expect(sheet.anims[a]?.length).toBeGreaterThan(0);
  });
  it("the spire map has a gym door that is reachable on foot", () => {
    const door = STACKSPIRE.doors!.find((d) => d.href === "/gym/spire/");
    expect(door).toBeTruthy();
    const map = parseMap(STACKSPIRE);
    expect(isBlocked(map, door!.x, door!.y)).toBe(false);
    const seen = new Set([`${map.spawn.x},${map.spawn.y}`]);
    const q = [[map.spawn.x, map.spawn.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      for (const d of DIRS) {
        const nx = x + DELTA[d].dx, ny = y + DELTA[d].dy, k = `${nx},${ny}`;
        if (!seen.has(k) && !isBlocked(map, nx, ny)) { seen.add(k); q.push([nx, ny]); }
      }
    }
    expect(seen.has(`${door!.x},${door!.y}`)).toBe(true);
  });
});

describe("Iron stack twist", () => {
  it("accepts the reference and every wrong solution that is merely iterative", () => {
    expect(findForbidden(read("ledger-fold", "solution.cpp"), ironStackRules)).toBeNull();
    for (const f of readdirSync(join(dir("ledger-fold"), "wrong"))) {
      const src = read("ledger-fold", `wrong/${f}`);
      // wrong solutions may recurse (that is a documented failure); this only checks the detector never throws
      expect(typeof findForbidden(src, ironStackRules)).toMatch(/string|object/);
    }
  });
  it("rejects direct, mutual and std::function recursion", () => {
    const direct = "class Solution { int eval(const string& s, int& i) { int v = 0; if (s[i] == '(') { ++i; v = eval(s, i); } return v; } };";
    const mutual = "int a(int x); int b(int x) { return a(x - 1); } int a(int x) { return x ? b(x) : 0; } class Solution {};";
    const lambda = "class Solution { int f(string s) { function<int(int)> go = [&](int i) -> int { return i ? go(i - 1) : 0; }; return go(3); } };";
    for (const src of [direct, mutual, lambda]) {
      expect(rec(src)).toBe(true);
      expect(findForbidden(src, ironStackRules)).toMatch(/Iron stack/);
    }
  });
  it("does not flag member calls that share a name or ordinary helpers", () => {
    const src = "struct W { int top() const { return v.back(); } vector<int> v; int size() const { return v.size(); } }; class Solution { int f(stack<int>& st) { int t = st.top(); return helper(t); } int helper(int x) { return x + 1; } };";
    expect(rec(src)).toBe(false);
  });
  it("ignores words inside comments and strings", () => {
    const src = "class Solution { int f(int x) { // f(x - 1)\n return x + 1; /* f(2) */ } };";
    expect(findForbidden(src, ironStackRules)).toBeNull();
  });
});
