"use client";

import { useState } from "react";
import { ASSISTED_HINT_COUNT, type Hint } from "@/lib/items/hints";

/** The 3-rung hint ladder (GDD §6.6): each rung costs one Hint Token; the last makes the win assisted. */
export default function HintPanel({ hints, revealed, tokens, disabled, free, onReveal }: {
  hints: Hint[]; revealed: number; tokens: number; disabled?: boolean; /** Guided mode: hints cost nothing. */ free?: boolean; onReveal: () => void;
}) {
  const [open, setOpen] = useState(false);
  const next = hints[revealed];
  const warn = next && revealed + 1 >= ASSISTED_HINT_COUNT;
  return (
    <section className="panel flex flex-col gap-2 p-2 text-sm" aria-label="Hints" data-testid="hint-panel">
      <button className="px-btn flex min-h-11 items-center justify-between gap-2 px-3" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>Hints {revealed}/{hints.length}</span>
        <span className="opacity-70">{free ? "free" : `${tokens} token${tokens === 1 ? "" : "s"}`} {open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {revealed > 0 && (
            <div className="flex max-h-[18dvh] flex-col gap-2 overflow-auto" tabIndex={0} aria-label="Revealed hints">
              {hints.slice(0, revealed).map((h) => (
                <p key={h.rung} className="rounded border border-white/10 p-2"><b className="text-[var(--gold)]">{h.rung}.</b> {h.text}</p>
              ))}
            </div>
          )}
          {next ? (
            <>
              <button className="px-btn px-btn-primary min-h-11" disabled={disabled || (!free && tokens < 1)} onClick={onReveal}>
                {!free && tokens < 1 ? "No Hint Tokens left" : `Reveal ${next.rung}${free ? "" : " (1 token)"}`}
              </button>
              {warn && <p className="text-xs text-amber-300">The Key insight gives the idea away: this win will not advance your mastery.</p>}
            </>
          ) : <p className="text-xs opacity-70">That is the whole ladder.</p>}
        </div>
      )}
    </section>
  );
}
