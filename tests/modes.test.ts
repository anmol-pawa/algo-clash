import { describe, expect, it } from "vitest";
import { DEFAULT_MODE, MODES, MODE_IDS, creditedSeconds, modeAssists, modeDef, runsLeft, sanitizeMode, timerSeconds } from "@/lib/modes/modes";

describe("scaffolding modes (GDD 6.5)", () => {
  it("defines the four modes in order, with unique ids", () => {
    expect(MODES.map((m) => m.id)).toEqual([...MODE_IDS]);
    expect(new Set(MODES.map((m) => m.id)).size).toBe(4);
  });

  it("matches the GDD table", () => {
    const g = modeDef("guided"), s = modeDef("standard"), i = modeDef("interview"), c = modeDef("contest");
    expect(g.countsForMastery).toBe(false);
    expect(g.hints && g.approachCard).toBe(true);
    expect(s.autocomplete && s.hints && s.countsForMastery).toBe(true);
    expect(i.autocomplete).toBe(false);
    expect(i.hints).toBe(false);
    expect(i.ownTests).toBe(true);
    expect(i.multiplier).toBe(1.25);
    expect(c.timerParMultiple).not.toBeNull();
    expect({ ...c, id: "interview", name: "", blurb: "", timerParMultiple: null }).toEqual({ ...i, name: "", blurb: "" });
  });

  it("sanitises unknown modes to Standard", () => {
    expect(DEFAULT_MODE).toBe("standard");
    expect(sanitizeMode("contest")).toBe("contest");
    for (const bad of ["", "hard", null, 3, undefined, {}]) expect(sanitizeMode(bad)).toBe("standard");
    expect(modeDef("nope" as never).id).toBe("standard");
  });

  it("limits runs only where the mode does", () => {
    expect(runsLeft(modeDef("standard"), 99)).toBeNull();
    expect(runsLeft(modeDef("interview"), 0)).toBe(6);
    expect(runsLeft(modeDef("interview"), 4)).toBe(2);
    expect(runsLeft(modeDef("interview"), 50)).toBe(0);
    expect(runsLeft(modeDef("interview"), -3)).toBe(6);
  });

  it("times only Contest, with a floor of one minute", () => {
    expect(timerSeconds(modeDef("interview"), 600)).toBeNull();
    expect(timerSeconds(modeDef("contest"), 600)).toBe(1200);
    expect(timerSeconds(modeDef("contest"), 10)).toBe(60);
  });

  it("gives Interview and Contest 25% slack on speed, and nobody else", () => {
    expect(creditedSeconds(modeDef("standard"), 500)).toBe(500);
    expect(creditedSeconds(modeDef("interview"), 500)).toBe(400);
    expect(creditedSeconds(modeDef("contest"), 500)).toBe(400);
  });

  it("marks only Guided as assisting", () => {
    expect(MODES.filter(modeAssists).map((m) => m.id)).toEqual(["guided"]);
  });
});
