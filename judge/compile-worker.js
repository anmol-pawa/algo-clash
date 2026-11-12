// Long-lived compile worker. Owns the clang module (loaded lazily on the first compile).
// Protocol: {id, source, flags?} -> {id, ok, wasm?, diagnostics, timings}
let clang = null;
let loadMs = 0;
let shim = null;

async function load() {
  if (clang) return;
  const t = performance.now();
  clang = await import("../toolchain/bundle.js");
  shim = await (await fetch(new URL("./stdc++.h", import.meta.url))).text();
  loadMs = performance.now() - t;
}

self.onmessage = async (e) => {
  const { id, source, flags = ["-O2"] } = e.data;
  const diagnostics = [];
  try {
    const t0 = performance.now();
    const wasFirst = !clang;
    await load();
    const t1 = performance.now();
    const sink = (b) => b && diagnostics.push(new TextDecoder().decode(b));
    let out;
    try {
      out = await clang.runClang(
        ["clang++", "-std=c++20", "-fno-exceptions", ...flags, "-Wl,-z,stack-size=67108864", "-isystem", "shim", "main.cpp", "-o", "main.wasm"],
        { "main.cpp": source, shim: { bits: { "stdc++.h": shim } } },
        { stdout: sink, stderr: sink },
      );
    } catch (err) {
      if (!err || !("files" in err)) throw err;
      out = err.files; // non-zero exit: clang reported errors
    }
    const t2 = performance.now();
    const wasm = out && out["main.wasm"];
    const timings = { loadMs: wasFirst ? Math.round(loadMs) : 0, compileMs: Math.round(t2 - t1), totalMs: Math.round(t2 - t0) };
    if (wasm) self.postMessage({ id, ok: true, wasm, diagnostics: diagnostics.join(""), timings }, [wasm.buffer]);
    else self.postMessage({ id, ok: false, diagnostics: diagnostics.join(""), timings });
  } catch (err) {
    self.postMessage({ id, ok: false, diagnostics: diagnostics.join("") + "\n[worker error] " + String(err && err.stack || err), timings: {} });
  }
};
