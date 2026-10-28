import { CLANG_FLAGS, SHIM_FILES } from "./stdcxx";
import type { RunResponse } from "./run.worker";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export interface CompileResult { ok: boolean; wasm?: Uint8Array; stderr: string; ms: number }

let compileWorker: Worker | null = null;
let nextId = 1;

/** One long-lived compile worker keeps the clang module instantiated (warm compiles). */
export function compileCpp(source: string, onProgress?: (done: number, total: number) => void): Promise<CompileResult> {
  compileWorker ??= new Worker(`${base}/toolchain/compile-worker.js`, { type: "module" });
  const w = compileWorker;
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const onMsg = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      if (e.data.type === "progress") onProgress?.(e.data.done, e.data.total);
      else {
        w.removeEventListener("message", onMsg);
        resolve({ ok: e.data.ok, wasm: e.data.wasm, stderr: e.data.stderr, ms: e.data.ms });
      }
    };
    w.addEventListener("message", onMsg);
    w.addEventListener("error", (err) => reject(err), { once: true });
    w.postMessage({ id, args: CLANG_FLAGS(), files: { "main.cc": source, ...SHIM_FILES } });
  });
}

export type RunResult = (Omit<RunResponse, "ok"> & { verdict: "done" }) | { verdict: "TLE"; ms: number };

/** Fresh worker per run; terminate() enforces the wall-clock limit. */
export function runWasmInWorker(wasm: Uint8Array, stdin: string, timeoutMs: number): Promise<RunResult> {
  return new Promise((resolve) => {
    const w = new Worker(new URL("./run.worker.ts", import.meta.url));
    const t0 = performance.now();
    const timer = setTimeout(() => {
      w.terminate();
      resolve({ verdict: "TLE", ms: performance.now() - t0 });
    }, timeoutMs);
    w.onmessage = (e: MessageEvent<RunResponse>) => {
      clearTimeout(timer);
      w.terminate();
      resolve({ verdict: "done", ...e.data });
    };
    w.postMessage({ wasm: wasm.slice(), stdin });
  });
}
