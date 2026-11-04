"use client";

import { useEffect, useState } from "react";
import CardBattle from "@/components/CardBattle";
import type { Card, ComputedMap } from "@/lib/cards/types";
import { inlineRuns, lessonKey, type Lesson, type LessonBlock, type LessonOutputs } from "@/lib/lessons/types";

function Inline({ text }: { text: string }) {
  return (
    <>
      {inlineRuns(text).map((r, i) =>
        r.code ? <code key={i} className="rounded bg-black/40 px-1 font-mono text-[0.9em] [font-variant-ligatures:none]">{r.text}</code> : <span key={i}>{r.text}</span>,
      )}
    </>
  );
}

const CALLOUT: Record<"idiom" | "pitfall" | "interview", { label: string; cls: string }> = {
  idiom: { label: "Idiom", cls: "border-emerald-400/60 bg-emerald-500/10" },
  pitfall: { label: "Pitfall", cls: "border-rose-400/60 bg-rose-500/10" },
  interview: { label: "Interview", cls: "border-sky-400/60 bg-sky-500/10" },
};

function Block({ block, output }: { block: LessonBlock; output?: string }) {
  switch (block.kind) {
    case "text":
      return <p className="text-sm leading-6"><Inline text={block.text} /></p>;
    case "code":
      return (
        <figure className="flex flex-col gap-1">
          <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[13px] leading-5 [font-variant-ligatures:none]" aria-label="code">{block.code.replace(/\n$/, "")}</pre>
          {block.run && output !== undefined ? (
            <pre className="overflow-x-auto rounded border border-emerald-400/30 bg-emerald-500/10 p-2 font-mono text-xs leading-5" aria-label="program output" data-testid="lesson-output">
              <span className="mb-1 block font-display text-[10px] uppercase tracking-wider opacity-60">Output</span>{output.replace(/\n$/, "")}
            </pre>
          ) : null}
          {block.caption ? <figcaption className="text-xs opacity-70">{block.caption}</figcaption> : null}
        </figure>
      );
    default: {
      const c = CALLOUT[block.kind];
      return (
        <aside className={`rounded border p-3 text-sm leading-6 ${c.cls}`}>
          <strong className="mr-1 font-display text-xs uppercase tracking-wider">{c.label}{"title" in block ? `: ${block.title}` : ""}</strong>
          <Inline text={block.text} />
        </aside>
      );
    }
  }
}

/** Lesson screens (handheld window, one page at a time), then the lesson's practice cards and linked exercises. */
export default function LessonScreen({ lesson, cards, computed, outputs, onComplete }: { lesson: Lesson; cards: Card[]; computed: ComputedMap; outputs: LessonOutputs; onComplete?: () => void }) {
  const [page, setPage] = useState(0);
  const total = lesson.pages.length;
  const practising = page >= total;
  const practice = cards.filter((c) => lesson.cardIds.includes(c.id));
  // Reaching the practice page means the lesson has been read through.
  useEffect(() => { if (practising) onComplete?.(); }, [practising, onComplete]);

  if (practising) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-3" data-testid="lesson-practice">
        <CardBattle cards={practice} computed={computed} size={Math.min(5, practice.length)} seed={11} />
        <div className="panel p-3 text-sm">
          <h3 className="font-display text-xs uppercase tracking-wider text-[var(--gold)]">Exercises that use this</h3>
          <ul className="mt-1 flex flex-wrap gap-2">
            {lesson.problemIds.map((p) => <li key={p} className="rounded border border-white/15 bg-black/30 px-2 py-1 font-mono text-xs">{p}</li>)}
          </ul>
        </div>
        <button className="px-btn min-h-11 self-start px-4" onClick={() => setPage(0)}>Read the lesson again</button>
      </div>
    );
  }

  const pg = lesson.pages[page];
  return (
    <section className="panel mx-auto flex max-w-2xl flex-col gap-3 p-4" aria-label="Lesson">
      <header className="flex flex-col gap-1">
        <span className="font-display text-[10px] uppercase tracking-wider opacity-60">{lesson.section} · {lesson.title}</span>
        <h2 className="font-display text-lg text-[var(--gold)]">{pg.title}</h2>
      </header>
      <div className="flex flex-col gap-3" data-testid="lesson-page">
        {pg.blocks.map((b, i) => <Block key={`${page}-${i}`} block={b} output={outputs[lessonKey(lesson.id, page, i)]} />)}
      </div>
      <footer className="flex items-center justify-between gap-2">
        <button className="px-btn min-h-11 px-4" disabled={page === 0} onClick={() => setPage(page - 1)}>Back</button>
        <span className="text-xs opacity-70" aria-live="polite">Page {page + 1} / {total}</span>
        <button className="px-btn px-btn-primary min-h-11 px-4" onClick={() => setPage(page + 1)}>{page + 1 === total ? "Practice" : "Next"}</button>
      </footer>
    </section>
  );
}
