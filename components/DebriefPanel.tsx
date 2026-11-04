"use client";

import { useMemo, useState } from "react";
import { DiffView } from "@/components/DiffView";
import { diffLines, diffStats } from "@/lib/journal/diff";
import { inlineTokens, sectionsForDebrief } from "@/lib/journal/editorial";
import { gradePrompt, type ElaborativePrompt } from "@/lib/journal/prompt";

export interface DebriefInfo {
  title: string;
  editorial: string;
  reference: string;
  prompt?: ElaborativePrompt;
  parSeconds: number;
}

export interface DebriefDone {
  /** Option picked for the elaborative prompt, -1 when skipped or absent. */
  promptChoice: number;
  promptCorrect: boolean;
  /** True when the player opened the editorial before continuing (assisted-ness is set by hints in C5). */
  readEditorial: boolean;
}

function Inline({ line }: { line: string }) {
  return (
    <>
      {inlineTokens(line).map((t, i) =>
        t.kind === "code" ? <code key={i} className="rounded bg-black/30 px-1 font-mono text-[0.9em] text-[var(--accent)]">{t.text}</code>
        : t.kind === "bold" ? <strong key={i} className="text-[var(--gold)]">{t.text}</strong>
        : <span key={i}>{t.text}</span>,
      )}
    </>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Debrief after a win (GDD §6.1 step 6): time vs par, one elaborative question, your code vs the reference, the editorial. */
export default function DebriefPanel({ info, code, seconds, heartsLeft, onContinue }: {
  info: DebriefInfo;
  code: string;
  seconds: number;
  heartsLeft: number;
  onContinue: (d: DebriefDone) => void;
}) {
  const [choice, setChoice] = useState(-1);
  const [opened, setOpened] = useState(false);
  const sections = useMemo(() => sectionsForDebrief(info.editorial), [info.editorial]);
  const ops = useMemo(() => diffLines(info.reference, code), [info.reference, code]);
  const stats = useMemo(() => diffStats(ops), [ops]);
  const p = info.prompt;
  const answered = choice >= 0;
  const underPar = seconds <= info.parSeconds;

  return (
    <section className="panel flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-4 text-sm leading-relaxed" aria-label="Debrief" data-testid="debrief">
      <header>
        <h2 className="font-display text-xl text-[var(--gold)]">Debrief: {info.title}</h2>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>Time <strong className={underPar ? "text-emerald-300" : "text-amber-300"}>{fmt(seconds)}</strong> / par {fmt(info.parSeconds)}</span>
          <span>Hearts left <strong>{heartsLeft}</strong></span>
        </p>
      </header>

      {p && (
        <div className="flex flex-col gap-2" data-testid="debrief-prompt">
          <h3 className="font-display text-xs uppercase tracking-wider opacity-70">Quick check</h3>
          <p><Inline line={p.question} /></p>
          <ul className="flex flex-col gap-2">
            {p.options.map((o, i) => {
              const picked = choice === i;
              const right = answered && i === p.answer;
              return (
                <li key={i}>
                  <button
                    className={`px-btn min-h-11 w-full text-left ${right ? "ring-2 ring-emerald-400" : picked ? "ring-2 ring-rose-400" : ""}`}
                    disabled={answered}
                    onClick={() => setChoice(i)}
                  ><Inline line={o} /></button>
                </li>
              );
            })}
          </ul>
          {answered && (
            <p role="status" data-testid="prompt-result">
              <strong className={gradePrompt(p, choice) ? "text-emerald-300" : "text-rose-300"}>{gradePrompt(p, choice) ? "Right." : "Not quite."}</strong>{" "}
              <Inline line={p.why} />
            </p>
          )}
        </div>
      )}

      <details onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) setOpened(true); }}>
        <summary className="min-h-11 cursor-pointer py-2 font-display text-xs uppercase tracking-wider opacity-80">Your code vs the reference ({stats.added} added · {stats.removed} removed · {Math.round(stats.similarity * 100)}% alike)</summary>
        <DiffView ops={ops} testId="debrief-diff" />
        <p className="mt-1 text-xs opacity-70">+ is in your code only, - is in the reference only. Different is fine; compare the idea, not the lines.</p>
      </details>

      <details onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) setOpened(true); }}>
        <summary className="min-h-11 cursor-pointer py-2 font-display text-xs uppercase tracking-wider opacity-80">Editorial ({sections.length} sections)</summary>
        <div className="flex flex-col gap-3" data-testid="debrief-editorial">
          {sections.map((s) => (
            <section key={s.title}>
              <h3 className="font-display text-sm text-[var(--gold)]">{s.title}</h3>
              {s.body.split(/\n{2,}/).map((para, i) => <p key={i} className="mt-1"><Inline line={para.replace(/\n/g, " ")} /></p>)}
            </section>
          ))}
        </div>
      </details>

      <button
        className="px-btn px-btn-primary min-h-11 w-full"
        onClick={() => onContinue({ promptChoice: choice, promptCorrect: p ? answered && gradePrompt(p, choice) : false, readEditorial: opened })}
      >Continue ▶</button>
    </section>
  );
}
