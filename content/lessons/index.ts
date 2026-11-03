import type { Lesson, LessonOutputs } from "@/lib/lessons/types";
import generated from "./generated.json";
import { s1Lessons } from "./R0/s1";
import { s2Lessons } from "./R0/s2";

export const allLessons: Lesson[] = [...s1Lessons, ...s2Lessons];
export const lessonOutputs = generated as LessonOutputs;
