import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CLANG_ERRORS, errorDiagnostics, explainCompile, explainMessage, parseDiagnostics } from "@/lib/judge/clangErrors";

const dir = mkdtempSync(join(tmpdir(), "algo-clang-err-"));

/** Compile like the browser judge does (no exceptions, -Wall) but syntax-only, returning clang's stderr. */
function compile(code: string, name: string): string {
  const file = join(dir, `${name}.cpp`);
  writeFileSync(file, code);
  const r = spawnSync("clang++", ["-std=c++20", "-fno-exceptions", "-Wall", "-fsyntax-only", "-fno-color-diagnostics", file], { encoding: "utf8" });
  return r.stderr;
}

describe("clang error table", () => {
  it("covers at least 40 errors with unique ids and non-empty text", () => {
    expect(CLANG_ERRORS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(CLANG_ERRORS.map((e) => e.id)).size).toBe(CLANG_ERRORS.length);
    for (const e of CLANG_ERRORS) {
      expect(e.title.length).toBeGreaterThan(3);
      expect(e.explain.length).toBeGreaterThan(20);
      expect(e.fix.length).toBeGreaterThan(5);
    }
  });

  for (const entry of CLANG_ERRORS) {
    it(`native clang's first error for the ${entry.id} example maps to ${entry.id}`, () => {
      const errors = errorDiagnostics(compile(entry.example, entry.id));
      expect(errors.length, "example must fail to compile").toBeGreaterThan(0);
      expect(errors[0].entry?.id, `first error was: ${errors[0].diagnostic.message}`).toBe(entry.id);
    });
  }

  it("parses multi-line output, skipping source lines, carets and the summary", () => {
    const raw = [
      "a.cpp:3:5: error: use of undeclared identifier 'y'",
      "    3 |     y = 1;",
      "      |     ^",
      "a.cpp:1:1: note: declared here",
      "a.cpp:4:1: warning: unused variable 'z' [-Wunused-variable]",
      "1 error generated.",
    ].join("\n");
    const d = parseDiagnostics(raw);
    expect(d.map((x) => x.severity)).toEqual(["error", "note", "warning"]);
    expect(d[0]).toMatchObject({ file: "a.cpp", line: 3, col: 5 });
    const ex = explainCompile(raw);
    expect(ex).toHaveLength(1);
    expect(ex[0].entry?.id).toBe("undeclared-identifier");
  });

  it("returns no entry for messages it does not know", () => {
    expect(explainMessage("something clang invents next year")).toBeUndefined();
    expect(explainCompile("x.cpp:1:1: error: something clang invents next year")[0].entry).toBeUndefined();
  });
});
