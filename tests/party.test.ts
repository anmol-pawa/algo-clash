import { describe, expect, it } from "vitest";
import { MOVES, SPECIES } from "@/content/party";
import { scrollById } from "@/content/scrolls";
import { problemCatalog } from "@/content/gyms/catalog";
import { patternById } from "@/content/patterns";
import { allLessons } from "@/content/lessons";
import { recordPass } from "@/lib/forge/progress";
import { markLessonDone } from "@/lib/lessons/progress";
import { applyEvolution } from "@/lib/evolution/progress";
import { autoLoadout, dexState, effectiveParty, equipMove, getLoadout, moveMastery, moveStatus, partyLevel, unequipMove } from "@/lib/party/moves";
import { newCoreSave, sanitizeCore, type CoreSave } from "@/lib/save/schema";

const parOf = (id: string) => problemCatalog[scrollById(id)!.problemId].meta.parSeconds;
const NOW = 1_700_000_000_000;
const running = MOVES.find((m) => m.id === "running-total")!;

function learned(core: CoreSave): CoreSave {
  let c = markLessonDone(core, running.lessonId!);
  const forge = { ...c.forge };
  let p = { passed: [] as never[], blankRuns: [] } as CoreSave["forge"][string];
  for (const t of ["trace", "cloze30", "cloze70", "blank"] as const) p = recordPass(p, t, { seconds: 100, at: NOW });
  forge[running.scrollId!] = p;
  c = { ...c, forge };
  return c;
}

describe("content", () => {
  it("moves point at real patterns, lessons and scrolls", () => {
    for (const m of MOVES) {
      expect(patternById(m.patternId), m.id).toBeDefined();
      if (m.lessonId) expect(allLessons.some((l) => l.id === m.lessonId), m.id).toBe(true);
      if (m.scrollId) expect(scrollById(m.scrollId), m.id).toBeDefined();
    }
    expect(new Set(MOVES.map((m) => m.id)).size).toBe(MOVES.length);
    expect(new Set(SPECIES.map((s) => s.id)).size).toBe(SPECIES.length);
  });
});

describe("move status", () => {
  it("starters are known; scrolled moves need the lesson, then the inscribed scroll; others are sealed", () => {
    const c = newCoreSave(NOW);
    expect(moveStatus(c, MOVES[0], parOf)).toBe("known");
    expect(moveStatus(c, running, parOf)).toBe("needs-lesson");
    const read = markLessonDone(c, running.lessonId!);
    expect(moveStatus(read, running, parOf)).toBe("needs-scroll");
    expect(moveStatus(learned(c), running, parOf)).toBe("known");
    expect(moveStatus(c, MOVES.find((m) => m.id === "sliding-window")!, parOf)).toBe("sealed");
  });
});

describe("loadout", () => {
  const known = new Set(["a", "b", "c", "d", "e"]);
  it("equips up to four distinct known moves and ignores the rest", () => {
    let c = newCoreSave(NOW);
    for (const id of ["a", "a", "zzz", "b", "c", "d", "e"]) c = equipMove(c, "arrayling", id, known);
    expect(getLoadout(c, "arrayling", known)).toEqual(["a", "b", "c", "d"]);
    c = unequipMove(c, "arrayling", "b", known);
    expect(getLoadout(c, "arrayling", known)).toEqual(["a", "c", "d"]);
    c = equipMove(c, "arrayling", "e", known);
    expect(getLoadout(c, "arrayling", known)).toEqual(["a", "c", "d", "e"]);
  });
  it("drops stale entries and survives a sanitize round trip", () => {
    let c = equipMove(newCoreSave(NOW), "arrayling", "a", known);
    c = equipMove(c, "arrayling", "b", known);
    expect(getLoadout(sanitizeCore(JSON.parse(JSON.stringify(c)), NOW), "arrayling", known)).toEqual(["a", "b"]);
    expect(getLoadout(c, "arrayling", new Set(["b"]))).toEqual(["b"]);
  });
  it("autoLoadout fills once and never overwrites a choice", () => {
    const moves = MOVES.slice(0, 2);
    let c = autoLoadout(newCoreSave(NOW), "arrayling", moves);
    expect(getLoadout(c, "arrayling", new Set(moves.map((m) => m.id)))).toEqual(moves.map((m) => m.id));
    c = unequipMove(c, "arrayling", moves[0].id, new Set(moves.map((m) => m.id)));
    expect(autoLoadout(c, "arrayling", moves)).toBe(c);
  });
  it("returns the same object when nothing changes", () => {
    const c = newCoreSave(NOW);
    expect(equipMove(c, "arrayling", "nope", known)).toBe(c);
    expect(unequipMove(c, "arrayling", "a", known)).toBe(c);
  });
});

describe("party and level", () => {
  it("a fresh save has the starter; a saved party is capped at six", () => {
    expect(effectiveParty(newCoreSave(NOW))).toEqual(["arrayling"]);
    expect(effectiveParty({ party: ["a", "b", "c", "d", "e", "f", "g"] })).toHaveLength(6);
  });
  it("level is average move mastery x 10, zero without moves", () => {
    expect(partyLevel([])).toBe(0);
    expect(partyLevel([1, 0.5])).toBe(7.5);
  });
  it("move mastery follows solved problems that carry the pattern", () => {
    const items = Object.values(problemCatalog).map(({ meta: m }) => ({ id: m.id, difficulty: m.difficulty, patterns: m.patterns }));
    const mv = MOVES.find((m) => m.patternId === "syntax")!;
    const target = items.find((i) => i.patterns.includes("syntax"))!;
    const base = newCoreSave(NOW);
    expect(moveMastery(mv, items, base, NOW)).toBe(0);
    const solved = { ...base, mastery: { [target.id]: { state: "mastered" as const, solves: 3, due: NOW + 1e9, intervalDays: 10, ease: 2.5, lastSolvedAt: NOW } } };
    expect(moveMastery(mv, items, solved, NOW)).toBeGreaterThan(0);
  });
});

describe("structdex", () => {
  const byId = new Map(SPECIES.map((s) => [s.id, s]));
  it("starter owned, evolved form seen until stage 2, the rest unknown", () => {
    const c = newCoreSave(NOW);
    expect(dexState(c, byId.get("arrayling")!, byId)).toBe("owned");
    expect(dexState(c, byId.get("vectorling")!, byId)).toBe("seen");
    expect(dexState(applyEvolution(c, "arrayling", 2), byId.get("vectorling")!, byId)).toBe("owned");
    expect(dexState(c, byId.get("hashkit")!, byId)).toBe("unknown");
  });
});
