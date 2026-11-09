import type { Lesson, LessonOutputs } from "@/lib/lessons/types";
import generated from "./generated.json";
import { r1Lessons } from "./R1/scout";
import { s1Lessons } from "./R0/s1";
import { s2Lessons } from "./R0/s2";
import { s3Lessons } from "./R0/s3";
import { s4Lessons } from "./R0/s4";

export const allLessons: Lesson[] = [...s1Lessons, ...s2Lessons, ...s3Lessons, ...s4Lessons, ...r1Lessons];
export const lessonOutputs = generated as LessonOutputs;
