/** Node-only helpers that compile and run card programs natively (tests and `npm run cards:gen`). */
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CLANG_ERRORS, explainFirstError } from "../judge/clangErrors";
import { makeRng } from "../content/rng";
import type { CardSource, GeneratedEntry } from "./types";

const dir = mkdtempSync(join(tmpdir(), "algo-cards-"));
let counter = 0;

export interface RunOutcome {
  compiled: boolean;
  stderr: string;
  stdout: string;
}

/** Compile with g++ (-O0 -fwrapv so signed overflow is deterministic) and run with a 5 s timeout. */
export function runCpp(code: string): RunOutcome {
  const base = join(dir, `c${counter++}`);
  writeFileSync(`${base}.cpp`, code);
  const c = spawnSync("g++", ["-std=c++20", "-O0", "-fwrapv", `${base}.cpp`, "-o", base], { encoding: "utf8" });
  if (c.status !== 0) return { compiled: false, stderr: c.stderr, stdout: "" };
  const r = spawnSync(base, [], { encoding: "utf8", timeout: 5000 });
  return { compiled: true, stderr: r.stderr, stdout: r.stdout };
}

/** clang's stderr for a program that is expected not to compile. */
export function clangErrors(code: string): string {
  const file = join(dir, `e${counter++}.cpp`);
  writeFileSync(file, code);
  return spawnSync("clang++", ["-std=c++20", "-fsyntax-only", file], { encoding: "utf8" }).stderr;
}

const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

/** Produce the generated entry of a predict, trace or compiler-error source by really running it. */
export function generateEntry(s: CardSource): GeneratedEntry | null {
  if (s.kind === "predict" || s.kind === "trace") {
    const r = runCpp(s.code);
    if (!r.compiled) throw new Error(`card ${s.id}: program does not compile\n${r.stderr}`);
    return { answer: r.stdout.replace(/\s+$/, "") };
  }
  if (s.kind === "compiler-error") {
    const d = explainFirstError(clangErrors(s.code));
    if (!d) throw new Error(`card ${s.id}: program compiled cleanly`);
    if (!d.entry) throw new Error(`card ${s.id}: no friendly entry for "${d.message}"`);
    const rng = makeRng(hash(s.id));
    const others = rng.shuffle(CLANG_ERRORS.filter((e) => e.id !== d.entry!.id)).slice(0, 3).map((e) => e.id);
    return { answer: d.entry.id, errorLine: d.line, choiceIds: rng.shuffle([d.entry.id, ...others]) };
  }
  return null;
}

export function generateAll(sources: CardSource[]): Record<string, GeneratedEntry> {
  const out: Record<string, GeneratedEntry> = {};
  for (const s of sources) {
    const g = generateEntry(s);
    if (g) out[s.id] = g;
  }
  return out;
}
