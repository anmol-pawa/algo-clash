import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { windowWoodsGym as gym } from "../content/gyms/r3";
import { woodsGymKits } from "../content/gyms/kitsR3";
import { answerBlitz, battleResult, shuffledOptions, startGym } from "../lib/gym/machine";
import { applyGymWin, hasBadge } from "../lib/gym/progress";
import { limitAfterVerdict } from "../lib/gym/twist";
import { newCoreSave } from "../lib/save/schema";
import { buildPaneWarden } from "../game/sprites/paneWarden";
import { WINDOW_WOODS } from "../lib/overworld/woods";
import { parseMap, isBlocked, DIRS, DELTA } from "../lib/overworld/map";

const read = (id: string, f: string): string => readFileSync(join(process.cwd(), "content", "problems", "R3", id, f), "utf8");

describe("Window Woods gym content", () => {
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
  it("core and signature are real R3 packages (a medium, then a hard)", () => {
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) expect(existsSync(join(process.cwd(), "content", "problems", "R3", id, "solution.cpp"))).toBe(true);
    expect(woodsGymKits[gym.coreProblemId].difficulty).toBe("M");
    expect(woodsGymKits[gym.signatureProblemId].difficulty).toBe("H");
    for (const id of [gym.coreProblemId, gym.signatureProblemId]) {
      expect(woodsGymKits[id].statement).toBe(read(id, "problem.md"));
      expect(woodsGymKits[id].starter).toContain("// TODO");
    }
  });
  it("walks blitz, core, signature to the Pane Badge and one shard, once", () => {
    let s = startGym(gym);
    for (const b of gym.blitz) s = answerBlitz(gym, s, b.answer, 4);
    s = battleResult(gym, battleResult(gym, s, "won"), "won");
    expect(s.phase).toBe("won");
    const c = applyGymWin(newCoreSave(0), gym);
    expect(hasBadge(c, gym)).toBe(true);
    expect(applyGymWin(c, gym)).toBe(c);
  });
  it("the Warden sheet has the stage animations", () => {
    const sheet = buildPaneWarden();
    for (const a of ["idle", "attack", "hurt", "faint"]) expect(sheet.anims[a]?.length).toBeGreaterThan(0);
  });
  it("the woods map door opens the gym and is reachable on foot", () => {
    const door = WINDOW_WOODS.doors!.find((d) => d.href === "/gym/woods/")!;
    expect(door).toBeTruthy();
    const map = parseMap(WINDOW_WOODS);
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

describe("Shrinking pane twist", () => {
  it("halves the limit on the first TLE only", () => {
    const a = limitAfterVerdict(1000, "TLE", false);
    expect(a).toEqual({ limitMs: 500, halved: true });
    expect(limitAfterVerdict(a.limitMs, "TLE", a.halved)).toEqual({ limitMs: 500, halved: true });
  });
  it("leaves the limit alone for other verdicts", () => {
    for (const v of ["AC", "WA", "CE", "RE", "MLE"]) expect(limitAfterVerdict(1000, v, false)).toEqual({ limitMs: 1000, halved: false });
  });
  it("never reaches zero", () => {
    expect(limitAfterVerdict(1, "TLE", false).limitMs).toBe(1);
  });
});
