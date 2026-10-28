// A2 spike worker (replaced by the real compile/run workers in A3).
// Loads @yowasp/clang from ./clang/, compiles main.cpp to wasm32-wasip1, then
// runs it with a tiny WASI shim. Exceptions are unavailable (see ADR 0001).
let clangPromise;
const post = (m) => self.postMessage(m);

function loadClang() {
  clangPromise ??= (async () => {
    const t = performance.now();
    const mod = await import("./clang/bundle.js");
    post({ type: "loaded", ms: performance.now() - t });
    return mod;
  })();
  return clangPromise;
}

class ProcExit extends Error {
  constructor(code) { super("exit " + code); this.code = code; }
}

function runWasi(bytes, onOut) {
  const dec = new TextDecoder();
  let mem;
  const view = () => new DataView(mem.buffer);
  const stdout = [];
  const wasi = {
    args_sizes_get: (c, s) => { view().setUint32(c, 0, true); view().setUint32(s, 0, true); return 0; },
    args_get: () => 0,
    environ_sizes_get: (c, s) => { view().setUint32(c, 0, true); view().setUint32(s, 0, true); return 0; },
    environ_get: () => 0,
    clock_time_get: (_id, _p, out) => { view().setBigUint64(out, BigInt(Math.round(performance.now() * 1e6)), true); return 0; },
    fd_write: (fd, iovs, n, nw) => {
      let w = 0;
      for (let i = 0; i < n; i++) {
        const p = view().getUint32(iovs + i * 8, true), l = view().getUint32(iovs + i * 8 + 4, true);
        if (fd === 1 || fd === 2) stdout.push(dec.decode(new Uint8Array(mem.buffer, p, l), { stream: true }));
        w += l;
      }
      view().setUint32(nw, w, true);
      return 0;
    },
    fd_read: (_fd, _iovs, _n, nr) => { view().setUint32(nr, 0, true); return 0; },
    fd_close: () => 0, fd_seek: () => 70, fd_sync: () => 0,
    fd_fdstat_get: (fd, out) => { view().setUint8(out, fd <= 2 ? 2 : 4); view().setUint16(out + 2, 0, true); view().setBigUint64(out + 8, 0n, true); view().setBigUint64(out + 16, 0n, true); return 0; },
    fd_fdstat_set_flags: () => 0,
    fd_prestat_get: () => 8, fd_prestat_dir_name: () => 8,
    random_get: (p, l) => { crypto.getRandomValues(new Uint8Array(mem.buffer, p, l)); return 0; },
    proc_exit: (code) => { throw new ProcExit(code); },
    sched_yield: () => 0,
  };
  const mod = new WebAssembly.Module(bytes);
  const inst = new WebAssembly.Instance(mod, { wasi_snapshot_preview1: wasi });
  mem = inst.exports.memory;
  let exit = 0, trap = null;
  const t = performance.now();
  try { inst.exports._start(); } catch (e) {
    if (e instanceof ProcExit) exit = e.code; else trap = String(e);
  }
  const ms = performance.now() - t;
  onOut(stdout.join(""));
  return { exit, trap, ms, pages: mem.buffer.byteLength / 65536 };
}

self.onmessage = async (ev) => {
  const { id, source, flags } = ev.data;
  try {
    const t0 = performance.now();
    const { commands } = await loadClang();
    const t1 = performance.now();
    const stderr = [];
    let files;
    try {
      files = await commands["clang++"]([...flags, "main.cpp", "-o", "main.wasm"], { "main.cpp": source }, {
        stderr: (b) => b && stderr.push(new TextDecoder().decode(b)),
      });
    } catch (e) {
      post({ type: "result", id, ok: false, stage: "compile", stderr: stderr.join(""), loadMs: t1 - t0, compileMs: performance.now() - t1 });
      return;
    }
    const compileMs = performance.now() - t1;
    let out = "";
    const run = runWasi(files["main.wasm"], (s) => (out = s));
    post({ type: "result", id, ok: true, loadMs: t1 - t0, compileMs, wasmBytes: files["main.wasm"].length, out, ...run, heapMB: performance.memory ? performance.memory.usedJSHeapSize / 1e6 : null });
  } catch (e) {
    post({ type: "result", id, ok: false, stage: "worker", error: String(e && e.stack || e) });
  }
};
