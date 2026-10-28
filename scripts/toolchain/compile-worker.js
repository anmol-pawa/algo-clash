// Module worker: owns the clang module. Protocol:
//   in : { id, args: string[], files: Tree }
//   out: { id, type: "progress", done, total } | { id, type: "result", ok, wasm?, stderr, ms }
import { commands } from "./bundle.js";

const dec = new TextDecoder();

self.onmessage = async (e) => {
  const { id, args, files } = e.data;
  let stderr = "";
  const t0 = performance.now();
  try {
    const out = await commands["clang++"](args, files, {
      stderr: (b) => { if (b) stderr += dec.decode(b); },
      fetchProgress: (p) => self.postMessage({ id, type: "progress", done: p.doneLength, total: p.totalLength }),
    });
    const wasm = out["a.wasm"];
    self.postMessage({ id, type: "result", ok: true, wasm, stderr, ms: performance.now() - t0 }, [wasm.buffer]);
  } catch (err) {
    self.postMessage({ id, type: "result", ok: false, stderr: stderr || String(err), ms: performance.now() - t0 });
  }
};
