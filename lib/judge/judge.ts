/** judgeProblem(): compile once, run the tests, map to a verdict (ARCH §2.2). Workers are injected so it tests natively. */
import { explainFirstError, type ClangDiagnostic } from "./clangErrors";
import { generateSource, encodeInput, type DriverSpec } from "./harness/driver";
import type { CompileResult, RunResult } from "./client";
import { judgeOne, summarise, type TestCase, type TestOutcome, type Verdict } from "./verdict";

export interface JudgeDeps {
  compile(source: string): Promise<CompileResult>;
  run(wasm: Uint8Array, stdin: string, timeoutMs: number): Promise<RunResult>;
}

export interface JudgeOptions {
  /** Per-test limit; the batch run gets `timeLimitMs` per test, capped at `batchCapMs`. */
  timeLimitMs: number;
  batchCapMs?: number;
  floatTol?: number;
}

export interface JudgeResult {
  verdict: Verdict;
  /** Index of the first failing test, or null on AC. */
  failedAt: number | null;
  outcomes: TestOutcome[];
  maxMs: number;
  /** CE only: raw clang output and the first error with its friendly entry. */
  diagnostics?: string;
  firstError?: ClangDiagnostic | null;
  compileMs?: number;
}

/** A test's `input` holds one harness line per parameter (design problems: ops line, then args line). */
function lines(t: TestCase): string[] {
  return t.input.split("\n");
}

/** Judge `userCode` against `tests`. Runs all tests in one process; on a crash or timeout re-runs them one by one to blame the right test. */
export async function judgeProblem(spec: DriverSpec, userCode: string, tests: TestCase[], opts: JudgeOptions, deps: JudgeDeps): Promise<JudgeResult> {
  const source = generateSource(spec, userCode);
  const compiled = await deps.compile(source);
  if (!compiled.ok || !compiled.wasm) {
    return { verdict: "CE", failedAt: null, outcomes: [], maxMs: 0, diagnostics: compiled.diagnostics, firstError: explainFirstError(compiled.diagnostics), compileMs: compiled.timings.compileMs };
  }
  const wasm = compiled.wasm;
  const cap = opts.batchCapMs ?? 20000;
  const batch = await deps.run(wasm, encodeInput(tests.map(lines)), Math.min(cap, opts.timeLimitMs * tests.length));
  const outcomes: TestOutcome[] = [];
  if (batch.status === "ok") {
    const outs = batch.stdout.split("\n");
    const each = Math.round(batch.wallMs / Math.max(1, tests.length));
    tests.forEach((t, i) => outcomes.push(judgeOne(t, { ...batch, stdout: outs[i] ?? "", wallMs: each }, opts)));
    if (outs.filter((l) => l !== "").length < tests.length) {
      const missing = outcomes.findIndex((o, i) => o.verdict === "AC" && (outs[i] ?? "") === "" && tests[i].expected.trim() !== "");
      if (missing >= 0) outcomes[missing] = { verdict: "RE", wallMs: each, reason: "The program produced no output for this test." };
    }
  } else {
    // A crash or timeout kills the whole batch: find which test did it, one process per test.
    for (const t of tests) {
      const r = await deps.run(wasm, encodeInput([lines(t)]), opts.timeLimitMs);
      const o = judgeOne(t, r, opts);
      outcomes.push(o);
      if (o.verdict !== "AC") break;
    }
  }
  return { ...summarise(outcomes), outcomes, compileMs: compiled.timings.compileMs };
}
