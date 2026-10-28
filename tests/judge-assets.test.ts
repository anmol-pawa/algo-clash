import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const judge = join(process.cwd(), "public/judge");

describe("judge toolchain assets", () => {
  it("copy-judge-assets places the toolchain and shim next to the workers", () => {
    execFileSync("node", ["scripts/copy-judge-assets.mjs"], { stdio: "pipe" });
    for (const f of ["bundle.js", "llvm.core.wasm", "llvm-resources.tar", "wasi-shim/index.js", "compile-worker.mjs", "run-worker.mjs"]) {
      expect(existsSync(join(judge, f)), f).toBe(true);
    }
  });
});
