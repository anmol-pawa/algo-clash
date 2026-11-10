"use client";

import { useEffect, useState } from "react";
import type { Frame, MarkKind, Trace } from "@/lib/visualiser/types";

const MARK_STYLE: Record<MarkKind, string> = {
  compare: "border-amber-300 bg-amber-400/30",
  swap: "border-rose-300 bg-rose-500/40",
  sorted: "border-emerald-400 bg-emerald-500/25",
  found: "border-emerald-300 bg-emerald-400/50",
  inWindow: "border-sky-300 bg-sky-500/30",
  key: "border-violet-300 bg-violet-500/35",
};

function Cells({ frame }: { frame: Frame }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5" role="list" aria-label="Array">
      {frame.array.map((v, i) => {
        const kind = [...frame.marks].reverse().find((m) => m.index === i)?.kind;
        const ptrs = frame.pointers.filter((p) => p.index === i).map((p) => p.label).join("·");
        return (
          <div key={i} role="listitem" className="flex flex-col items-center gap-0.5" aria-label={`index ${i} value ${v}${kind ? ` ${kind}` : ""}`}>
            <div className={`flex h-11 min-w-11 items-center justify-center border-2 px-1 font-mono text-base ${kind ? MARK_STYLE[kind] : "border-white/30"}`} data-mark={kind ?? ""}>{v}</div>
            <span className="text-[10px] opacity-60">{i}</span>
            <span className="h-4 font-display text-xs text-[var(--gold)]">{ptrs}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Plays a precomputed Trace: step back/forward, autoplay, restart. Pure presentation. */
export default function VisualiserPlayer({ trace }: { trace: Trace }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = trace.frames.length - 1;
  const at = Math.min(step, last);
  useEffect(() => {
    if (!playing || at >= last) return;
    const t = setTimeout(() => setStep(at + 1), 650);
    return () => clearTimeout(t);
  }, [playing, at, last]);
  const frame = trace.frames[at]!;
  return (
    <section className="panel flex flex-col gap-3 p-3" data-testid="vis-player" aria-label="Visualiser">
      <Cells frame={frame} />
      {frame.state && (
        <p className="text-center font-mono text-xs" data-testid="vis-state">
          {Object.entries(frame.state).map(([k, v]) => `${k} = ${v}`).join("   ")}
        </p>
      )}
      <p className="min-h-12 text-sm leading-snug" data-testid="vis-note" aria-live="polite">{frame.note}</p>
      <div className="flex items-center gap-2">
        <button className="px-btn min-h-11 flex-1" disabled={at === 0} onClick={() => { setPlaying(false); setStep(at - 1); }} data-testid="vis-back">◀ Back</button>
        <button className="px-btn px-btn-primary min-h-11 flex-1" onClick={() => { if (at >= last) setStep(0); setPlaying((p) => !p); }} data-testid="vis-play">{playing && at < last ? "Pause" : at >= last ? "Replay" : "Play"}</button>
        <button className="px-btn min-h-11 flex-1" disabled={at >= last} onClick={() => { setPlaying(false); setStep(at + 1); }} data-testid="vis-next">Step ▶</button>
      </div>
      <p className="text-center text-xs opacity-70" data-testid="vis-count">Step {at + 1} of {trace.frames.length}</p>
    </section>
  );
}
