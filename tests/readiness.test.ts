import { describe, expect, it } from "vitest";
import { PATTERNS } from "@/content/patterns";
import { computeCauses, computeGates, computeRadar, computeReadiness, computeTimeVsPar, isUnassistedAttempt, median, nextBestAction, solvedWithin, type ReadinessInput, type ReadinessProblem } from "@/lib/readiness/readiness";
import { newCoreSave, sanitizeAttempt, type Attempt } from "@/lib/save/schema";
import { emptyMastery } from "@/lib/srs";

const NOW = Date.UTC(2026, 10, 10);
const problems: ReadinessProblem[] = [
  { id: "e1", difficulty: "E", patterns: ["syntax"], parSeconds: 300 },
  { id: "m1", difficulty: "M", patterns: ["sliding-window"], parSeconds: 1200 },
  { id: "m2", difficulty: "M", patterns: ["sliding-window", "hash-lookup"], parSeconds: 1200 },
  { id: "h1", difficulty: "H", patterns: ["stack"], parSeconds: 2400 },
];
const att = (o: Partial<Attempt> & { problemId: string }): Attempt => ({ at: NOW, verdict: "AC", seconds: 600, hintsUsed: 0, mode: "practice", ...o });
const scout = { seen: 0, inTime: 0, total: 78, accuracy: 0, mastered: false };
const input = (o: Partial<ReadinessInput> = {}): ReadinessInput => ({ core: newCoreSave(NOW), attempts: [], problems, scrolls: [], patterns: PATTERNS, scout, now: NOW, ...o });

describe("readiness helpers", () => {
  it("takes medians", () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
  });
  it("only unhinted, non-guided accepted attempts are unassisted", () => {
    expect(isUnassistedAttempt(att({ problemId: "m1" }))).toBe(true);
    expect(isUnassistedAttempt(att({ problemId: "m1", hintsUsed: 1 }))).toBe(false);
    expect(isUnassistedAttempt(att({ problemId: "m1", assisted: true }))).toBe(false);
    expect(isUnassistedAttempt(att({ problemId: "m1", mode: "learn" }))).toBe(false);
    expect(isUnassistedAttempt(att({ problemId: "m1", verdict: "WA" }))).toBe(false);
  });
  it("counts distinct problems under the time limit", () => {
    const a = [att({ problemId: "m1" }), att({ problemId: "m1", seconds: 100 }), att({ problemId: "m2", seconds: 1600 })];
    expect(solvedWithin(a, problems, "M", 1500)).toBe(1);
    expect(solvedWithin(a, problems, "H", 1500)).toBe(0);
  });
});

describe("gates", () => {
  it("start empty and unpassed", () => {
    const g = computeGates(input());
    expect(g.map((x) => x.id)).toEqual(["recognition", "medium", "hard", "templates", "mocks"]);
    expect(g.every((x) => !x.passed && x.progress === 0)).toBe(true);
  });
  it("recognition mirrors scout mastery", () => {
    const g = computeGates(input({ scout: { seen: 50, inTime: 46, total: 78, accuracy: 0.92, mastered: true } }));
    expect(g[0]).toMatchObject({ passed: true, progress: 1 });
    const half = computeGates(input({ scout: { seen: 25, inTime: 25, total: 78, accuracy: 1, mastered: false } }));
    expect(half[0]!.progress).toBeCloseTo(0.5);
  });
  it("medium and hard use the 16-of-20 and 4-of-10 targets", () => {
    const g = computeGates(input({ attempts: [att({ problemId: "m1" }), att({ problemId: "h1", seconds: 3000 })] }));
    expect(g[1]!.detail).toContain("1 of 16");
    expect(g[1]!.progress).toBeCloseTo(1 / 16);
    expect(g[2]!.detail).toContain("0 of 4"); // 3000 s is over 45 minutes
  });
  it("mocks read the streak flag", () => {
    const core = { ...newCoreSave(NOW), flags: { "mocks:streak": 3 } };
    expect(computeGates(input({ core }))[4]).toMatchObject({ passed: true, progress: 1 });
  });
});

describe("radar, time vs par, causes", () => {
  it("lists only patterns that have problems, weighted by mastery", () => {
    const core = newCoreSave(NOW);
    core.mastery.m1 = { ...emptyMastery(), state: "mastered", solves: 4, due: NOW + 1e9, lastSolvedAt: NOW };
    const r = computeRadar(input({ core }));
    expect(r.map((s) => s.pattern).sort()).toEqual(["hash-lookup", "sliding-window", "stack", "syntax"]);
    const sw = r.find((s) => s.pattern === "sliding-window")!;
    expect(sw.value).toBeGreaterThan(0);
    expect(r.find((s) => s.pattern === "stack")!.value).toBe(0);
  });
  it("reports median seconds over par per difficulty", () => {
    const t = computeTimeVsPar([att({ problemId: "m1", seconds: 600 }), att({ problemId: "m2", seconds: 1800 }), att({ problemId: "m1", verdict: "WA", seconds: 5 })], problems);
    expect(t.find((x) => x.difficulty === "M")).toEqual({ difficulty: "M", medianRatio: 1, samples: 2 });
    expect(t.find((x) => x.difficulty === "H")!.medianRatio).toBeNull();
  });
  it("histograms failures by cause tag, else verdict", () => {
    const c = computeCauses([att({ problemId: "m1", verdict: "WA" }), att({ problemId: "m1", verdict: "WA", cause: "off-by-one" }), att({ problemId: "m1", verdict: "TLE" }), att({ problemId: "m1", verdict: "WA" }), att({ problemId: "m1" })]);
    expect(c).toEqual([{ cause: "WA", count: 2 }, { cause: "off-by-one", count: 1 }, { cause: "TLE", count: 1 }]);
  });
});

describe("next best action and the report", () => {
  it("sends a new player to Scout School, due reviews first when any", () => {
    const r = computeReadiness(input());
    expect(r.next.href).toBe("/scout/");
    expect(r.readiness).toBe(0);
    const core = newCoreSave(NOW);
    core.mastery.m1 = { ...emptyMastery(), state: "learning", solves: 1, due: NOW - 1000, lastSolvedAt: NOW - 2e9 };
    const due = computeReadiness(input({ core }));
    expect(due.dueReviews).toBe(1);
    expect(due.next.title).toMatch(/due review$/);
    expect(nextBestAction(input(), computeGates(input()), [], 2).title).toBe("Clear 2 due reviews");
  });
  it("points at the weakest pattern once recognition is done", () => {
    const i = input({ scout: { seen: 50, inTime: 50, total: 78, accuracy: 1, mastered: true } });
    const r = computeReadiness(i);
    expect(r.next.title).toMatch(/^Practise /);
  });
});

describe("attempt schema", () => {
  it("keeps the assisted flag and drops junk", () => {
    expect(sanitizeAttempt({ problemId: "x", verdict: "AC", assisted: true })?.assisted).toBe(true);
    expect(sanitizeAttempt({ problemId: "x", verdict: "AC", assisted: "yes" })?.assisted).toBeUndefined();
  });
});
