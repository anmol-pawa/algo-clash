"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LessonScreen from "@/components/LessonScreen";
import { allCards, computed } from "@/content/cards";
import { allLessons, lessonOutputs } from "@/content/lessons";
import { isLessonDone, lessonsDoneCount, markLessonDone, nextLesson } from "@/lib/lessons/progress";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";

/** The Academy (`/learn`): the lesson list with done marks, and the open lesson. Reading a lesson through to practice saves it. */
export default function LessonsScreen() {
  const [open, setOpen] = useState<string | null>(null);
  const [flags, setFlags] = useState<Record<string, boolean | number | string>>({});
  const [ready, setReady] = useState(false);
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then((core) => setFlags(core.flags)).catch(() => {}).finally(() => setReady(true));
  }, []);

  const complete = useCallback((id: string) => {
    const s = svc.current;
    if (!s) return;
    s.load().then((core) => {
      const next = markLessonDone(core, id);
      setFlags(next.flags);
      return next === core ? undefined : s.save(next);
    }).catch(() => {});
  }, []);

  const view = { flags };
  const lesson = allLessons.find((l) => l.id === open);
  const next = nextLesson(view, allLessons);
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">The Academy</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      {lesson ? (
        <div className="flex flex-col gap-3">
          <button className="px-btn mx-auto min-h-11 w-full max-w-2xl px-4 text-left text-sm" onClick={() => setOpen(null)}>← All lessons</button>
          <LessonScreen key={lesson.id} lesson={lesson} cards={allCards} computed={computed} outputs={lessonOutputs} onComplete={() => complete(lesson.id)} />
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <a href="/scout/" className="px-btn flex min-h-11 items-center justify-center text-sm" data-testid="scout-link">Scout School: recognition blitz</a>
          <p className="text-sm opacity-80" data-testid="lessons-progress">{lessonsDoneCount(view, allLessons)} of {allLessons.length} lessons read{next ? ` · up next: ${next.title}` : " · all done"}</p>
          <ul className="flex flex-col gap-2" aria-label="Lessons">
            {allLessons.map((l) => {
              const done = isLessonDone(view, l.id);
              return (
                <li key={l.id}>
                  <button className="panel flex min-h-16 w-full items-center justify-between gap-3 p-3 text-left" disabled={!ready} onClick={() => setOpen(l.id)}>
                    <span>
                      <span className="block font-display text-[10px] uppercase tracking-wider opacity-60">{l.section}</span>
                      <span className="block font-display text-base text-[var(--gold)]">{l.title}</span>
                      <span className="block text-sm opacity-80">{l.summary}</span>
                    </span>
                    <span className={`shrink-0 rounded border px-2 py-1 font-display text-[10px] uppercase ${done ? "border-emerald-400/60 bg-emerald-500/15" : l.id === next?.id ? "border-amber-400/60 bg-amber-500/15" : "border-white/20 bg-black/30"}`}>{done ? "Read" : l.id === next?.id ? "Next" : "New"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
}
