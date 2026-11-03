import type { Lesson, LessonOutputs } from "@/lib/lessons/types";
import generated from "./generated.json";
import { s1Lessons } from "./R0/s1";

export const allLessons: Lesson[] = [...s1Lessons];
export const lessonOutputs = generated as LessonOutputs;
