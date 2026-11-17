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
  it("the monotonic-stack lesson has 12 cards and links its eight problems", () => {
    const l = lessons.find((x) => x.id === "r6-monotonic-stack")!;
    expect(l.cardIds).toHaveLength(12);
    expect([...l.problemIds].sort()).toEqual(["cistern-rows", "convoy-count", "drift-rocks", "heat-wave", "lantern-wall", "skyline-hall", "smallest-seal", "valley-tally"]);
  });
  it("the expressions lesson has 12 cards and links its four problems", () => {
    const l = lessons.find((x) => x.id === "r6-expressions")!;
    expect(l.cardIds).toHaveLength(12);
    expect([...l.problemIds].sort()).toEqual(["ledger-fold", "tape-calculator", "tidy-route", "unroll-banner"]);
  });
  it("every mcq has distinct choices", () => {
    for (const c of r6Cards) if (c.kind === "mcq" || c.kind === "multi") expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
  });
  it("computes the real outputs", () => {
    expect(computed["r6-stk-predict"].output).toBe("3 3\n");
    expect(computed["r6-stk-depth-trace"].output).toBe("3\n");
    expect(computed["r6-stk-ring-trace"].output).toBe("0\n");
    expect(computed["r6-stk-reverse-parsons"].output).toBe("kcats\n");
    expect(computed["r6-mono-predict"].output).toBe("7 7 -1 5 -1 -1 \n");
    expect(computed["r6-mono-pops-trace"].output).toBe("6 2\n");
    expect(computed["r6-mono-hist-trace"].output).toBe("12\n");
    expect(computed["r6-mono-parsons"].output).toBe("2 1 0 \n");
    expect(computed["r6-mono-cloze"].output).toBe("1 2 1 0 \n");
    expect(computed["r6-expr-predict"].output).toBe("9\n");
    expect(computed["r6-expr-div-trace"].output).toBe("-15 -1\n");
    expect(computed["r6-expr-path-parsons"].output).toBe("a c \n");
    expect(computed["r6-expr-cloze"].output).toBe("8\n");
    expect(computed["r6-expr-decode-trace"].output).toBe("abbabb\n");
    expect(lessonOutputs[lessonKey("r6-expressions", 0, 1)]).toBe("30\n");
    expect(lessonOutputs[lessonKey("r6-expressions", 1, 1)]).toBe("12\n");
    expect(lessonOutputs[lessonKey("r6-expressions", 2, 1)]).toBe("accaccacc\n");
    expect(lessonOutputs[lessonKey("r6-monotonic-stack", 0, 1)]).toBe("3 1 1 0 1 1 0 0 \n");
    expect(lessonOutputs[lessonKey("r6-monotonic-stack", 1, 2)]).toBe("15\n");
    expect(lessonOutputs[lessonKey("r6-monotonic-stack", 2, 1)]).toBe("10\n");
    expect(lessonOutputs[lessonKey("r6-stack-basics", 1, 1)]).toBe("1000\n");
    expect(lessonOutputs[lessonKey("r6-stack-basics", 2, 2)]).toBe("30 40 50 60 | head=2\n");
  });
});
