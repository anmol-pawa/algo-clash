// Compile worker: owns the clang module (loaded once, kept warm) and turns a
// C++ translation unit into a WASI module. Messages: {id, source, flags?} ->
// {id, ok, wasm?, diagnostics, ms}. Exceptions are unsupported by this libc++
// build (no libc++abi), so user code is always compiled with -fno-exceptions.
import { runClang } from "./bundle.js";

const BASE_FLAGS = [
  "--target=wasm32-wasip1",
  "-std=c++20",
  "-fno-exceptions",
  "-Wl,-z,stack-size=67108864",
];

self.onmessage = async (e) => {
  const { id, source, flags = ["-O2"] } = e.data;
  const t0 = performance.now();
  let diagnostics = "";
  const decode = new TextDecoder();
  const collect = (bytes) => {
    // decodeASCII (the default) hands us strings; otherwise raw bytes
    if (bytes) diagnostics += typeof bytes === "string" ? bytes : decode.decode(bytes);
  };
  try {
    const out = await runClang(["clang++", ...BASE_FLAGS, ...flags, "main.cpp", "-o", "main.wasm"], { "main.cpp": source }, { stderr: collect, stdout: collect });
    const wasm = out["main.wasm"];
    self.postMessage({ id, ok: true, wasm, diagnostics, ms: Math.round(performance.now() - t0) }, [wasm.buffer]);
  } catch (err) {
    // runClang throws Exit (carrying code + files) when the compiler fails
    if (err && typeof err.code === "number") {
      self.postMessage({ id, ok: false, diagnostics: diagnostics || String(err), ms: Math.round(performance.now() - t0) });
    } else {
      self.postMessage({ id, ok: false, diagnostics: String(err && err.stack ? err.stack : err), ms: Math.round(performance.now() - t0) });
    }
  }
};
self.postMessage({ ready: true });
