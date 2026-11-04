/** Lesson progress lives in the core save's `flags` (no schema change): pure and idempotent. */
import type { CoreSave } from "../save/schema";
import type { Lesson } from "./types";

export const lessonDoneFlag = (lessonId: string): string => `lesson:${lessonId}:done`;

export const isLessonDone = (core: Pick<CoreSave, "flags">, lessonId: string): boolean => core.flags[lessonDoneFlag(lessonId)] === true;

/** Marks a lesson read through to its practice page. Re-reading never changes anything. */
export function markLessonDone(core: CoreSave, lessonId: string): CoreSave {
  if (isLessonDone(core, lessonId)) return core;
  return { ...core, flags: { ...core.flags, [lessonDoneFlag(lessonId)]: true } };
}

/** The first lesson not yet done, in curriculum order (undefined once all are done). */
export function nextLesson(core: Pick<CoreSave, "flags">, lessons: readonly Lesson[]): Lesson | undefined {
  return lessons.find((l) => !isLessonDone(core, l.id));
}

export const lessonsDoneCount = (core: Pick<CoreSave, "flags">, lessons: readonly Lesson[]): number =>
  lessons.filter((l) => isLessonDone(core, l.id)).length;
