// Copies the @yowasp/clang bundle (module + wasm + libc++ resources) next to our
// compile worker in public/toolchain/. bundle.js locates its assets with
// `new URL("./x", import.meta.url)`, so serving them from one folder avoids
// bundler involvement and keeps the 100 MB out of the JS chunks.
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const src = join(process.cwd(), "node_modules/@yowasp/clang/gen");
const dest = join(process.cwd(), "public/toolchain");
mkdirSync(dest, { recursive: true });
for (const f of readdirSync(src)) copyFileSync(join(src, f), join(dest, f));
copyFileSync(join(process.cwd(), "scripts/toolchain/compile-worker.js"), join(dest, "compile-worker.js"));
console.log("toolchain copied to public/toolchain");
