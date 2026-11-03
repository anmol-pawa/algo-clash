import type { Lesson, LessonComputed } from "@/lib/lessons/types";
import generated from "./generated.json";
import { s1Lesson } from "./R0/s1";

export const allLessons: Lesson[] = [s1Lesson];
export const lessonComputed = generated as LessonComputed;
