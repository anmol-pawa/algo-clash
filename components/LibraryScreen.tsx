"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import VisualiserPlayer from "@/components/VisualiserPlayer";
import { parseNumbers } from "@/lib/visualiser/parse";
import { SORT_COMPLEXITY, SORT_NAMES, traceSort, type SortKind } from "@/lib/visualiser/sort";
import type { Trace } from "@/lib/visualiser/types";
import { traceLongestDistinct, tracePairSum, traceWindowMax } from "@/lib/visualiser/window";

type VisId = SortKind | "pair" | "window" | "distinct";

interface VisDef {
  id: VisId;
  title: string;
  group: string;
  sample: string;
  hasParam?: { label: string; sample: number };
  blurb: string;
  cost: string;
}

const DEFS: VisDef[] = [
  ...(["bubble", "selection", "insertion"] as SortKind[]).map((k) => ({
    id: k, title: SORT_NAMES[k], group: "Array and sort stepper", sample: "5 2 9 1 7 3",
    blurb: SORT_COMPLEXITY[k].note, cost: `Time ${SORT_COMPLEXITY[k].time} · space ${SORT_COMPLEXITY[k].space} · ${SORT_COMPLEXITY[k].stable ? "stable" : "not stable"}`,
  })),
  { id: "pair", title: "Two pointers: pair sum", group: "Two pointers and windows", sample: "1 3 4 6 8 11", hasParam: { label: "Target", sample: 14 },
    blurb: "On a sorted array, one pointer per end. A sum that is too small can only be fixed by moving L right; too big only by moving R left. Neither pointer ever backs up.", cost: "Time O(n) · space O(1)" },
  { id: "window", title: "Sliding window: best sum of k", group: "Two pointers and windows", sample: "2 1 5 1 3 2 8 1", hasParam: { label: "Window size k", sample: 3 },
    blurb: "Keep a running sum. Each slide adds one value and drops one, so no window is ever re-summed from scratch.", cost: "Time O(n) · space O(1)" },
  { id: "distinct", title: "Variable window: longest with no repeat", group: "Two pointers and windows", sample: "4 1 2 1 3 4 2 5",
    blurb: "Grow on the right. On a repeat, jump the left edge just past the old copy. Each index enters and leaves at most once.", cost: "Time O(n) · space O(n) for the last-seen map" },
];

function build(def: VisDef, values: number[], param: number): Trace {
  switch (def.id) {
    case "pair": return tracePairSum([...values].sort((a, b) => a - b), param);
    case "window": return traceWindowMax(values, param);
    case "distinct": return traceLongestDistinct(values);
    default: return traceSort(def.id, values);
  }
}

/** Library (`/library`): the visualisers, each driven by tested solver code; the player types their own input. */
export default function LibraryScreen() {
  const [id, setId] = useState<VisId>("bubble");
  const def = DEFS.find((d) => d.id === id)!;
  const [text, setText] = useState(def.sample);
  const [param, setParam] = useState(def.hasParam?.sample ?? 0);
  const parsed = parseNumbers(text);
  const trace = useMemo(() => (parsed.ok ? build(def, parsed.values, param) : null), [def, parsed.ok, text, param]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (d: VisDef) => { setId(d.id); setText(d.sample); setParam(d.hasParam?.sample ?? 0); };
  const groups = [...new Set(DEFS.map((d) => d.group))];
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Library</h1>
        <Link href="/" className="text-sm underline opacity-80">Title</Link>
      </header>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <p className="text-sm">Watch an algorithm run one step at a time, then type your own numbers. Every frame comes from tested solver code.</p>
        {groups.map((g) => (
          <div key={g} className="flex flex-col gap-1">
            <h2 className="text-xs uppercase opacity-70">{g}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEFS.filter((d) => d.group === g).map((d) => (
                <button key={d.id} className={`px-btn min-h-11 px-2 text-left text-sm ${d.id === id ? "border-amber-300 bg-amber-400/20" : ""}`} aria-pressed={d.id === id} data-vis={d.id} onClick={() => choose(d)}>{d.title}</button>
              ))}
            </div>
          </div>
        ))}
        <section className="panel flex flex-col gap-2 p-3">
          <h2 className="font-display text-lg text-[var(--gold)]">{def.title}</h2>
          <p className="text-sm">{def.blurb}</p>
          <p className="text-xs opacity-80">{def.cost}</p>
          <label className="flex flex-col gap-1 text-sm">
            Your numbers (up to 16, separated by spaces or commas)
            <input className="min-h-11 border-2 border-white/30 bg-black/40 px-2 font-mono text-base" value={text} onChange={(e) => setText(e.target.value)} inputMode="text" data-testid="vis-input" aria-invalid={!parsed.ok} />
          </label>
          {def.hasParam && (
            <label className="flex flex-col gap-1 text-sm">
              {def.hasParam.label}
              <input className="min-h-11 w-28 border-2 border-white/30 bg-black/40 px-2 font-mono text-base" type="number" value={param} onChange={(e) => setParam(Math.trunc(Number(e.target.value) || 0))} data-testid="vis-param" />
            </label>
          )}
          {!parsed.ok && <p className="text-sm text-red-300" role="alert" data-testid="vis-error">{parsed.error}</p>}
        </section>
        {trace && <VisualiserPlayer key={`${id}|${text}|${param}`} trace={trace} />}
      </div>
    </main>
  );
}
