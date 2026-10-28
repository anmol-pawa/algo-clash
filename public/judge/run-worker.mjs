// Run worker: a fresh instance per run; the host enforces the time limit with
// worker.terminate(). Messages: {wasm, stdin} -> {ok, stdout, stderr, status, ms}.
import { WASI, File, OpenFile, ConsoleStdout } from "./wasi-shim/index.js";

self.onmessage = async (e) => {
  const { wasm, stdin = "" } = e.data;
  let stdout = "";
  let stderr = "";
  const wasi = new WASI(
    ["main"],
    [],
    [
      new OpenFile(new File(new TextEncoder().encode(stdin))),
      new ConsoleStdout((b) => void (stdout += new TextDecoder().decode(b, { stream: true }))),
      new ConsoleStdout((b) => void (stderr += new TextDecoder().decode(b, { stream: true }))),
    ],
  );
  const t0 = performance.now();
  let status;
  try {
    const mod = await WebAssembly.compile(wasm);
    const inst = await WebAssembly.instantiate(mod, { wasi_snapshot_preview1: wasi.wasiImport });
    status = `exit ${wasi.start(inst)}`;
  } catch (err) {
    // RangeError = JS call stack exhausted (deep recursion); WebAssembly.RuntimeError = trap
    status = `trap ${err && err.name}: ${err && err.message}`;
  }
  self.postMessage({ stdout, stderr, status, ms: Math.round(performance.now() - t0) });
};
