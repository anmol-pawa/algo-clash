"use client";

import { useMemo, useState } from "react";
import type { ElaborativePrompt } from "@/content/gyms/catalogTypes";
import { inlineTokens, sectionsForDebrief } from "@/lib/journal/editorial";

function Inline({ text }: { text: string }) {
  return (
    <>
      {inlineTokens(text).map((t, i) =>
        t.kind === "code" ? <code key={i} className="rounded bg-black/30 px-1 font-mono text-[0.9em]">{t.text}</code>
          : t.kind === "bold" ? <strong key={i}>{t.text}</strong> : <span key={i}>{t.text}</span>,
      )}
    </>
  );
}

/** After a win: the elaborative prompt, then the house-style editorial and the reference code (GDD §6.1 step 6, §8.3). */
export default function Debrief({ title, editorial, reference, prompt, onPrompt, onContinue }: {
  title: string;
  editorial: string;
  reference: string;
  prompt?: ElaborativePrompt;
  onPrompt?: (choice: number, correct: boolean) => void;
  onContinue: () => void;
}) {
  const sections = useMemo(() => sectionsForDebrief(editorial), [editorial]);
  const [picked, setPicked] = useState(-1);
  const [showRef, setShowRef] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-3" data-testid="debrief">
      <h1 className="font-display text-xl text-[var(--gold)]">Debrief: {title}</h1>
      {prompt && (
        <section className="px-panel flex flex-col gap-2 p-3" aria-label="Quick check">
          <p className="text-sm font-bold"><Inline text={prompt.question} /></p>
          <div className="flex flex-col gap-2">
            {prompt.options.map((o, i) => (
              <button key={i} className="px-btn min-h-11 px-3 text-left text-sm" disabled={picked >= 0}
                aria-pressed={picked === i}
                onClick={() => { setPicked(i); onPrompt?.(i, i === prompt.answer); }}>
                {picked >= 0 && i === prompt.answer ? "✓ " : picked === i ? "✗ " : ""}<Inline text={o} />
              </button>
            ))}
          </div>
          {picked >= 0 && <p className="text-sm" role="status" data-testid="prompt-feedback">{picked === prompt.answer ? "Right. " : "Not quite. "}<Inline text={prompt.explanation} /></p>}
        </section>
      )}
      {sections.map((s) => (
        <section key={s.title} className="px-panel p-3">
          <h2 className="font-display mb-1 text-base text-[var(--gold)]">{s.title}</h2>
          {s.body.split(/\n{2,}/).map((para, i) => <p key={i} className="mb-1 text-sm leading-relaxed"><Inline text={para} /></p>)}
        </section>
      ))}
      <section className="px-panel p-3">
        <button className="px-btn min-h-11 px-3 text-sm" aria-expanded={showRef} onClick={() => setShowRef((v) => !v)}>{showRef ? "Hide" : "Show"} reference solution</button>
        {showRef && <pre className="mt-2 overflow-x-auto text-xs leading-snug" data-testid="reference">{reference}</pre>}
      </section>
      <button className="px-btn px-btn-primary min-h-11 w-full" onClick={onContinue}>Continue ▶</button>
    </main>
  );
}
