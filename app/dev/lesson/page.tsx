"use client";

import { useState } from "react";
import LessonScreen from "@/components/LessonScreen";
import { allCards, computed } from "@/content/cards";
import { allLessons, lessonOutputs } from "@/content/lessons";

/** Lesson playground (B6c): pick a lesson, read its pages, then practise its cards. */
export default function DevLesson() {
  const [id, setId] = useState(allLessons[0].id);
  const lesson = allLessons.find((l) => l.id === id)!;
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <nav className="mx-auto mb-3 flex max-w-2xl flex-wrap gap-2" aria-label="Lessons">
        {allLessons.map((l) => (
          <button key={l.id} className={`px-btn min-h-11 px-3 text-sm ${l.id === id ? "px-btn-primary" : ""}`} aria-pressed={l.id === id} onClick={() => setId(l.id)}>{l.title}</button>
        ))}
      </nav>
      <LessonScreen key={lesson.id} lesson={lesson} cards={allCards} computed={computed} outputs={lessonOutputs} />
    </main>
  );
}
