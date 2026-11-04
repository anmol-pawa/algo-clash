import { describe, expect, it } from "vitest";
import { allLessons } from "../content/lessons";
import { isLessonDone, lessonDoneFlag, lessonsDoneCount, markLessonDone, nextLesson } from "../lib/lessons/progress";
import { newCoreSave } from "../lib/save/schema";

describe("lesson progress", () => {
  it("marks a lesson once, idempotently, without touching other flags", () => {
    const core = { ...newCoreSave(0), flags: { other: 3 } };
    const a = markLessonDone(core, allLessons[0].id);
    expect(isLessonDone(a, allLessons[0].id)).toBe(true);
    expect(a.flags.other).toBe(3);
    expect(markLessonDone(a, allLessons[0].id)).toBe(a);
    expect(lessonDoneFlag("x")).toBe("lesson:x:done");
  });
  it("nextLesson follows curriculum order and ends when all are done", () => {
    let core = newCoreSave(0);
    expect(nextLesson(core, allLessons)?.id).toBe(allLessons[0].id);
    core = markLessonDone(core, allLessons[0].id);
    expect(nextLesson(core, allLessons)?.id).toBe(allLessons[1].id);
    expect(lessonsDoneCount(core, allLessons)).toBe(1);
    for (const l of allLessons) core = markLessonDone(core, l.id);
    expect(nextLesson(core, allLessons)).toBeUndefined();
  });
});
