"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DiffView } from "@/components/DiffView";
import { problemCatalog } from "@/content/gyms/catalog";
import { diffLines, diffStats } from "@/lib/journal/diff";
import { previousEntry, searchJournal, type JournalEntry } from "@/lib/journal/entry";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";

const titleOf = (id: string) => problemCatalog[id]?.meta.title ?? id;
const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
const fmtDate = (at: number) => (at ? new Date(at).toISOString().slice(0, 16).replace("T", " ") + " UTC" : "unknown date");

type Mode = "code" | "past" | "ref";

/** Solution Journal (GDD §6.1 step 6): every accepted solution, searchable, with diffs against a past attempt and the reference. */
export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState<JournalEntry | null>(null);
  const [mode, setMode] = useState<Mode>("code");

  useEffect(() => {
    new SaveService(new IdbBackend()).journal().then(setEntries).catch(() => setEntries([]));
  }, []);

  const shown = useMemo(() => searchJournal(entries ?? [], query, titleOf), [entries, query]);
  const open = sel && shown.includes(sel) ? sel : null;
  const past = open && entries ? previousEntry(entries, open.problemId, open.at) : undefined;
  const reference = open ? problemCatalog[open.problemId]?.reference : undefined;
  const ops = useMemo(() => {
    if (!open) return [];
    if (mode === "past" && past) return diffLines(past.code, open.code);
    if (mode === "ref" && reference) return diffLines(reference, open.code);
    return [];
  }, [open, mode, past, reference]);
  const stats = useMemo(() => diffStats(ops), [ops]);

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Solution Journal</h1>
        <Link href="/play/" className="text-sm underline opacity-80">Back to the map</Link>
      </header>
      <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label="Journal">
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-80">Search by problem, pattern or a line of code</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. window, hash, unordered_map" className="min-h-11 rounded border border-white/15 bg-black/30 px-3" data-testid="journal-search" />
        </label>
        {entries === null && <p className="text-sm opacity-70">Opening your journal…</p>}
        {entries !== null && entries.length === 0 && (
          <p className="text-sm" data-testid="journal-empty">Nothing here yet. Every solution you get accepted in the <Link className="underline" href="/gym/">Gym</Link> or the <Link className="underline" href="/rift/">Daily Rift</Link> is saved here when you continue past the Debrief.</p>
        )}
        {entries !== null && entries.length > 0 && shown.length === 0 && <p className="text-sm opacity-70">No entries match “{query}”.</p>}
        <ul className="flex flex-col gap-2" aria-label="Entries" data-testid="journal-list">
          {shown.map((e) => (
            <li key={`${e.problemId}-${e.at}`}>
              <button className="flex min-h-11 w-full flex-col items-start rounded border border-white/15 bg-black/30 px-3 py-2 text-left" aria-expanded={open === e} onClick={() => { setSel(open === e ? null : e); setMode("code"); }}>
                <span className="flex w-full items-baseline justify-between gap-2">
                  <strong>{titleOf(e.problemId)}</strong>
                  <span className="text-xs opacity-70">{fmtDate(e.at)}</span>
                </span>
                <span className="text-xs opacity-75">
                  {fmtTime(e.seconds)} · {e.hintsUsed} hint{e.hintsUsed === 1 ? "" : "s"}{e.assisted ? " · assisted" : ""}{e.patterns.length ? ` · ${e.patterns.join(", ")}` : ""}
                </span>
              </button>
              {open === e && (
                <div className="mt-2 flex flex-col gap-2 rounded border border-white/10 p-2" data-testid="journal-detail">
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="View">
                    {([["code", "My code"], ["past", "vs past attempt"], ["ref", "vs reference"]] as const).map(([m, label]) => (
                      <button key={m} aria-pressed={mode === m} className={`min-h-11 rounded border px-1 text-xs ${mode === m ? "border-[var(--accent)] bg-[var(--accent)]/20" : "border-white/15 bg-black/30"}`} onClick={() => setMode(m)}>{label}</button>
                    ))}
                  </div>
                  {mode === "code" && <pre className="max-h-64 overflow-auto rounded bg-black/30 p-2 font-mono text-xs" data-testid="journal-code">{e.code}</pre>}
                  {mode === "past" && (past ? (
                    <>
                      <p className="text-xs opacity-80" data-testid="journal-diff-note">Against your attempt on {fmtDate(past.at)}: {stats.added} added · {stats.removed} removed · {Math.round(stats.similarity * 100)}% alike. + is new in this attempt.</p>
                      <DiffView ops={ops} testId="journal-diff" />
                    </>
                  ) : <p className="text-sm opacity-70" data-testid="journal-diff-note">This is your first accepted solution for this problem. Solve it again later (the Rift will bring it back) to compare.</p>)}
                  {mode === "ref" && (reference ? (
                    <>
                      <p className="text-xs opacity-80" data-testid="journal-diff-note">Against the reference: {stats.added} added · {stats.removed} removed · {Math.round(stats.similarity * 100)}% alike. + is only in your code, - only in the reference. Compare the idea, not the lines.</p>
                      <DiffView ops={ops} testId="journal-diff" />
                    </>
                  ) : <p className="text-sm opacity-70" data-testid="journal-diff-note">No reference is bundled for this problem.</p>)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
