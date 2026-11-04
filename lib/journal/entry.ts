/** Solution Journal entries (GDD §6.1 step 6, §9): every accepted solution, with how it was earned. */

export interface JournalEntry {
  problemId: string;
  /** Epoch ms of the accepted submission. */
  at: number;
  code: string;
  seconds: number;
  hintsUsed: number;
  /** True when the editorial was read, a hint ladder rung 3 was used, or a lens helped (GDD §6.6). */
  assisted: boolean;
  /** Pattern ids copied from the problem meta so the journal can be searched offline of the catalog. */
  patterns: string[];
  /** Choice index the player picked for the elaborative prompt, -1 when skipped. */
  promptChoice: number;
  promptCorrect: boolean;
}

const num = (v: unknown, d: number, min: number, max: number): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;

export function sanitizeJournalEntry(raw: unknown): JournalEntry | null {
  const r = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  if (typeof r.problemId !== "string" || !r.problemId || typeof r.code !== "string") return null;
  const patterns = (Array.isArray(r.patterns) ? r.patterns : []).filter((p): p is string => typeof p === "string").map((p) => p.slice(0, 40)).slice(0, 8);
  return {
    problemId: r.problemId.slice(0, 80),
    at: num(r.at, 0, 0, Number.MAX_SAFE_INTEGER),
    code: r.code.slice(0, 200_000),
    seconds: num(r.seconds, 0, 0, 86_400),
    hintsUsed: Math.round(num(r.hintsUsed, 0, 0, 3)),
    assisted: r.assisted === true,
    patterns,
    promptChoice: Math.round(num(r.promptChoice, -1, -1, 9)),
    promptCorrect: r.promptCorrect === true,
  };
}

/** Newest first. */
export const sortJournal = (entries: readonly JournalEntry[]): JournalEntry[] => [...entries].sort((a, b) => b.at - a.at);

/** Journal search: matches the problem id, a pattern id, or a code substring (case-insensitive). */
export function searchJournal(entries: readonly JournalEntry[], query: string, titleOf: (id: string) => string = (id) => id): JournalEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return sortJournal(entries);
  return sortJournal(entries).filter(
    (e) => e.problemId.toLowerCase().includes(q) || titleOf(e.problemId).toLowerCase().includes(q) || e.patterns.some((p) => p.toLowerCase().includes(q)) || e.code.toLowerCase().includes(q),
  );
}

/** The entry to compare a new solution against: the latest earlier one for the same problem. */
export function previousEntry(entries: readonly JournalEntry[], problemId: string, before: number): JournalEntry | undefined {
  return sortJournal(entries.filter((e) => e.problemId === problemId && e.at < before))[0];
}
