/** Lessons: structure and native verification of every runnable listing. */
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allCards } from "../content/cards";
import { allLessons, lessonOutputs } from "../content/lessons";
import { inlineRuns, lessonKey } from "../lib/lessons/types";
import { verifyLessons } from "../lib/lessons/verify";

const write = process.env.CONTENT_WRITE === "1";
const problemIds = new Set(readdirSync(join(process.cwd(), "content", "problems", "R0")));
const cardIds = new Set(allCards.map((c) => c.id));
const { errors, outputs } = verifyLessons(allLessons, lessonOutputs, { cardIds, problemIds }, write);
if (write) writeFileSync(join(process.cwd(), "content", "lessons", "generated.json"), JSON.stringify(outputs, null, 2) + "\n");

describe("content/lessons", () => {
  it("every lesson is well formed, its listings run natively, and generated.json is current", () => {
    expect(errors).toEqual([]);
  });
  it("computes the real outputs shown on the screens", () => {
    expect(outputs[lessonKey("s1-first-program", 0, 1)]).toBe("hello, mainville\n");
    expect(outputs[lessonKey("s1-types", 1, 1)]).toBe("10000000000\n");
    expect(outputs[lessonKey("s1-arithmetic", 0, 1)]).toBe("3 1\n-3 -1\n-3 1\n");
    expect(outputs[lessonKey("s1-arithmetic", 1, 1)]).toBe("3 3.5 3.5\n");
  });
  it("computes the real outputs of the S2 listings", () => {
    expect(outputs[lessonKey("s2-branches-loops", 0, 1)]).toBe("ABCF\n");
    expect(outputs[lessonKey("s2-branches-loops", 1, 1)]).toBe("1 3 5 \n");
    expect(outputs[lessonKey("s2-functions", 0, 1)]).toBe("1 11\n");
    expect(outputs[lessonKey("s2-functions", 1, 2)]).toBe("int double int \n");
    expect(outputs[lessonKey("s2-recursion-static", 0, 1)]).toBe("1594323\n");
    expect(outputs[lessonKey("s2-recursion-static", 1, 1)]).toBe("123 111\n");
  });
  it("every S2 card is practised by exactly one S2 lesson", () => {
    const s2 = allCards.filter((c) => c.id.startsWith("s2-")).map((c) => c.id).sort();
    const used = allLessons.filter((l) => l.section === "S2").flatMap((l) => l.cardIds).sort();
    expect(used).toEqual(s2);
    expect(s2.length).toBe(15);
  });
  it("every S1 card is practised by exactly one S1 lesson", () => {
    const s1 = allCards.filter((c) => c.id.startsWith("s1-")).map((c) => c.id).sort();
    const used = allLessons.filter((l) => l.section === "S1").flatMap((l) => l.cardIds).sort();
    expect(used).toEqual(s1);
  });
});

describe("inlineRuns", () => {
  it("splits backtick runs", () => {
    expect(inlineRuns("use `int` here")).toEqual([
      { code: false, text: "use " }, { code: true, text: "int" }, { code: false, text: " here" },
    ]);
    expect(inlineRuns("`a`")).toEqual([{ code: true, text: "a" }]);
  });
});
