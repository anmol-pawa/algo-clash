// One-shot run worker: instantiates a compiled WASI module with an in-memory stdin/stdout.
// The host terminates this worker on timeout. Protocol:
//   in : {wasm, stdin, args}   out: {status, exitCode, stdout, stderr, wallMs, detail}
const OUT_CAP = 1 << 20;
class ProcExit extends Error { constructor(code) { super("exit " + code); this.code = code; } }

self.onmessage = (e) => {
  const { wasm, stdin = "", args = [] } = e.data;
  const enc = new TextEncoder();
  const input = enc.encode(stdin);
  let inPos = 0;
  const out = { 1: [], 2: [] };
  let outLen = 0;
  let mem;
  const dv = () => new DataView(mem.buffer);
  const u8 = () => new Uint8Array(mem.buffer);
  const argv = ["main", ...args].map((a) => enc.encode(a + "\0"));

  const wasi = {
    args_sizes_get: (cp, sp) => { dv().setUint32(cp, argv.length, true); dv().setUint32(sp, argv.reduce((n, a) => n + a.length, 0), true); return 0; },
    args_get: (ap, bp) => { let p = bp; argv.forEach((a, i) => { dv().setUint32(ap + 4 * i, p, true); u8().set(a, p); p += a.length; }); return 0; },
    environ_sizes_get: (cp, sp) => { dv().setUint32(cp, 0, true); dv().setUint32(sp, 0, true); return 0; },
    environ_get: () => 0,
    clock_time_get: (id, _prec, ptr) => { dv().setBigUint64(ptr, BigInt(Math.round((id === 0 ? Date.now() : performance.now()) * (id === 0 ? 1e6 : 1e6))), true); return 0; },
    fd_write: (fd, iovs, n, nwPtr) => {
      if (fd !== 1 && fd !== 2) return 8;
      let w = 0;
      for (let i = 0; i < n; i++) {
        const p = dv().getUint32(iovs + 8 * i, true), l = dv().getUint32(iovs + 8 * i + 4, true);
        if (outLen < OUT_CAP) { out[fd].push(u8().slice(p, p + l)); outLen += l; }
        w += l;
      }
      dv().setUint32(nwPtr, w, true);
      return 0;
    },
    fd_read: (fd, iovs, n, nrPtr) => {
      if (fd !== 0) return 8;
      let r = 0;
      for (let i = 0; i < n && inPos < input.length; i++) {
        const p = dv().getUint32(iovs + 8 * i, true), l = dv().getUint32(iovs + 8 * i + 4, true);
        const c = Math.min(l, input.length - inPos);
        u8().set(input.subarray(inPos, inPos + c), p);
        inPos += c; r += c;
      }
      dv().setUint32(nrPtr, r, true);
      return 0;
    },
    fd_fdstat_get: (fd, ptr) => {
      if (fd > 2) return 8;
      dv().setUint8(ptr, 2); dv().setUint16(ptr + 2, 0, true);
      dv().setBigUint64(ptr + 8, 0xffffffffffffffffn, true); dv().setBigUint64(ptr + 16, 0xffffffffffffffffn, true);
      return 0;
    },
    fd_fdstat_set_flags: () => 0,
    fd_close: () => 0,
    fd_seek: () => 70, // ESPIPE
    fd_prestat_get: () => 8, // EBADF: no preopens
    fd_prestat_dir_name: () => 8,
    random_get: (p, l) => { crypto.getRandomValues(u8().subarray(p, p + l)); return 0; },
    sched_yield: () => 0,
    proc_exit: (code) => { throw new ProcExit(code); },
  };
  const t0 = performance.now();
  let status = "ok", exitCode = 0, detail = "";
  try {
    const compiled = new WebAssembly.Module(wasm);
    const imports = {};
    for (const i of WebAssembly.Module.imports(compiled)) {
      if (i.kind !== "function") continue;
      (imports[i.module] ||= {})[i.name] = wasi[i.name] || (() => 52); // ENOSYS
    }
    const inst = new WebAssembly.Instance(compiled, imports);
    mem = inst.exports.memory;
    inst.exports._start();
  } catch (err) {
    if (err instanceof ProcExit) exitCode = err.code;
    else if (err instanceof RangeError) { status = "RE"; detail = "stack overflow: " + err.message; }
    else if (err instanceof WebAssembly.RuntimeError) { status = "RE"; detail = err.message; exitCode = 134; }
    else { status = "RE"; detail = String(err); }
  }
  const join = (parts) => new TextDecoder().decode(concat(parts));
  function concat(parts) { const n = parts.reduce((s, p) => s + p.length, 0); const r = new Uint8Array(n); let o = 0; for (const p of parts) { r.set(p, o); o += p.length; } return r; }
  if (status === "ok" && exitCode !== 0) { status = "RE"; detail = "non-zero exit"; }
  self.postMessage({ status, exitCode, stdout: join(out[1]), stderr: join(out[2]), wallMs: Math.round(performance.now() - t0), detail, memPages: mem ? mem.buffer.byteLength / 65536 : 0 });
};
