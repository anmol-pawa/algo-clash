import type { Lesson, LessonOutputs } from "@/lib/lessons/types";
import generated from "./generated.json";
import { r1Lessons } from "./R1/scout";
import { r2Lessons } from "./R2/atoll";
import { r3Lessons } from "./R3/woods";
import { r4Lessons } from "./R4/harbor";
import { s1Lessons } from "./R0/s1";
import { s2Lessons } from "./R0/s2";
import { s3Lessons } from "./R0/s3";
import { s4Lessons } from "./R0/s4";

export const allLessons: Lesson[] = [...s1Lessons, ...s2Lessons, ...s3Lessons, ...s4Lessons, ...r1Lessons, ...r2Lessons, ...r3Lessons, ...r4Lessons];
export const lessonOutputs = generated as LessonOutputs;
