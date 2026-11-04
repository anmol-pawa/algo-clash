/** Solution Journal model (GDD §5.3 step 6, §9): one entry per accepted solve. Pure and JSON-safe. */

export interface JournalEntry {
  problemId: string;
  /** Epoch ms of the accepted submission. */
  at: number;
  code: string;
  seconds: number;
  hintsUsed: number;
  /** True when an editorial was read, more than 2 hints were used, or Guided mode was on (never advances mastery). */
  assisted: boolean;
  /** Patterns of the problem when solved, for search. */
  patterns: string[];
  /** The player's answer to the elaborative prompt, if one was asked. */
  reflection?: { promptId: string; choice: number; correct: boolean };
}

const MAX_CODE = 20000;
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const nat = (v: unknown, max: number): number => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.round(v))) : 0);

/** Coerces untrusted data (storage, imported JSON) into an entry, or null when it is unusable. */
export function sanitizeEntry(raw: unknown): JournalEntry | null {
  const r = rec(raw);
  if (typeof r.problemId !== "string" || !r.problemId || typeof r.code !== "string") return null;
  const out: JournalEntry = {
    problemId: r.problemId.slice(0, 64),
    at: nat(r.at, 8.64e15),
    code: r.code.slice(0, MAX_CODE),
    seconds: nat(r.seconds, 86400),
    hintsUsed: nat(r.hintsUsed, 3),
    assisted: r.assisted === true,
    patterns: (Array.isArray(r.patterns) ? r.patterns : []).filter((p): p is string => typeof p === "string").slice(0, 8).map((p) => p.slice(0, 40)),
  };
  const f = rec(r.reflection);
  if (typeof f.promptId === "string" && typeof f.choice === "number" && typeof f.correct === "boolean") {
    out.reflection = { promptId: f.promptId.slice(0, 64), choice: nat(f.choice, 9), correct: f.correct };
  }
  return out;
}

/** Newest first. */
export function sortNewest(entries: readonly JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => b.at - a.at);
}

export interface JournalQuery {
  pattern?: string;
  /** Case-insensitive substring over problem id and code. */
  text?: string;
  /** Hide assisted solves. */
  unassistedOnly?: boolean;
}

export function searchJournal(entries: readonly JournalEntry[], q: JournalQuery): JournalEntry[] {
  const needle = q.text?.trim().toLowerCase() ?? "";
  return sortNewest(entries).filter(
    (e) =>
      (!q.pattern || e.patterns.includes(q.pattern)) &&
      (!q.unassistedOnly || !e.assisted) &&
      (needle === "" || e.problemId.toLowerCase().includes(needle) || e.code.toLowerCase().includes(needle)),
  );
}

/** Entries of one problem, newest first. */
export function historyOf(entries: readonly JournalEntry[], problemId: string): JournalEntry[] {
  return sortNewest(entries.filter((e) => e.problemId === problemId));
}

/** The attempt to compare a fresh solve against: the newest entry strictly older than `at`. */
export function previousBefore(entries: readonly JournalEntry[], problemId: string, at: number): JournalEntry | null {
  return historyOf(entries, problemId).find((e) => e.at < at) ?? null;
}

/** Per-problem summary for the journal list: count, newest entry, fastest unassisted time. */
export function summarize(entries: readonly JournalEntry[]): { problemId: string; count: number; latest: JournalEntry; bestSeconds: number | null }[] {
  const by = new Map<string, JournalEntry[]>();
  for (const e of entries) by.set(e.problemId, [...(by.get(e.problemId) ?? []), e]);
  return [...by.entries()]
    .map(([problemId, list]) => {
      const sorted = sortNewest(list);
      const clean = list.filter((e) => !e.assisted).map((e) => e.seconds);
      return { problemId, count: list.length, latest: sorted[0], bestSeconds: clean.length ? Math.min(...clean) : null };
    })
    .sort((a, b) => b.latest.at - a.latest.at);
}
