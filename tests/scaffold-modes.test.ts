import { describe, expect, it } from "vitest";
import { MODE_RULES, SCAFFOLD_MODES, MIN_OWN_TESTS, runBudget, sanitizeMode, submitAllowed, timeLeft } from "@/lib/scaffold/modes";
import { classifyInput, scoreOwnTests } from "@/lib/scaffold/edgeCases";
import { problemCatalog } from "@/content/gyms/catalog";

describe("scaffold modes", () => {
  it("matches the GDD table", () => {
    expect(MODE_RULES.guided.countsForMastery).toBe(false);
    expect(MODE_RULES.guided.hints).toBe("unlimited");
    expect(MODE_RULES.standard.hints).toBe("ladder");
    expect(MODE_RULES.standard.autocomplete).toBe(true);
    for (const m of ["interview", "contest"] as const) {
      expect(MODE_RULES[m].autocomplete).toBe(false);
      expect(MODE_RULES[m].snippets).toBe(false);
      expect(MODE_RULES[m].hints).toBe("none");
      expect(MODE_RULES[m].ownTests).toBe(true);
      expect(MODE_RULES[m].masteryWeight).toBe(1.25);
    }
    expect(MODE_RULES.contest.timerSeconds).toBe(2700);
    expect(MODE_RULES.interview.timerSeconds).toBeNull();
    expect(SCAFFOLD_MODES.every((m) => MODE_RULES[m].id === m)).toBe(true);
  });

  it("sanitises stored values", () => {
    expect(sanitizeMode("interview")).toBe("interview");
    expect(sanitizeMode("hard")).toBe("standard");
    expect(sanitizeMode(undefined)).toBe("standard");
  });

  it("budgets runs and the clock", () => {
    expect(runBudget("standard", 500).allowed).toBe(true);
    expect(runBudget("interview", 5)).toEqual({ used: 5, left: 1, allowed: true });
    expect(runBudget("interview", 6).allowed).toBe(false);
    expect(timeLeft("standard", 99)).toBeNull();
    expect(timeLeft("contest", 100)).toBe(2600);
    expect(timeLeft("contest", 99999)).toBe(0);
  });

  it("locks Submit until enough own tests passed in Interview and Contest only", () => {
    expect(submitAllowed("standard", 0)).toBe(true);
    expect(submitAllowed("interview", MIN_OWN_TESTS - 1)).toBe(false);
    expect(submitAllowed("contest", MIN_OWN_TESTS)).toBe(true);
  });
});

describe("edge-case classes", () => {
  it("detects each class", () => {
    expect(classifyInput("[]")).toContain("empty");
    expect(classifyInput("[7]")).toContain("single");
    expect(classifyInput("[1,2,1]")).toContain("duplicates");
    expect(classifyInput("[4,4,4]")).toContain("all-equal");
    expect(classifyInput("[1,0]\n5")).toContain("zero");
    expect(classifyInput("[1,-2]")).toContain("negative");
    expect(classifyInput("[1000000000]\n2")).toContain("extreme");
    expect(classifyInput("\"aab\"")).toContain("duplicates");
    expect(classifyInput("\"\"")).toContain("empty");
    expect(classifyInput("[[1,2],[3]]")).toContain("single");
    expect(classifyInput("not a literal").size).toBe(0);
  });

  it("only scores classes the hidden tests exercise", () => {
    const hidden = ["[]", "[5]", "[-1,2,2]"];
    const none = scoreOwnTests(["[1,2,3]"], hidden);
    expect(none.applicable.sort()).toEqual(["duplicates", "empty", "negative", "single"]);
    expect(none.covered).toEqual([]);
    expect(none.score).toBe(0);
    const some = scoreOwnTests(["[]", "[9]"], hidden);
    expect(some.covered.sort()).toEqual(["empty", "single"]);
    expect(some.missing.sort()).toEqual(["duplicates", "negative"]);
    expect(some.score).toBe(0.5);
    expect(scoreOwnTests([], ["[1,2,3]"]).score).toBe(1);
  });

  it("parses every shipped problem's tests without throwing and finds some class somewhere", async () => {
    let total = 0;
    for (const e of Object.values(problemCatalog)) {
      for (const t of await e.loadTests()) total += classifyInput(t.input).size;
    }
    expect(total).toBeGreaterThan(0);
  });
});
