"use client";

import { useState } from "react";
import LessonViewer from "@/components/LessonViewer";
import { allLessons, lessonComputed } from "@/content/lessons";

/** Lesson playground (B6c): the S1 "Program Basics" lesson. */
export default function DevLesson() {
  const [done, setDone] = useState(false);
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      {done ? <p data-testid="lesson-done" className="text-center text-lg">Lesson complete. Iota nods: now try the exercises!</p> : <LessonViewer lesson={allLessons[0]} computed={lessonComputed} onFinish={() => setDone(true)} />}
    </main>
  );
}
