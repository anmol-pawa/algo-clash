/** Verdict mapping from run results to what the battle UI shows (ARCH §2.2). */
import type { RunResult } from "./client";
import { outputsMatch } from "./lc";

export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE";

export interface TestCase {
  input: string;
  expected: string;
  group?: string;
}

export interface TestOutcome {
  verdict: Verdict;
  wallMs: number;
  reason?: string;
  got?: string;
  expected?: string;
}

/** Friendly reason for a runtime error; the raw message stays available to the player. */
export function friendlyRuntimeReason(detail: string, stderr: string): string {
  const text = `${detail}\n${stderr}`.toLowerCase();
  if (text.includes("stack overflow") || text.includes("call stack")) return "Stack overflow: your recursion is too deep or never stops.";
  if (text.includes("out of bounds") || text.includes("memory access")) return "Out-of-bounds access: an index or iterator went outside its container.";
  if (text.includes("unreachable") || text.includes("abort") || text.includes("assert")) return "The program aborted (an assertion failed, or something like .at()/pop on an empty container).";
  if (text.includes("divide") || text.includes("division")) return "Division by zero.";
  if (text.includes("memory") && text.includes("grow")) return "Out of memory.";
  return "Runtime error: the program crashed. Check indices, null pointers and empty containers.";
}

export function judgeOne(test: TestCase, run: RunResult, opts: { floatTol?: number } = {}): TestOutcome {
  if (run.status === "TLE") return { verdict: "TLE", wallMs: run.wallMs, reason: "Time limit exceeded: try a better complexity." };
  if (run.status === "RE") return { verdict: "RE", wallMs: run.wallMs, reason: friendlyRuntimeReason(run.detail, run.stderr) };
  if (outputsMatch(test.expected, run.stdout, opts.floatTol)) return { verdict: "AC", wallMs: run.wallMs };
  return { verdict: "WA", wallMs: run.wallMs, got: run.stdout.trim(), expected: test.expected.trim(), reason: "Wrong answer." };
}

/** Overall verdict: the first non-AC outcome in order, else AC. Also returns that test's index. */
export function summarise(outcomes: TestOutcome[]): { verdict: Verdict; failedAt: number | null; maxMs: number } {
  const maxMs = outcomes.reduce((m, o) => Math.max(m, o.wallMs), 0);
  const i = outcomes.findIndex((o) => o.verdict !== "AC");
  return i < 0 ? { verdict: "AC", failedAt: null, maxMs } : { verdict: outcomes[i].verdict, failedAt: i, maxMs };
}
