/** Native (g++) compile and run for content verification (ARCH §2.4). Node-only; never imported by the app. */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { encodeInput, generateSource, type DriverSpec } from "../judge/harness/driver";
import type { HiddenTest, ProblemMeta, TestGroup } from "./types";
import type { Rng } from "./rng";

export const CACHE_DIR = join(process.cwd(), ".cache", "native");

export interface CompileResult {
  ok: boolean;
  bin: string;
  diagnostics: string;
}

/** Compile the harness + code with g++; binaries are cached by hash of the full source. */
export function compileNative(spec: DriverSpec, code: string, cacheDir = CACHE_DIR): CompileResult {
  const source = generateSource(spec, code);
  const key = createHash("sha256").update(source).update("g++20-O2-v1").digest("hex").slice(0, 24);
  mkdirSync(cacheDir, { recursive: true });
  const bin = join(cacheDir, key);
  if (existsSync(bin)) return { ok: true, bin, diagnostics: "" };
  const src = `${bin}.cpp`;
  writeFileSync(src, source);
  const r = spawnSync("g++", ["-std=c++20", "-O2", "-fno-exceptions", "-Wall", src, "-o", bin], { encoding: "utf8", maxBuffer: 1 << 26 });
  return { ok: r.status === 0, bin, diagnostics: r.stderr };
}

export type RunStatus = "ok" | "TLE" | "RE";
export interface RunResult {
  status: RunStatus;
  /** One output line per test (only when `ok`). */
  outputs: string[];
  wallMs: number;
  detail: string;
}

/** Run a batch of tests (each a list of stdin lines) in one process. */
export function runNative(bin: string, tests: string[][], timeoutMs: number): RunResult {
  const t0 = Date.now();
  const r = spawnSync(bin, [], { input: encodeInput(tests), encoding: "utf8", timeout: timeoutMs, maxBuffer: 1 << 28 });
  const wallMs = Date.now() - t0;
  if (r.error || r.signal === "SIGTERM") return { status: "TLE", outputs: [], wallMs, detail: "timeout" };
  if (r.status !== 0) return { status: "RE", outputs: [], wallMs, detail: r.stderr.slice(0, 300) || `exit ${r.status}` };
  const lines = r.stdout.split("\n");
  lines.pop();
  if (lines.length !== tests.length) return { status: "RE", outputs: [], wallMs, detail: `expected ${tests.length} lines, got ${lines.length}` };
  return { status: "ok", outputs: lines, wallMs, detail: "" };
}

/** Generator contract for `gen.ts`: each test is one stdin line per parameter. */
export interface GenModule {
  /** Random small case for stress tests against the brute force. */
  small(rng: Rng): string[];
  /** Hidden-test generators per group; a function entry yields one test per call. */
  groups: Record<TestGroup, Array<string[] | ((rng: Rng) => string[])>>;
  /** Seeded random calls per group beyond the fixed entries. Default 0. */
  randomCount?: Partial<Record<TestGroup, number>>;
}

export interface ProblemPackage {
  dir: string;
  id: string;
  meta: ProblemMeta;
  statement: string;
  hints: string;
  editorial: string;
  solution: string;
  brute: string;
  wrong: { name: string; code: string }[];
  gen: GenModule;
  /** Committed generated tests, or undefined before the first generation. */
  tests?: HiddenTest[];
}

const read = (p: string) => readFileSync(p, "utf8");

/** Load a problem folder (GDD §8.1). `meta.ts` and `gen.ts` are imported dynamically. */
export async function loadPackage(dir: string): Promise<ProblemPackage> {
  const metaMod = (await import(/* @vite-ignore */ join(dir, "meta.ts"))) as { meta: ProblemMeta };
  const genMod = (await import(/* @vite-ignore */ join(dir, "gen.ts"))) as { gen: GenModule };
  const wrongDir = join(dir, "wrong");
  const wrong = existsSync(wrongDir)
    ? readdirSync(wrongDir).filter((f) => f.endsWith(".cpp")).sort().map((f) => ({ name: basename(f, ".cpp"), code: read(join(wrongDir, f)) }))
    : [];
  const testsPath = join(dir, "tests.json");
  return {
    dir,
    id: metaMod.meta.id,
    meta: metaMod.meta,
    statement: read(join(dir, "problem.md")),
    hints: read(join(dir, "hints.md")),
    editorial: read(join(dir, "editorial.md")),
    solution: read(join(dir, "solution.cpp")),
    brute: read(join(dir, "brute.cpp")),
    wrong,
    gen: genMod.gen,
    tests: existsSync(testsPath) ? (JSON.parse(read(testsPath)) as HiddenTest[]) : undefined,
  };
}

/** Problem folders under `root` (`<region>/<slug>/meta.ts`). */
export function findPackages(root: string): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  for (const region of readdirSync(root, { withFileTypes: true })) {
    if (!region.isDirectory()) continue;
    for (const slug of readdirSync(join(root, region.name), { withFileTypes: true })) {
      const dir = join(root, region.name, slug.name);
      if (slug.isDirectory() && existsSync(join(dir, "meta.ts"))) out.push(dir);
    }
  }
  return out.sort();
}
