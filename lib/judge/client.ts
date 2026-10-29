/** Main-thread client for the compile worker and the one-shot run workers (ARCH §2.2). */

export interface CompileResult {
  ok: boolean;
  wasm?: Uint8Array;
  diagnostics: string;
  timings: { loadMs?: number; compileMs?: number; totalMs?: number };
}

export interface RunResult {
  status: "ok" | "RE" | "TLE";
  exitCode: number;
  stdout: string;
  stderr: string;
  wallMs: number;
  detail: string;
  memPages: number;
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let compiler: Worker | null = null;
let nextId = 1;

function compileWorker(): Worker {
  compiler ??= new Worker(`${base}/judge/compile-worker.js`, { type: "module" });
  return compiler;
}

export function compileCpp(source: string, flags: string[] = ["-O2"]): Promise<CompileResult> {
  const w = compileWorker();
  const id = nextId++;
  return new Promise((resolve) => {
    const onMsg = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      w.removeEventListener("message", onMsg);
      resolve(e.data as CompileResult);
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ id, source, flags });
  });
}

export function runWasm(wasm: Uint8Array, stdin: string, timeoutMs: number, args: string[] = []): Promise<RunResult> {
  const w = new Worker(`${base}/judge/run-worker.js`);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.terminate();
      resolve({ status: "TLE", exitCode: -1, stdout: "", stderr: "", wallMs: timeoutMs, detail: "timeout", memPages: 0 });
    }, timeoutMs);
    w.onmessage = (e) => {
      clearTimeout(timer);
      w.terminate();
      resolve(e.data as RunResult);
    };
    w.onerror = (e) => {
      clearTimeout(timer);
      w.terminate();
      resolve({ status: "RE", exitCode: -1, stdout: "", stderr: "", wallMs: 0, detail: String(e.message), memPages: 0 });
    };
    w.postMessage({ wasm: wasm.slice(), stdin, args });
  });
}
