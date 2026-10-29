"use client";

import type { VerdictView } from "@/lib/ui/verdictView";

const TONE = { win: "text-emerald-300", lose: "text-rose-300", warn: "text-amber-300" } as const;
const CHIP = { AC: "bg-emerald-500/30", WA: "bg-rose-500/30", TLE: "bg-amber-500/30", RE: "bg-rose-500/30", CE: "bg-amber-500/30" } as const;

function DiffLine({ label, text, mark }: { label: string; text: string; mark?: number }) {
  const at = mark === undefined ? -1 : mark;
  return (
    <div className="flex gap-2">
      <span className="w-16 shrink-0 opacity-60">{label}</span>
      <code className="min-w-0 break-all font-mono">
        {at < 0 ? text : <>{text.slice(0, at)}<mark className="bg-rose-500/50 text-inherit">{text.slice(at, at + 1) || "∅"}</mark>{text.slice(at + 1)}</>}
      </code>
    </div>
  );
}

/** Run/Submit result: headline, per-test chips, and for a wrong answer the input with expected vs got. */
export default function VerdictPanel({ view }: { view: VerdictView | null }) {
  if (!view) return <div className="panel p-4 text-sm opacity-70">Run your code to see the verdict here.</div>;
  return (
    <section className="panel flex flex-col gap-2 p-4 text-sm" aria-live="polite" aria-label="Verdict">
      <div className="flex items-baseline justify-between gap-2">
        <h3 data-testid="verdict" className={`font-display text-lg ${TONE[view.tone]}`}>{view.headline}</h3>
        {view.verdict !== "CE" && <span className="opacity-70">{view.passed}/{view.total} passed</span>}
      </div>
      <p>{view.detail}</p>
      {view.compile?.why && (
        <p className="opacity-90"><strong>Why:</strong> {view.compile.why} <strong>Fix:</strong> {view.compile.fix}</p>
      )}
      {view.compile && <code className="break-all rounded bg-black/30 p-2 font-mono text-xs">{view.compile.message}</code>}
      {view.rows.length > 0 && (
        <ol className="flex flex-wrap gap-1" aria-label="Per-test results">
          {view.rows.map((r) => (
            <li key={r.index} title={`${r.group ?? "test"} · ${r.ms} ms`} className={`flex h-8 min-w-8 items-center justify-center rounded px-1 text-xs ${CHIP[r.verdict]}`}>
              {r.index + 1}
            </li>
          ))}
        </ol>
      )}
      {view.diff && (
        <div className="flex flex-col gap-1 rounded bg-black/30 p-2 text-xs">
          <DiffLine label="input" text={view.diff.input.replace(/\n/g, " ⏎ ")} />
          <DiffLine label="expected" text={view.diff.expected} />
          <DiffLine label="got" text={view.diff.got} mark={view.diff.firstDiff} />
        </div>
      )}
    </section>
  );
}
