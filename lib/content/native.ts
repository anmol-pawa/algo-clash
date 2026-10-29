/** Native g++ compile and run for content verification (ARCH §2.4). Node only; never imported by the app. */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateSource, encodeInput, type DriverSpec } from "../judge/harness/driver";
import type { HiddenTest, TestGroup } from "./types";

export const CACHE_DIR = join(process.cwd(), ".cache", "native");
const FLAGS = ["-std=c++20", "-O2", "-Wall", "-fno-exceptions"];

export type NativeCompile = { ok: true; bin: string } | { ok: false; diagnostics: string };

/** Compile `userCode` inside the generated driver. Cached by a hash of the full source and flags. */
export function compileNative(spec: DriverSpec, userCode: string): NativeCompile {
  const source = generateSource(spec, userCode);
  const key = createHash("sha256").update(FLAGS.join(" ")).update("\0").update(source).digest("hex").slice(0, 24);
  const bin = join(CACHE_DIR, key);
  if (existsSync(bin)) return { ok: true, bin };
  mkdirSync(CACHE_DIR, { recursive: true });
  const src = `${bin}.cpp`;
  writeFileSync(src, source);
  const tmp = `${bin}.${process.pid}.tmp`;
  const r = spawnSync("g++", [...FLAGS, src, "-o", tmp], { encoding: "utf8" });
  if (r.status !== 0) return { ok: false, diagnostics: r.stderr || String(r.error) };
  renameSync(tmp, bin);
  return { ok: true, bin };
}

export interface NativeRun {
  status: "ok" | "RE" | "TLE";
  /** One output line per test (only when status is ok). */
  outputs: string[];
  wallMs: number;
  stderr: string;
}

/** Run a compiled driver on a batch of tests (each test is its list of stdin lines). */
export function runNative(bin: string, tests: string[][], timeoutMs: number): NativeRun {
  const t0 = performance.now();
  const r = spawnSync(bin, [], { input: encodeInput(tests), encoding: "utf8", timeout: timeoutMs, maxBuffer: 256 << 20 });
  const wallMs = Math.round(performance.now() - t0);
  if (r.error || r.signal === "SIGTERM") return { status: "TLE", outputs: [], wallMs, stderr: "" };
  if (r.status !== 0) return { status: "RE", outputs: [], wallMs, stderr: r.stderr };
  const lines = r.stdout.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return { status: "ok", outputs: lines, wallMs, stderr: r.stderr };
}

/** What `gen.ts` returns: stdin lines per test plus its group. */
export interface GeneratedCase {
  group: TestGroup;
  input: string[];
}

/** Files of one problem folder, as read from disk. */
export interface ProblemFiles {
  dir: string;
  solution: string;
  brute: string;
  wrong: { name: string; code: string }[];
  /** Committed `tests.json`, if present. */
  tests: HiddenTest[] | null;
}

export function loadProblemFiles(dir: string): ProblemFiles {
  const read = (f: string) => readFileSync(join(dir, f), "utf8");
  const wrongDir = join(dir, "wrong");
  const wrong = existsSync(wrongDir)
    ? readdirSync(wrongDir).filter((f) => f.endsWith(".cpp")).sort().map((f) => ({ name: f, code: readFileSync(join(wrongDir, f), "utf8") }))
    : [];
  const testsPath = join(dir, "tests.json");
  return {
    dir,
    solution: read("solution.cpp"),
    brute: read("brute.cpp"),
    wrong,
    tests: existsSync(testsPath) ? (JSON.parse(readFileSync(testsPath, "utf8")) as HiddenTest[]) : null,
  };
}

/** Run `code` on `inputs`; throws with the compiler or runtime output if it does not produce one answer per test. */
export function answersFor(spec: DriverSpec, code: string, inputs: string[][], timeoutMs: number, what: string): string[] {
  const c = compileNative(spec, code);
  if (!c.ok) throw new Error(`${what}: compile error\n${c.diagnostics}`);
  const r = runNative(c.bin, inputs, timeoutMs);
  if (r.status !== "ok") throw new Error(`${what}: ${r.status} ${r.stderr}`);
  if (r.outputs.length !== inputs.length) throw new Error(`${what}: ${r.outputs.length} outputs for ${inputs.length} tests`);
  return r.outputs;
}
