/** judgeProblem(): compile once, run the hidden tests, map to verdicts (ARCH §2.2). */
import { explainFirstError, type ClangDiagnostic } from "./clangErrors";
import { compileCpp, runWasm, type CompileResult, type RunResult } from "./client";
import { encodeInput, generateSource, type DriverSpec } from "./harness/driver";
import { judgeOne, summarise, type TestCase, type TestOutcome, type Verdict } from "./verdict";

export interface JudgeRequest {
  spec: DriverSpec;
  code: string;
  /** `input` holds the driver's argument lines joined with "\n" (one line per parameter). */
  tests: TestCase[];
  /** Per-test limit; a batch gets this times the number of tests. */
  timeLimitMs: number;
  floatTol?: number;
  flags?: string[];
}

export interface JudgeResult {
  verdict: Verdict;
  /** Index of the first failing test, or null. */
  failedAt: number | null;
  maxMs: number;
  outcomes: TestOutcome[];
  /** Raw compiler output for CE. */
  diagnostics?: string;
  firstError?: ClangDiagnostic | null;
}

export interface JudgeDeps {
  compile: (source: string, flags: string[]) => Promise<CompileResult>;
  run: (wasm: Uint8Array, stdin: string, timeoutMs: number) => Promise<RunResult>;
}

const browserDeps: JudgeDeps = { compile: compileCpp, run: runWasm };

const toLines = (input: string) => input.split("\n");

export async function judgeProblem(req: JudgeRequest, deps: JudgeDeps = browserDeps): Promise<JudgeResult> {
  const source = generateSource(req.spec, req.code);
  const compiled = await deps.compile(source, req.flags ?? ["-O2"]);
  if (!compiled.ok || !compiled.wasm) {
    // #line directives make clang report the player's own line numbers, so no offset is needed.
    return { verdict: "CE", failedAt: null, maxMs: 0, outcomes: [], diagnostics: compiled.diagnostics, firstError: explainFirstError(compiled.diagnostics) };
  }
  const { wasm } = compiled;

  const batch = await deps.run(wasm, encodeInput(req.tests.map((t) => toLines(t.input))), req.timeLimitMs * req.tests.length);
  const lines = batch.stdout.trim() === "" ? [] : batch.stdout.trim().split("\n");
  let outcomes: TestOutcome[];
  if (batch.status === "ok" && lines.length === req.tests.length) {
    // Wall time is only known for the whole batch; spread it so maxMs stays a fair per-test estimate.
    const each = batch.wallMs / req.tests.length;
    outcomes = req.tests.map((t, i) => judgeOne(t, { ...batch, stdout: lines[i], wallMs: each }, { floatTol: req.floatTol }));
  } else {
    // A crash or timeout can't be pinned to a test from the batch, so rerun one by one until the first failure.
    outcomes = [];
    for (const t of req.tests) {
      const r = await deps.run(wasm, encodeInput([toLines(t.input)]), req.timeLimitMs);
      const o = judgeOne(t, r, { floatTol: req.floatTol });
      outcomes.push(o);
      if (o.verdict !== "AC") break;
    }
  }
  return { ...summarise(outcomes), outcomes };
}
