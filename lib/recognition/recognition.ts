/** Recognition blitz (CUR §5, GDD §5.5): read a statement plus constraints, name the pattern(s) in time. Pure, no DOM. */
import { makeRng } from "../content/rng";
import { patternById } from "../../content/patterns";

export const BLITZ_SECONDS = 20;
/** GDD §1 target: this accuracy on this many unseen statements. */
export const TARGET_ACCURACY = 0.9;
export const TARGET_COUNT = 50;

export interface RecognitionStatement {
  id: string;
  /** Original statement text (no constraints inside). */
  statement: string;
  /** Constraints shown under the statement, one per line. */
  constraints: string[];
  /** Accepted pattern ids (CUR pattern taxonomy); the player must pick exactly this set. One or two. */
  patterns: string[];
  /** Plausible wrong pattern ids shown as extra options. */
  distractors: string[];
  /** Phrases that appear verbatim (case-insensitive) in the statement or constraints and give the pattern away. */
  signals: string[];
  /** Why: names the signals and rules out the tempting wrong answer. */
  explanation: string;
}

export interface Segment { text: string; signal: boolean }

/** Split `text` into plain and signal segments (case-insensitive; overlapping/adjacent matches merge). */
export function highlight(text: string, signals: readonly string[]): Segment[] {
  const lower = text.toLowerCase();
  const marks: Array<[number, number]> = [];
  for (const s of signals) {
    const needle = s.toLowerCase();
    if (!needle) continue;
    for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, at + needle.length)) marks.push([at, at + needle.length]);
  }
  marks.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged: Array<[number, number]> = [];
  for (const m of marks) {
    const last = merged[merged.length - 1];
    if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]);
    else merged.push([m[0], m[1]]);
  }
  const out: Segment[] = [];
  let pos = 0;
  for (const [a, b] of merged) {
    if (a > pos) out.push({ text: text.slice(pos, a), signal: false });
    out.push({ text: text.slice(a, b), signal: true });
    pos = b;
  }
  if (pos < text.length) out.push({ text: text.slice(pos), signal: false });
  return out;
}

/** Option ids for a statement: accepted + distractors, in a seeded order (stable per statement and seed). */
export function optionsFor(s: RecognitionStatement, seed: number): string[] {
  let h = seed >>> 0;
  for (const ch of s.id) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
  return makeRng(h).shuffle([...new Set([...s.patterns, ...s.distractors])]);
}

export interface RecognitionGrade {
  /** Right set of patterns AND within the time limit. */
  correct: boolean;
  /** The set was right (ignores time). */
  rightSet: boolean;
  inTime: boolean;
  missed: string[];
  extra: string[];
}

/** `seconds === null` is a timeout/skip. An answer after `limit` seconds is a miss even if right (recognition on sight). */
export function gradeRecognition(s: RecognitionStatement, picked: readonly string[], seconds: number | null, limit = BLITZ_SECONDS): RecognitionGrade {
  const got = new Set(picked);
  const want = new Set(s.patterns);
  const missed = [...want].filter((p) => !got.has(p)).sort();
  const extra = [...got].filter((p) => !want.has(p)).sort();
  const rightSet = missed.length === 0 && extra.length === 0;
  const inTime = seconds !== null && seconds <= limit;
  return { correct: rightSet && inTime, rightSet, inTime, missed, extra };
}

export interface BlitzAttempt { id: string; correct: boolean; seconds: number | null }

export interface BlitzSummary {
  total: number;
  correct: number;
  accuracy: number;
  /** Mean seconds over answered (non-timeout) items; 0 if none. */
  meanSeconds: number;
  /** True once the GDD §1 target (≥ 90 % on ≥ 50 statements) is met. */
  meetsTarget: boolean;
}

export function summarize(attempts: readonly BlitzAttempt[]): BlitzSummary {
  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const timed = attempts.filter((a): a is BlitzAttempt & { seconds: number } => a.seconds !== null);
  const meanSeconds = timed.length ? timed.reduce((t, a) => t + a.seconds, 0) / timed.length : 0;
  const accuracy = total ? correct / total : 0;
  return { total, correct, accuracy, meanSeconds, meetsTarget: total >= TARGET_COUNT && accuracy >= TARGET_ACCURACY };
}

/** Region of a statement = region of its first accepted pattern. */
export function regionOf(s: RecognitionStatement): string {
  const p = patternById(s.patterns[0]);
  if (!p) throw new Error(`statement ${s.id}: unknown pattern ${s.patterns[0]}`);
  return p.region;
}

/**
 * Pick a blitz of `count` statements: unseen ones first (not in `seen`), spread across patterns so one session
 * does not repeat a pattern until every pattern in the pool has appeared. Seeded and deterministic.
 */
export function pickBlitz(pool: readonly RecognitionStatement[], count: number, seed: number, seen: ReadonlySet<string> = new Set()): RecognitionStatement[] {
  const rng = makeRng(seed);
  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  const fresh = rng.shuffle(sorted.filter((s) => !seen.has(s.id)));
  const old = rng.shuffle(sorted.filter((s) => seen.has(s.id)));
  const picked: RecognitionStatement[] = [];
  const usedPatterns = new Set<string>();
  const queue = [...fresh, ...old];
  while (picked.length < count && queue.length) {
    let idx = queue.findIndex((s) => !usedPatterns.has(s.patterns[0]));
    if (idx === -1) {
      usedPatterns.clear();
      idx = 0;
    }
    const [s] = queue.splice(idx, 1);
    usedPatterns.add(s.patterns[0]);
    picked.push(s);
  }
  return picked;
}
