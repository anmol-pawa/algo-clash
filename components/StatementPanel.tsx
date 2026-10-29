"use client";

import type { ReactNode } from "react";
import { constraintStats, type Inline, type Statement } from "@/lib/ui/statement";

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.kind === "code" ? <code key={i} className="rounded bg-black/30 px-1 font-mono text-[0.9em] text-[var(--accent)]">{p.text}</code>
        : p.kind === "bold" ? <strong key={i} className="text-[var(--gold)]">{p.text}</strong>
        : <span key={i}>{p.text}</span>,
      )}
    </>
  );
}

/** Problem statement: prose, examples and constraints shown as stat chips (GDD §5). */
export default function StatementPanel({ statement, badge }: { statement: Statement; badge?: ReactNode }) {
  return (
    <article className="panel flex h-full flex-col gap-3 overflow-y-auto p-4 text-sm leading-relaxed" aria-label="Problem statement">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl text-[var(--gold)]">{statement.title}</h2>
        {badge}
      </header>
      {statement.sections.map((sec, si) => (
        <section key={si} className="flex flex-col gap-2">
          {sec.heading && <h3 className="font-display text-xs uppercase tracking-wider opacity-70">{sec.heading}</h3>}
          {/^constraints/i.test(sec.heading) ? (
            <ul className="flex flex-wrap gap-2">
              {constraintStats(sec).map((s, i) => (
                <li key={i} className="rounded border border-white/10 bg-black/25 px-2 py-1">
                  <code className="font-mono text-[var(--accent)]">{s.value}</code>
                  {s.label && <span className="ml-2 opacity-80">{s.label}</span>}
                </li>
              ))}
            </ul>
          ) : (
            sec.blocks.map((b, bi) =>
              b.kind === "p" ? <p key={bi}><Inlines parts={b.inline} /></p>
              : <ul key={bi} className="list-disc space-y-1 pl-5">{b.items.map((it, ii) => <li key={ii}><Inlines parts={it} /></li>)}</ul>,
            )
          )}
        </section>
      ))}
    </article>
  );
}
