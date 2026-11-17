import { describe, expect, it } from "vitest";
import { computed } from "../content/cards";
import { r6Cards } from "../content/cards/R6/spire";
import { allLessons, lessonOutputs } from "../content/lessons";
import { lessonKey } from "../lib/lessons/types";

describe("R6 Stackspire content", () => {
  const lessons = allLessons.filter((l) => l.region === "R6");
  it("every R6 card is practised by exactly one R6 lesson", () => {
    expect(lessons.flatMap((l) => l.cardIds).sort()).toEqual(r6Cards.map((c) => c.id).sort());
  });
  it("the stack-basics lesson has 12 cards and links its five problems", () => {
    const l = lessons.find((x) => x.id === "r6-stack-basics")!;
    expect(l.cardIds).toHaveLength(12);
    expect([...l.problemIds].sort()).toEqual(["crate-brackets", "gauge-stack", "ring-lane", "score-tape", "twin-stack-line"]);
  });
  it("every mcq has distinct choices", () => {
    for (const c of r6Cards) if (c.kind === "mcq" || c.kind === "multi") expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
  });
  it("computes the real outputs", () => {
    expect(computed["r6-stk-predict"].output).toBe("3 3\n");
    expect(computed["r6-stk-depth-trace"].output).toBe("3\n");
    expect(computed["r6-stk-ring-trace"].output).toBe("0\n");
    expect(computed["r6-stk-reverse-parsons"].output).toBe("kcats\n");
    expect(lessonOutputs[lessonKey("r6-stack-basics", 1, 1)]).toBe("1000\n");
    expect(lessonOutputs[lessonKey("r6-stack-basics", 2, 2)]).toBe("30 40 50 60 | head=2\n");
  });
});
