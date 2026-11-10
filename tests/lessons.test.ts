/** Lessons: structure and native verification of every runnable listing. */
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allCards } from "../content/cards";
import { allLessons, lessonOutputs } from "../content/lessons";
import { inlineRuns, lessonKey } from "../lib/lessons/types";
import { verifyLessons } from "../lib/lessons/verify";

const write = process.env.CONTENT_WRITE === "1";
const problemIds = new Set(readdirSync(join(process.cwd(), "content", "problems")).flatMap((r) => readdirSync(join(process.cwd(), "content", "problems", r))));
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
  it("computes the real outputs of the S3 listings", () => {
    expect(outputs[lessonKey("s3-vectors", 0, 1)]).toBe("3 2 4\n");
    expect(outputs[lessonKey("s3-vectors", 0, 4)]).toBe("5 2x3\n");
    expect(outputs[lessonKey("s3-vectors", 1, 1)]).toBe("0 5 0 9\n");
    expect(outputs[lessonKey("s3-vectors", 1, 4)]).toBe("2 3 4 \n");
    expect(outputs[lessonKey("s3-strings", 0, 1)]).toBe("algo rithm or\n");
    expect(outputs[lessonKey("s3-strings", 0, 3)]).toBe("1 3 \n");
    expect(outputs[lessonKey("s3-strings", 1, 1)]).toBe("221\n");
    expect(outputs[lessonKey("s3-strings", 1, 3)]).toBe("1230 1231\n");
    expect(outputs[lessonKey("s3-splitting", 0, 1)]).toBe("3 []\n");
    expect(outputs[lessonKey("s3-splitting", 0, 3)]).toBe("2\n");
  });
  it("computes the real outputs of the S4 listings", () => {
    expect(outputs[lessonKey("s4-structs", 0, 2)]).toBe("1\n");
    expect(outputs[lessonKey("s4-structs", 1, 1)]).toBe("abc\n");
    expect(outputs[lessonKey("s4-lists", 0, 1)]).toBe("123\n");
    expect(outputs[lessonKey("s4-lists", 1, 1)]).toBe("1 2 3 \n");
    expect(outputs[lessonKey("s4-lists", 1, 3)]).toBe("1 2 3 \n");
    expect(outputs[lessonKey("s4-trees-solution", 0, 1)]).toBe("2\n");
    expect(outputs[lessonKey("s4-trees-solution", 1, 1)]).toBe("2\n");
  });
  it("every S4 card is practised by exactly one S4 lesson and every S4 exercise is linked", () => {
    const s4 = allCards.filter((c) => c.id.startsWith("s4-")).map((c) => c.id).sort();
    const lessons = allLessons.filter((l) => l.section === "S4");
    expect(lessons.flatMap((l) => l.cardIds).sort()).toEqual(s4);
    expect(s4.length).toBe(15);
    expect(lessons.flatMap((l) => l.problemIds).sort()).toEqual(
      ["drop-negatives", "forge-chain", "leaf-sum", "middle-link", "rank-roster", "step-counter", "tree-height"],
    );
  });
  it("every S3 card is practised by exactly one S3 lesson", () => {
    const s3 = allCards.filter((c) => c.id.startsWith("s3-")).map((c) => c.id).sort();
    const used = allLessons.filter((l) => l.section === "S3").flatMap((l) => l.cardIds).sort();
    expect(used).toEqual(s3);
    expect(s3.length).toBe(15);
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
