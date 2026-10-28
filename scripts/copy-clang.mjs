// Copies the @yowasp/clang runtime (bundle + wasm + libc++ resources, ~105 MB)
// into public/judge/clang/ so the judge worker can load it as static files.
// The copy is git-ignored and made by `predev`/`prebuild`/`pretypecheck`-style hooks.
import { cpSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "node_modules/@yowasp/clang/gen");
const dest = join(process.cwd(), "public/judge/clang");
if (!existsSync(src)) {
  console.error("copy-clang: run `npm ci` first (@yowasp/clang missing)");
  process.exit(1);
}
mkdirSync(dest, { recursive: true });
for (const f of ["bundle.js", "llvm-resources.tar", "llvm.core.wasm", "llvm.core2.wasm", "llvm.core3.wasm", "llvm.core4.wasm"]) {
  const to = join(dest, f);
  if (!existsSync(to) || statSync(to).size !== statSync(join(src, f)).size) cpSync(join(src, f), to);
}
console.log("copy-clang: runtime ready in public/judge/clang");
