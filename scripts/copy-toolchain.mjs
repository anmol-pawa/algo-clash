// Copies the @yowasp/clang bundle + wasm + libc++ resources into public/toolchain/
// (gitignored, ~105 MB) so the compile worker can load them as plain static files.
// The service worker does not precache this folder; it is cached on first use.
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "node_modules/@yowasp/clang/gen");
const dst = join(process.cwd(), "public/toolchain");
mkdirSync(dst, { recursive: true });
for (const f of ["bundle.js", "llvm.core.wasm", "llvm.core2.wasm", "llvm.core3.wasm", "llvm.core4.wasm", "llvm-resources.tar"]) {
  copyFileSync(join(src, f), join(dst, f));
}
console.log("toolchain copied to public/toolchain");
