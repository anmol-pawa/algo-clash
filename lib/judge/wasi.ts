/**
 * Minimal WASI preview1 host: stdin/stdout/stderr as in-memory buffers, no filesystem.
 * Enough for libc++ iostream/stdio programs.
 */
export class ProcExit extends Error {
  constructor(public code: number) {
    super(`exit ${code}`);
  }
}

export interface WasiResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  trap?: string;
}

const ALL_RIGHTS = BigInt.asUintN(64, BigInt(-1));

export function runWasi(wasm: Uint8Array, stdin: string, maxOutputBytes = 1 << 20): WasiResult {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const input = enc.encode(stdin);
  let inPos = 0;
  const outChunks: Uint8Array[][] = [[], [], []];
  let outBytes = 0;
  // eslint-disable-next-line prefer-const -- assigned after instantiation; the host functions close over it
  let memory: WebAssembly.Memory;
  const view = () => new DataView(memory.buffer);
  const u8 = () => new Uint8Array(memory.buffer);

  const wasi = {
    args_sizes_get: (argc: number, size: number) => { view().setUint32(argc, 0, true); view().setUint32(size, 0, true); return 0; },
    args_get: () => 0,
    environ_sizes_get: (n: number, size: number) => { view().setUint32(n, 0, true); view().setUint32(size, 0, true); return 0; },
    environ_get: () => 0,
    clock_time_get: (_id: number, _prec: bigint, out: number) => { view().setBigUint64(out, BigInt(Math.round(performance.now() * 1e6)), true); return 0; },
    random_get: (ptr: number, len: number) => { crypto.getRandomValues(u8().subarray(ptr, ptr + len)); return 0; },
    fd_write: (fd: number, iovs: number, n: number, nwritten: number) => {
      if (fd !== 1 && fd !== 2) return 8; // EBADF
      let total = 0;
      for (let i = 0; i < n; i++) {
        const ptr = view().getUint32(iovs + i * 8, true);
        const len = view().getUint32(iovs + i * 8 + 4, true);
        if (outBytes + len > maxOutputBytes) throw new ProcExit(153); // output limit
        outChunks[fd].push(u8().slice(ptr, ptr + len));
        outBytes += len;
        total += len;
      }
      view().setUint32(nwritten, total, true);
      return 0;
    },
    fd_read: (fd: number, iovs: number, n: number, nread: number) => {
      if (fd !== 0) return 8;
      let total = 0;
      for (let i = 0; i < n; i++) {
        const ptr = view().getUint32(iovs + i * 8, true);
        const len = view().getUint32(iovs + i * 8 + 4, true);
        const chunk = input.subarray(inPos, inPos + len);
        u8().set(chunk, ptr);
        inPos += chunk.length;
        total += chunk.length;
      }
      view().setUint32(nread, total, true);
      return 0;
    },
    fd_fdstat_get: (fd: number, out: number) => {
      if (fd > 2) return 8;
      const v = view();
      v.setUint8(out, 2); // character device
      v.setUint16(out + 2, 0, true);
      v.setBigUint64(out + 8, ALL_RIGHTS, true);
      v.setBigUint64(out + 16, ALL_RIGHTS, true);
      return 0;
    },
    fd_prestat_get: () => 8,
    fd_prestat_dir_name: () => 8,
    fd_close: () => 0,
    fd_seek: () => 70, // ESPIPE
    fd_fdstat_set_flags: () => 0,
    path_open: () => 44, // ENOENT
    proc_exit: (code: number) => { throw new ProcExit(code); },
    sched_yield: () => 0,
  };

  const imports = new Proxy({ wasi_snapshot_preview1: wasi } as Record<string, Record<string, unknown>>, {});
  const wmod = new WebAssembly.Module(wasm as BufferSource);
  const instance = new WebAssembly.Instance(wmod, imports as WebAssembly.Imports);
  memory = instance.exports.memory as WebAssembly.Memory;

  let exitCode = 0;
  let trap: string | undefined;
  try {
    (instance.exports._start as () => void)();
  } catch (e) {
    if (e instanceof ProcExit) exitCode = e.code;
    else {
      exitCode = 134;
      trap = e instanceof Error ? e.message : String(e);
    }
  }
  const join = (parts: Uint8Array[]) => dec.decode(concat(parts));
  return { stdout: join(outChunks[1]), stderr: join(outChunks[2]), exitCode, trap };
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
