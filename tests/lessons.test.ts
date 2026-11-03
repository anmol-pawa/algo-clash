/** Lessons: progress logic and native verification of every code block. */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allLessons, lessonComputed as stored } from "../content/lessons";
import { verifyLessons } from "../lib/content/lessonsNative";
import { back, canAdvance, isComplete, next, recallIds, solve, startLesson, validateLesson } from "../lib/lessons/progress";
import { blockKey } from "../lib/lessons/types";

const write = process.env.CONTENT_WRITE === "1";
const { errors, computed } = verifyLessons(allLessons, stored, write);
if (write) writeFileSync(join(process.cwd(), "content", "lessons", "generated.json"), JSON.stringify(computed, null, 2) + "\n");

const lesson = allLessons[0];

describe("lessons content", () => {
  it("is structurally valid", () => { for (const l of allLessons) expect(validateLesson(l)).toEqual([]); });
  it("compiles every program and generated outputs are current", () => { expect(errors).toEqual([]); });
  it("shows the real negative-division output", () => {
    const si = lesson.screens.findIndex((s) => s.title.startsWith("Division"));
    const bi = lesson.screens[si].blocks.findIndex((b) => b.kind === "code");
    expect(computed[blockKey(lesson.id, si, bi)].output).toBe("3 1\n-3 -1\n-3 1\n");
  });
  it("prints 1e+09 for the double literal", () => {
    const si = lesson.screens.findIndex((s) => s.title.startsWith("Literals"));
    const bi = lesson.screens[si].blocks.findIndex((b) => b.kind === "code");
    expect(computed[blockKey(lesson.id, si, bi)].output).toBe("1000000007\n1e+09\n10000000000\n");
  });
});

describe("lessons progress", () => {
  it("blocks advancing until recall checks are solved", () => {
    let st = startLesson();
    const ids = recallIds(lesson.screens[0]);
    expect(ids.length).toBeGreaterThan(0);
    expect(canAdvance(lesson, st)).toBe(false);
    expect(next(lesson, st)).toBe(st);
    for (const id of ids) st = solve(st, id);
    st = next(lesson, st);
    expect(st.screen).toBe(1);
    expect(back(st).screen).toBe(0);
    expect(back(back(st)).screen).toBe(0);
  });
  it("completes only on the last screen with everything solved", () => {
    let st = startLesson();
    expect(isComplete(lesson, st)).toBe(false);
    for (let i = 0; i < lesson.screens.length; ++i) {
      for (const id of recallIds(lesson.screens[st.screen])) st = solve(st, id);
      st = next(lesson, st);
    }
    expect(st.screen).toBe(lesson.screens.length - 1);
    expect(isComplete(lesson, st)).toBe(true);
  });
  it("rejects malformed lessons", () => {
    expect(validateLesson({ ...lesson, screens: lesson.screens.slice(0, 2) }).length).toBeGreaterThan(0);
  });
});
