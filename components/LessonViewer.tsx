"use client";

import { useState } from "react";
import { back, canAdvance, isLast, next, solve, startLesson } from "@/lib/lessons/progress";
import { blockKey, type Lesson, type LessonBlock, type LessonComputed } from "@/lib/lessons/types";

function Code({ code, label }: { code: string; label?: string }) {
  return (
    <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[13px] leading-5" aria-label={label ?? "code"}>
      {code.replace(/\n$/, "")}
    </pre>
  );
}

/** Renders `inline code` spans between backticks. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? <code key={i} className="rounded bg-white/10 px-1 font-mono text-[0.9em] [font-variant-ligatures:none]">{part}</code> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

function Recall({ block, solved, onSolved }: { block: Extract<LessonBlock, { kind: "recall" }>; solved: boolean; onSolved: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = solved;
  return (
    <section className="rounded border border-[var(--accent)]/50 bg-[var(--accent)]/10 p-3" aria-label="Recall check" data-testid="recall">
      <p className="mb-2 text-xs uppercase tracking-wide opacity-70">Recall check</p>
      <p className="mb-2 text-sm"><Rich text={block.prompt} /></p>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="choices">
        {block.choices.map((c, i) => {
          const right = done && i === block.answer;
          const wrong = !done && picked === i;
          return (
            <button
              key={i} role="radio" aria-checked={picked === i || right} disabled={done}
              className={`min-h-11 w-full rounded border px-3 py-2 text-left text-sm font-mono ${right ? "border-emerald-400 bg-emerald-500/20" : wrong ? "border-rose-400 bg-rose-500/20" : "border-white/15 bg-black/25"}`}
              onClick={() => { setPicked(i); if (i === block.answer) onSolved(); }}
            >{c}</button>
          );
        })}
      </div>
      {picked !== null && !done && <p className="mt-2 text-sm text-rose-300" data-testid="recall-wrong">Not quite. Look at the screen again and try another answer.</p>}
      {done && <p className="mt-2 text-sm text-emerald-300" data-testid="recall-right"><Rich text={block.explanation} /></p>}
    </section>
  );
}

interface Props { lesson: Lesson; computed: LessonComputed; onFinish?: () => void }

/** One lesson screen at a time (CUR §1). The Next button unlocks once every recall check on the screen is solved. */
export default function LessonViewer({ lesson, computed, onFinish }: Props) {
  const [st, setSt] = useState(startLesson);
  const screen = lesson.screens[st.screen];
  const ok = canAdvance(lesson, st);
  const last = isLast(lesson, st);
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-3" aria-label={`Lesson: ${lesson.title}`}>
      <header>
        <p className="text-xs uppercase tracking-wide opacity-60">{lesson.region} · Lesson</p>
        <h1 className="text-lg font-bold">{lesson.title}</h1>
        <div className="mt-2 flex gap-1" aria-label={`Screen ${st.screen + 1} of ${lesson.screens.length}`} role="img">
          {lesson.screens.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded ${i <= st.screen ? "bg-[var(--accent)]" : "bg-white/15"}`} />)}
        </div>
      </header>
      {st.screen === 0 && <p className="rounded border border-white/10 bg-black/30 p-3 text-sm italic" data-testid="motivation"><Rich text={lesson.motivation} /></p>}
      <h2 className="text-base font-semibold">{screen.title}</h2>
      {screen.blocks.map((b, bi) => {
        const key = blockKey(lesson.id, st.screen, bi);
        switch (b.kind) {
          case "text": return <p key={key} className="text-sm leading-6"><Rich text={b.text} /></p>;
          case "code": return (
            <figure key={key} className="flex flex-col gap-1">
              <Code code={b.code} />
              {computed[key] && (
                <div className="rounded border border-emerald-400/30 bg-emerald-500/10 p-2 font-mono text-xs" data-testid="run-output">
                  <span className="opacity-60">output: </span><span className="whitespace-pre-wrap">{computed[key].output.trimEnd()}</span>
                </div>
              )}
              {b.caption && <figcaption className="text-xs opacity-60">{b.caption}</figcaption>}
            </figure>
          );
          case "idiom": return (
            <aside key={key} className="rounded border border-amber-300/40 bg-amber-400/10 p-3" aria-label="C++ idiom">
              <p className="mb-1 text-xs uppercase tracking-wide text-amber-200">C++ idiom · {b.title}</p>
              <Code code={b.code} />
            </aside>
          );
          case "pitfall": return (
            <aside key={key} className="rounded border border-rose-400/40 bg-rose-500/10 p-3" aria-label="Pitfall">
              <p className="mb-1 text-xs uppercase tracking-wide text-rose-200">Pitfall · {b.title}</p>
              <p className="text-sm leading-6"><Rich text={b.text} /></p>
              {b.code && <Code code={b.code} />}
            </aside>
          );
          case "picture": return (
            <figure key={key}>
              <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-5" aria-label="diagram">{b.lines.join("\n")}</pre>
              {b.caption && <figcaption className="mt-1 text-xs opacity-60">{b.caption}</figcaption>}
            </figure>
          );
          case "recall": return <Recall key={key} block={b} solved={st.solved.has(b.id)} onSolved={() => setSt((s) => solve(s, b.id))} />;
        }
      })}
      <nav className="sticky bottom-0 flex gap-2 bg-[var(--bg,#0b1020)]/90 py-2" aria-label="Lesson navigation">
        <button className="min-h-11 flex-1 rounded border border-white/20 px-3 disabled:opacity-40" disabled={st.screen === 0} onClick={() => setSt(back)}>Back</button>
        {last ? (
          <button className="min-h-11 flex-1 rounded bg-[var(--accent)] px-3 font-semibold text-black disabled:opacity-40" disabled={!ok} onClick={onFinish}>Finish lesson</button>
        ) : (
          <button className="min-h-11 flex-1 rounded bg-[var(--accent)] px-3 font-semibold text-black disabled:opacity-40" disabled={!ok} onClick={() => setSt((s) => next(lesson, s))}>Next</button>
        )}
      </nav>
    </article>
  );
}
