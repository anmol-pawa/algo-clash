/** Native verification of one problem package (ARCH §2.4). Node-only; never imported by the app. */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { outputsMatch } from "../judge/lc";
import { compileNative, runNative, type GenModule, type ProblemPackage } from "./native";
import { makeRng, seedFor } from "./rng";
import { TEST_GROUPS, type HiddenTest, type TestGroup } from "./types";
import { validateEditorial, validateHints, validateMeta, validateStatement, validateTests } from "./validate";

export interface VerifyOptions {
  /** Random small cases for reference-vs-brute stress. Default 200. */
  stress?: number;
  /** Rewrite `tests.json` when it is missing or stale instead of failing. */
  write?: boolean;
  /** Ids of every known problem, for prerequisite checks. */
  knownIds?: ReadonlySet<string>;
}

export interface VerifyResult {
  id: string;
  errors: string[];
  tests: HiddenTest[];
  /** Wall time of the reference over all hidden tests. */
  referenceMs: number;
}

/** Build the hidden tests from the generator, without expected outputs. Deterministic. */
export function generateInputs(id: string, gen: GenModule): { input: string[]; group: TestGroup }[] {
  const out: { input: string[]; group: TestGroup }[] = [];
  const seen = new Set<string>();
  for (const group of TEST_GROUPS) {
    const rng = makeRng(seedFor(id, group));
    const entries = gen.groups[group] ?? [];
    const calls = entries.map((e) => (typeof e === "function" ? e : () => e));
    const fns = entries.filter((e) => typeof e === "function") as ((r: typeof rng) => string[])[];
    for (const c of calls) push(c(rng));
    const extra = gen.randomCount?.[group] ?? 0;
    for (let i = 0; i < extra && fns.length > 0; i++) push(fns[i % fns.length](rng));
    function push(input: string[]) {
      const key = group + "\n" + input.join("\n");
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ input, group });
      }
    }
  }
  return out;
}

export function verifyPackage(pkg: ProblemPackage, opts: VerifyOptions = {}): VerifyResult {
  const errors: string[] = [];
  const fail = (m: string) => errors.push(m);
  const { meta } = pkg;
  const spec = meta.spec;
  const res: VerifyResult = { id: pkg.id, errors, tests: [], referenceMs: 0 };

  // 5. Metadata and markdown structure.
  const known = opts.knownIds ?? new Set<string>([pkg.id, ...meta.prerequisites]);
  for (const e of validateMeta(meta, known)) fail(`meta: ${e}`);
  for (const e of validateStatement(pkg.statement)) fail(`statement: ${e}`);
  for (const e of validateHints(pkg.hints)) fail(`hints: ${e}`);
  for (const e of validateEditorial(pkg.editorial)) fail(`editorial: ${e}`);
  if (pkg.wrong.length < 2) fail(`needs at least 2 wrong solutions (has ${pkg.wrong.length})`);
  if (meta.difficulty !== "E" && !pkg.wrong.some((w) => /tle/i.test(w.name))) fail("mediums and hards need a wrong/*tle*.cpp brute force");

  // 1. Compile everything with the same harness.
  const ref = compileNative(spec, pkg.solution);
  if (!ref.ok) return (fail(`solution.cpp does not compile:\n${ref.diagnostics}`), res);
  const brute = compileNative(spec, pkg.brute);
  if (!brute.ok) return (fail(`brute.cpp does not compile:\n${brute.diagnostics}`), res);
  const wrongBins: { name: string; bin: string }[] = [];
  for (const w of pkg.wrong) {
    const c = compileNative(spec, w.code);
    if (c.ok) wrongBins.push({ name: w.name, bin: c.bin });
    else fail(`wrong/${w.name}.cpp does not compile:\n${c.diagnostics}`);
  }

  // 2. Generate hidden tests with reference outputs.
  const inputs = generateInputs(pkg.id, pkg.gen);
  const refRun = runNative(ref.bin, inputs.map((t) => t.input), meta.timeLimitMs * 2);
  res.referenceMs = refRun.wallMs;
  if (refRun.status !== "ok") return (fail(`reference ${refRun.status} on hidden tests: ${refRun.detail}`), res);
  const tests: HiddenTest[] = inputs.map((t, i) => ({ input: t.input.join("\n"), expected: refRun.outputs[i], group: t.group }));
  res.tests = tests;
  for (const e of validateTests(tests, meta)) fail(`tests: ${e}`);

  // Stale check: committed tests.json must equal the regenerated tests.
  const fresh = JSON.stringify(tests, null, 1) + "\n";
  if (!pkg.tests || JSON.stringify(pkg.tests, null, 1) + "\n" !== fresh) {
    if (opts.write) writeFileSync(join(pkg.dir, "tests.json"), fresh);
    else fail(pkg.tests ? "tests.json is stale (run `npm run content:gen`)" : "tests.json is missing (run `npm run content:gen`)");
  }

  // 3. Stress: reference vs brute on random small cases.
  const rng = makeRng(seedFor(pkg.id, "stress"));
  const small = Array.from({ length: opts.stress ?? 200 }, () => pkg.gen.small(rng));
  const a = runNative(ref.bin, small, 30000);
  const b = runNative(brute.bin, small, 30000);
  if (a.status !== "ok" || b.status !== "ok") fail(`stress run failed: reference ${a.status} ${a.detail}; brute ${b.status} ${b.detail}`);
  else {
    const bad = small.findIndex((_, i) => !outputsMatch(b.outputs[i], a.outputs[i]));
    if (bad >= 0) fail(`reference and brute disagree on small case ${bad}: input ${JSON.stringify(small[bad])} reference ${a.outputs[bad]} brute ${b.outputs[bad]}`);
  }

  // The brute must also agree with the reference on the hidden tests it can finish.
  // 4. Every wrong solution must fail at least one hidden test (WA, RE, or TLE beyond the time limit).
  for (const w of wrongBins) {
    const r = runNative(w.bin, tests.map((t) => t.input.split("\n")), meta.timeLimitMs);
    if (r.status !== "ok") continue; // TLE or crash: rejected.
    if (tests.every((t, i) => outputsMatch(t.expected, r.outputs[i]))) fail(`wrong/${w.name}.cpp passes every hidden test (not rejected)`);
  }
  return res;
}
