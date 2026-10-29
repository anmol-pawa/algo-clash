import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CLANG_ERRORS, explainFirstError, parseClangErrors } from "@/lib/judge/clangErrors";

const dir = mkdtempSync(join(tmpdir(), "algo-clang-err-"));

function compile(src: string, name: string): string {
  const file = join(dir, `${name}.cpp`);
  writeFileSync(file, src);
  // Link too (not -fsyntax-only) so linker-level errors are exercised.
  const r = spawnSync("clang++", ["-std=c++20", "-fno-exceptions", file, "-o", join(dir, name)], { encoding: "utf8" });
  return r.stderr;
}

describe("clang error table", () => {
  it("has at least 40 entries with unique ids", () => {
    expect(CLANG_ERRORS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(CLANG_ERRORS.map((e) => e.id)).size).toBe(CLANG_ERRORS.length);
  });

  for (const entry of CLANG_ERRORS) {
    it(`${entry.id}: real clang output maps to its own entry`, () => {
      const stderr = compile(entry.snippet, entry.id);
      const diags = parseClangErrors(stderr);
      const linkErr = /undefined reference|undefined symbol/.test(stderr);
      expect(diags.length > 0 || linkErr, stderr).toBe(true);
      const hit = diags.some((d) => d.entry?.id === entry.id) || (linkErr && entry.id === "undefined-ref");
      expect(hit, stderr).toBe(true);
    });
  }
});

describe("parseClangErrors", () => {
  it("applies the line offset and keeps order", () => {
    const stderr = "/x/a.cpp:12:5: error: use of undeclared identifier 'q'\n   12 | q = 1;\n/x/a.cpp:20:1: error: expected ';' after expression\n";
    const d = parseClangErrors(stderr, 10);
    expect(d.map((x) => x.line)).toEqual([2, 10]);
    expect(d[0].entry?.id).toBe("undeclared-identifier");
  });
  it("returns null for clean output", () => {
    expect(explainFirstError("")).toBeNull();
  });
});
