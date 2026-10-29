/** Native verification of one problem package (ARCH §2.4). Node-only. */
import { outputsMatch } from "../judge/lc";
import { compileNative, runNative, type ProblemPackage } from "./native";
import { makeRng, seedFor } from "./rng";
import { TEST_GROUPS, type HiddenTest } from "./types";
import { validateEditorial, validateHints, validateMeta, validateStatement, validateTests } from "./validate";

export const STRESS_CASES = 200;
/** Native reference time must stay under `timeLimitMs / WASM_FACTOR` per test (WASM is slower). */
export const WASM_FACTOR = 3;

const lines = (input: string) => input.split("\n");

/** Build hidden tests from `gen.ts` (seeded) with expected outputs from the reference. */
export function generateTests(pkg: ProblemPackage): { tests: HiddenTest[]; errors: string[] } {
  const errors: string[] = [];
  const inputs: { group: HiddenTest["group"]; lines: string[] }[] = [];
  for (const group of TEST_GROUPS) {
    const rng = makeRng(seedFor(pkg.id, group));
    for (const entry of pkg.gen.groups[group] ?? []) inputs.push({ group, lines: typeof entry === "function" ? entry(rng) : entry });
    for (let i = 0; i < (pkg.gen.randomCount?.[group] ?? 0); ++i) {
      const first = pkg.gen.groups[group]?.find((e) => typeof e === "function") as ((r: typeof rng) => string[]) | undefined;
      if (first) inputs.push({ group, lines: first(rng) });
    }
  }
  const comp = compileNative(pkg.meta.spec, pkg.solution);
  if (!comp.ok) return { tests: [], errors: [`solution.cpp does not compile:\n${comp.diagnostics}`] };
  const out: HiddenTest[] = [];
  const seen = new Set<string>();
  for (const t of inputs) {
    const input = t.lines.join("\n");
    if (seen.has(input)) continue; // duplicate random draws are dropped, not errors
    seen.add(input);
    const r = runNative(comp.bin, [t.lines], Math.max(10000, pkg.meta.timeLimitMs * 10));
    if (r.status !== "ok") {
      errors.push(`reference ${r.status} while generating a ${t.group} test (${r.detail})`);
      continue;
    }
    if (t.group === "perf" && r.wallMs > pkg.meta.timeLimitMs / WASM_FACTOR)
      errors.push(`reference takes ${r.wallMs} ms on a perf test; limit ${pkg.meta.timeLimitMs} ms allows ${Math.floor(pkg.meta.timeLimitMs / WASM_FACTOR)} ms natively`);
    out.push({ input, expected: r.outputs[0], group: t.group });
  }
  return { tests: out, errors };
}

/** Everything `content:verify` checks for one package. Returns human-readable errors (empty = pass). */
export function verifyPackage(pkg: ProblemPackage, knownIds: ReadonlySet<string>, tests: HiddenTest[] = pkg.tests ?? []): string[] {
  const errors: string[] = [];
  errors.push(...validateMeta(pkg.meta, knownIds), ...validateStatement(pkg.statement), ...validateHints(pkg.hints), ...validateEditorial(pkg.editorial));
  errors.push(...validateTests(tests, pkg.meta));
  if (pkg.wrong.length < 2) errors.push("needs at least two wrong/*.cpp");
  if (pkg.meta.difficulty !== "E" && !pkg.wrong.some((w) => w.name.startsWith("tle")))
    errors.push("medium and hard problems need a TLE brute force named wrong/tle*.cpp");
  const tol = pkg.meta.floatTol;

  const sol = compileNative(pkg.meta.spec, pkg.solution);
  const brute = compileNative(pkg.meta.spec, pkg.brute);
  if (!sol.ok) return [...errors, `solution.cpp does not compile:\n${sol.diagnostics}`];
  if (!brute.ok) return [...errors, `brute.cpp does not compile:\n${brute.diagnostics}`];

  // Reference vs brute force on random small cases.
  const rng = makeRng(seedFor(pkg.id, "stress"));
  const cases = Array.from({ length: STRESS_CASES }, () => pkg.gen.small(rng));
  const a = runNative(sol.bin, cases, 30000);
  const b = runNative(brute.bin, cases, 30000);
  if (a.status !== "ok") errors.push(`stress: reference ${a.status} ${a.detail}`);
  else if (b.status !== "ok") errors.push(`stress: brute force ${b.status} ${b.detail}`);
  else {
    const bad = cases.findIndex((_, i) => !outputsMatch(b.outputs[i], a.outputs[i], tol));
    if (bad >= 0) errors.push(`stress: reference and brute force disagree on\n${cases[bad].join("\n")}\nreference: ${a.outputs[bad]}\nbrute: ${b.outputs[bad]}`);
  }

  // Reference reproduces the committed expectations (guards a stale or hand-edited tests.json).
  if (tests.length) {
    const r = runNative(sol.bin, tests.map((t) => lines(t.input)), Math.max(30000, pkg.meta.timeLimitMs * tests.length));
    if (r.status !== "ok") errors.push(`reference ${r.status} on hidden tests ${r.detail}`);
    else tests.forEach((t, i) => { if (!outputsMatch(t.expected, r.outputs[i], tol)) errors.push(`hidden test ${i} (${t.group}) disagrees with the reference`); });
  }

  // Every wrong solution must fail at least one hidden test (WA, RE or TLE).
  for (const w of pkg.wrong) {
    const c = compileNative(pkg.meta.spec, w.code);
    if (!c.ok) {
      errors.push(`wrong/${w.name}.cpp does not compile:\n${c.diagnostics}`);
      continue;
    }
    const rejected = tests.some((t) => {
      const r = runNative(c.bin, [lines(t.input)], pkg.meta.timeLimitMs);
      return r.status !== "ok" || !outputsMatch(t.expected, r.outputs[0], tol);
    });
    if (!rejected) errors.push(`wrong/${w.name}.cpp passes every hidden test`);
  }
  return errors;
}
