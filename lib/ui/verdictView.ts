/** Turns a JudgeResult into what the verdict panel shows (headline, tone, per-test rows, WA diff). */
import type { JudgeResult } from "../judge/judge";
import type { TestCase, Verdict } from "../judge/verdict";

export type Tone = "win" | "lose" | "warn";

export interface DiffView {
  input: string;
  expected: string;
  got: string;
  /** Index of the first differing character in `got` (or its length when `got` is a prefix of `expected`). */
  firstDiff: number;
}

export interface VerdictView {
  verdict: Verdict;
  tone: Tone;
  headline: string;
  detail: string;
  passed: number;
  total: number;
  rows: { index: number; group?: string; verdict: Verdict; ms: number }[];
  diff?: DiffView;
  /** CE only: the first error, with the friendly explanation when the table knows it. */
  compile?: { line: number; message: string; title?: string; why?: string; fix?: string };
}

const HEADLINES: Record<Verdict, string> = {
  AC: "Accepted",
  WA: "Wrong answer",
  TLE: "Time limit exceeded",
  RE: "Runtime error",
  CE: "Compile error",
};

export function firstDiffIndex(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return n;
}

/** `tests` must be the same list that was judged. A failing run stops at the first bad test, so later tests are not listed. */
export function buildVerdictView(result: JudgeResult, tests: TestCase[]): VerdictView {
  const { verdict } = result;
  const rows = result.outcomes.map((o, index) => ({ index, group: tests[index]?.group, verdict: o.verdict, ms: o.wallMs }));
  const passed = result.outcomes.filter((o) => o.verdict === "AC").length;
  const view: VerdictView = {
    verdict,
    tone: verdict === "AC" ? "win" : verdict === "CE" ? "warn" : "lose",
    headline: HEADLINES[verdict],
    detail: "",
    passed,
    total: tests.length,
    rows,
  };
  if (verdict === "AC") view.detail = `All ${tests.length} tests passed. Slowest test: ${result.maxMs} ms.`;
  else if (verdict === "CE") {
    const e = result.firstError;
    view.detail = e ? `Line ${e.line}: ${e.entry?.title ?? e.message}` : (result.diagnostics?.split("\n")[0] ?? "The code did not compile.");
    if (e) view.compile = { line: e.line, message: e.message, title: e.entry?.title, why: e.entry?.why, fix: e.entry?.fix };
  }
  else if (result.failedAt !== null) {
    const o = result.outcomes[result.failedAt];
    const t = tests[result.failedAt];
    view.detail = `Test ${result.failedAt + 1}${t?.group ? ` (${t.group})` : ""}: ${o.reason ?? HEADLINES[verdict]}`;
    if (verdict === "WA" && t && o.got !== undefined) {
      view.diff = { input: t.input, expected: o.expected ?? t.expected.trim(), got: o.got, firstDiff: firstDiffIndex(o.got, o.expected ?? t.expected.trim()) };
    }
  }
  return view;
}
