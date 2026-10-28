// Copies the in-browser C++ toolchain (@yowasp/clang, ~105 MB) and the WASI shim
// from node_modules into public/judge/ so the judge workers can load them as
// plain static files. The output is generated and gitignored; the service worker
// caches it on demand rather than precaching it (see scripts/gen-sw.mjs).
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const clangGen = join(root, "node_modules/@yowasp/clang/gen");
const shimDist = join(root, "node_modules/@bjorn3/browser_wasi_shim/dist");
const dest = join(root, "public/judge");

if (!existsSync(clangGen) || !existsSync(shimDist)) {
  console.error("copy-judge-assets: run `npm ci` first");
  process.exit(1);
}
mkdirSync(join(dest, "wasi-shim"), { recursive: true });
for (const f of readdirSync(clangGen)) cpSync(join(clangGen, f), join(dest, f));
for (const f of readdirSync(shimDist)) if (f.endsWith(".js")) cpSync(join(shimDist, f), join(dest, "wasi-shim", f));
console.log("judge assets copied to public/judge/");
