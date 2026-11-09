import { describe, expect, it } from "vitest";
import { computed } from "../content/cards";
import { r1Cards } from "../content/cards/R1/scout";
import { allLessons } from "../content/lessons";

describe("R1 Scout School content", () => {
  it("computes the loop-counting answers natively", () => {
    expect(computed["r1-triangle-loop"].output).toBe("45\n");
    expect(computed["r1-halving-loop"].output).toBe("9\n");
    expect(computed["r1-sqrt-loop"].output).toBe("1000\n");
  });
  it("generated constraint and recurrence cards have the right keyed answers", () => {
    const ans = (id: string) => { const c = r1Cards.find((x) => x.id === id); if (c?.kind !== "mcq") throw new Error(id); return c.choices[c.answer]; };
    expect(ans("r1-budget-1")).toBe("O(n!)");
    expect(ans("r1-budget-2")).toBe("O(2^n)");
    expect(ans("r1-budget-3")).toBe("O(n^3)");
    expect(ans("r1-budget-4")).toBe("O(n^2)");
    expect(ans("r1-budget-5")).toBe("O(n log n)");
    expect(ans("r1-budget-6")).toBe("O(n)");
    expect(ans("r1-recurrence-2")).toBe("Θ(n log n)");
    expect(ans("r1-recurrence-6")).toBe("Θ(n^1.585)");
  });
  it("every mcq has distinct choices including the answer, and every R1 card is practised by exactly one R1 lesson", () => {
    for (const c of r1Cards) if (c.kind === "mcq") {
      expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
      expect(c.choices.length, c.id).toBeGreaterThanOrEqual(3);
    }
    const used = allLessons.filter((l) => l.region === "R1").flatMap((l) => l.cardIds).sort();
    expect(used).toEqual(r1Cards.map((c) => c.id).sort());
  });
});
