/// <reference lib="webworker" />
import { runWasi } from "./wasi";

export interface RunRequest { wasm: Uint8Array; stdin: string }
export interface RunResponse { ok: true; stdout: string; stderr: string; exitCode: number; trap?: string; ms: number; heapBytes: number }

self.onmessage = (e: MessageEvent<RunRequest>) => {
  const t0 = performance.now();
  const r = runWasi(e.data.wasm, e.data.stdin);
  const res: RunResponse = { ok: true, ...r, ms: performance.now() - t0, heapBytes: 0 };
  (self as DedicatedWorkerGlobalScope).postMessage(res);
};
