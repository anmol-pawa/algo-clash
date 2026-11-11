import { describe, expect, it } from "vitest";
import { computed } from "../content/cards";
import { r4Cards } from "../content/cards/R4/harbor";
import { allLessons, lessonOutputs } from "../content/lessons";
import { lessonKey } from "../lib/lessons/types";

describe("R4 Hashwood Harbor content", () => {
  it("has 37 cards, each practised by exactly one R4 lesson, all lessons linking the 9 R4 problems", () => {
    const lessons = allLessons.filter((l) => l.region === "R4");
    expect(r4Cards).toHaveLength(37);
    expect(lessons.flatMap((l) => l.cardIds).sort()).toEqual(r4Cards.map((c) => c.id).sort());
    expect(lessons.flatMap((l) => l.problemIds).sort()).toEqual(
      ["brick-gap", "crate-variety", "drum-bag", "echo-strand", "locker-board", "longest-echo", "twin-scripts", "verse-match", "word-chain-window"],
    );
  });
  it("every mcq has distinct choices", () => {
    for (const c of r4Cards) if (c.kind === "mcq") expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
  });
  it("computes the real outputs", () => {
    expect(computed["r4-hash-chain-trace"].output).toBe("4\n");
    expect(computed["r4-key-bijection-trace"].output).toBe("100\n");
    expect(computed["r4-rh-2bit-predict"].output).toBe("27 108 177 \n");
    expect(computed["r4-rh-bsearch-trace"].output).toBe("3\n");
    expect(lessonOutputs[lessonKey("r4-hash-internals", 1, 1)]).toBe("7 rehashes moved 1016 entries for 1000 inserts\n");
    expect(lessonOutputs[lessonKey("r4-rolling-hash", 0, 1)]).toBe("2\n");
  });
});
