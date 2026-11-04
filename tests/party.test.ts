import { describe, expect, it } from "vitest";
import { allMoves, moveById } from "@/content/moves";
import { SPECIES, speciesById } from "@/content/structlings";
import { allScrolls } from "@/content/scrolls";
import { equipMove, equippedMoves, isLearned, learnedMoveIds, partyOf, unequipMove, MAX_MOVES } from "@/lib/party/loadout";
import { newCoreSave, sanitizeCore } from "@/lib/save/schema";

const inscribed = () => {
  const c = newCoreSave(0);
  c.forge = { accumulate: { passed: ["trace", "cloze30", "cloze70", "blank"], blankRuns: [] } };
  return c;
};

describe("moves and species", () => {
  it("has one move per scroll, tied to the scroll's problem", () => {
    expect(allMoves.map((m) => m.id)).toEqual(allScrolls.map((s) => s.id));
    for (const m of allMoves) expect(allScrolls.find((s) => s.id === m.scrollId)?.problemId).toBe(m.problemId);
    expect(moveById("accumulate")?.name).toBe("Running Total");
  });
  it("species evolve from known species", () => {
    for (const s of SPECIES) if (s.from) expect(speciesById(s.from)?.stage).toBe(s.stage - 1);
  });
});

describe("loadouts", () => {
  it("always has the starter", () => expect(partyOf(newCoreSave(0))).toEqual(["arrayling"]));
  it("refuses an uninscribed move", () => {
    const r = equipMove(newCoreSave(0), "arrayling", "accumulate");
    expect(r).toEqual({ ok: false, reason: "unlearned" });
  });
  it("equips after inscription, idempotently, and unequips", () => {
    const c = inscribed();
    expect(learnedMoveIds(c.forge, ["accumulate", "nope"])).toEqual(["accumulate"]);
    const r = equipMove(c, "arrayling", "accumulate");
    expect(r.ok && r.core.loadouts.arrayling).toEqual(["accumulate"]);
    if (!r.ok) throw new Error("unreachable");
    const again = equipMove(r.core, "arrayling", "accumulate");
    expect(again.ok && again.core).toBe(r.core);
    expect(unequipMove(r.core, "arrayling", "accumulate").loadouts.arrayling).toEqual([]);
    expect(unequipMove(r.core, "arrayling", "zzz")).toBe(r.core);
  });
  it("rejects strangers and a fifth move", () => {
    const c = inscribed();
    expect(equipMove(c, "ghost", "accumulate")).toEqual({ ok: false, reason: "unknown-structling" });
    c.loadouts = { arrayling: ["a", "b", "c", "d"] };
    c.forge.e = { passed: ["blank"], blankRuns: [] };
    expect(equipMove(c, "arrayling", "e")).toEqual({ ok: false, reason: "full" });
  });
  it("ignores equipped moves that are no longer learned", () => {
    const c = inscribed();
    c.loadouts = { arrayling: ["accumulate", "gone"] };
    expect(equippedMoves(c, "arrayling")).toEqual(["accumulate"]);
    expect(isLearned(c.forge, "gone")).toBe(false);
  });
  it("sanitises untrusted loadouts", () => {
    const c = sanitizeCore({ loadouts: { arrayling: ["a", "a", 3, "b", "c", "d", "e"], bad: "x" } }, 0);
    expect(c.loadouts.arrayling).toEqual(["a", "b", "c", "d"]);
    expect(c.loadouts.arrayling.length).toBeLessThanOrEqual(MAX_MOVES);
    expect(c.loadouts.bad).toEqual([]);
    expect(sanitizeCore({}, 0).loadouts).toEqual({});
  });
});

import { currentForm, dexStatus, lineOf } from "@/lib/party/dex";
import { applyEvolution } from "@/lib/evolution/progress";

describe("structdex", () => {
  it("walks an evolution line and shows the current form", () => {
    expect(lineOf("arrayling", SPECIES).map((s) => s.id)).toEqual(["arrayling", "vectorling"]);
    const c = newCoreSave(0);
    expect(currentForm(c, "arrayling", SPECIES)?.id).toBe("arrayling");
    expect(currentForm(applyEvolution(c, "arrayling", 2), "arrayling", SPECIES)?.id).toBe("vectorling");
  });
  it("enters a species only once held", () => {
    const c = newCoreSave(0);
    const [a, v] = SPECIES;
    expect(dexStatus(c, a, SPECIES)).toBe("seen");
    expect(dexStatus(c, v, SPECIES)).toBe("unseen");
    expect(dexStatus(applyEvolution(c, "arrayling", 2), v, SPECIES)).toBe("seen");
  });
});
