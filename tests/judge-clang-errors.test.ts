import { execFile } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";
import { explainCompile, JUDGE_CLANG_FLAGS, parseDiagnostics, RULES } from "@/lib/judge/clangErrors";
import { generateSource, type DriverSpec } from "@/lib/judge/harness/driver";

const dir = mkdtempSync(join(tmpdir(), "algo-clang-err-"));
const spec: DriverSpec = { kind: "function", name: "f", returns: "int", params: [{ type: "int", name: "n" }] };
let counter = 0;

/** Native clang with the flags the browser judge uses; returns stderr (empty if it compiles). */
async function compile(code: string): Promise<string> {
  const file = join(dir, `c${counter++}.cpp`);
  writeFileSync(file, generateSource(spec, code));
  const args = ["-std=c++20", "-fno-exceptions", "-fsyntax-only", "-fno-color-diagnostics", ...JUDGE_CLANG_FLAGS, file];
  try {
    await promisify(execFile)("clang++", args, { encoding: "utf8" });
    return "";
  } catch (e) {
    return (e as { stderr: string }).stderr;
  }
}

const wrap = (body: string, pre = "") => `${pre}class Solution { public: int f(int n) {\n${body}\n return 0; } };`;

/** Known-broken snippets; `line` is the 1-based line in the player's code of the first error. */
const CASES: { name: string; code: string; rule: string; line: number }[] = [
  { name: "missing semicolon", code: wrap("vector<int> v; v.push_back(1)"), rule: "missing-semicolon", line: 2 },
  { name: "missing semicolon after struct", code: `struct S { int a; }\n${wrap("")}`, rule: "missing-semicolon", line: 1 },
  { name: "missing close paren", code: wrap("for (int i = 0; i < n; i++ { }"), rule: "missing-paren", line: 2 },
  { name: "missing close brace", code: "class Solution { public: int f(int n) { return n;", rule: "missing-brace", line: 1 },
  { name: "extra close brace", code: `${wrap("")}\n}`, rule: "extra-brace", line: 4 },
  { name: "bad octal literal", code: wrap("int x = 08;"), rule: "bad-syntax", line: 2 },
  { name: "undeclared name", code: wrap("int x = y;"), rule: "undeclared", line: 2 },
  { name: "undeclared label", code: wrap("goto done;"), rule: "undeclared-label", line: 2 },
  { name: "unknown type", code: wrap("Foo x;"), rule: "unknown-type", line: 2 },
  { name: "unknown template", code: wrap("vectr<int> x;"), rule: "unknown-type", line: 2 },
  { name: "misspelt member", code: wrap("vector<int> v; v.push_bak(1);"), rule: "no-member", line: 2 },
  { name: "size without parens", code: wrap("vector<int> v; int s = v.size;"), rule: "member-not-called", line: 2 },
  { name: "dot on int", code: wrap("int x = 1; x.foo();"), rule: "member-on-nonclass", line: 2 },
  { name: "private member", code: `class A { int p; };\n${wrap("A a; a.p = 1;")}`, rule: "private-member", line: 3 },
  { name: "assign to const", code: wrap("const int x = 1; x = 2;"), rule: "const-assign", line: 2 },
  { name: "push_back on const&", code: `int g(const vector<int>& v) { v.push_back(1); return 0; }\n${wrap("")}`, rule: "const-method", line: 1 },
  { name: "redefinition", code: wrap("int x = 1; int x = 2;"), rule: "redefinition", line: 2 },
  { name: "auto without value", code: wrap("auto x;"), rule: "auto-no-init", line: 2 },
  { name: "int to string", code: wrap("string s = 5;"), rule: "bad-conversion", line: 2 },
  { name: "int to pointer", code: wrap("int x = 1; int* p = x;"), rule: "bad-conversion", line: 2 },
  { name: "vector compared to int", code: wrap("vector<int> v; if (v == 1) {}"), rule: "bad-conversion", line: 2 },
  { name: "narrowing in braces", code: wrap("long long a = 1; int b = {a};"), rule: "narrowing", line: 2 },
  { name: "too many arguments", code: `int g(int a) { return a; }\n${wrap("g(1, 2);")}`, rule: "bad-call", line: 3 },
  { name: "string pushed into vector<int>", code: wrap('vector<int> v; v.push_back("a");'), rule: "bad-call", line: 2 },
  { name: "missing return (promoted warning)", code: "class Solution { public: int f(int n) { if (n) return 1; } };", rule: "missing-return", line: 1 },
  { name: "void returns a value", code: `void g() { return 1; }\n${wrap("")}`, rule: "void-return", line: 1 },
  { name: "return vector from int", code: wrap("vector<int> v; return v;"), rule: "return-mismatch", line: 2 },
  { name: "range-for over int", code: wrap("for (auto x : 5) {}"), rule: "bad-range-for", line: 2 },
  { name: "VLA with initializer", code: wrap("int k = n; int a[k] = {0};"), rule: "vla-init", line: 2 },
  { name: "declaration inside case", code: wrap("switch (n) { case 1: int x = 1; break; case 2: break; }"), rule: "jump-case", line: 2 },
  { name: "abstract class", code: `class B { virtual void f() = 0; };\n${wrap("B b;")}`, rule: "abstract", line: 3 },
  { name: "post-increment twice", code: wrap("int x = 0; x++ ++;"), rule: "not-assignable", line: 2 },
  { name: "missing header", code: `#include <nonexistent.h>\n${wrap("")}`, rule: "missing-include", line: 1 },
];

describe("clang diagnostics parser", () => {
  it("parses diagnostics, strips the warning flag and attaches notes", () => {
    const raw = [
      "solution.cpp:3:5: error: unused thing [-Wunused]",
      "    3 |   int x;",
      "      |       ^",
      "solution.cpp:1:1: note: declared here",
      "driver.cpp:9:2: warning: meh",
      "1 error generated.",
    ].join("\n");
    const d = parseDiagnostics(raw);
    expect(d).toHaveLength(2);
    expect(d[0]).toMatchObject({ file: "solution.cpp", line: 3, col: 5, severity: "error", message: "unused thing", flag: "unused", notes: [{ file: "solution.cpp", line: 1, message: "declared here" }] });
    expect(d[1].severity).toBe("warning");
  });

  it("maps harness-only errors to a null line and a signature hint", () => {
    const r = explainCompile("driver.cpp:5:3: error: no matching function for call to 'f'\n");
    expect(r.errors[0].line).toBeNull();
    expect(r.headline).toMatch(/signature/);
  });

  it("caps at 40 errors and reports how many are hidden", () => {
    const raw = Array.from({ length: 55 }, (_, i) => `solution.cpp:${i + 1}:1: error: use of undeclared identifier 'q${i}'`).join("\n");
    const r = explainCompile(raw);
    expect(r.errors).toHaveLength(40);
    expect(r.hidden).toBe(15);
    expect(r.errors[39].line).toBe(40);
  });

  it("handles output with no readable error", () => {
    expect(explainCompile("").headline).toMatch(/no readable error/);
  });
});

describe("friendly errors from real clang output", () => {
  const raws = new Map<string, string>();
  let clean = "?";
  beforeAll(async () => {
    const all = await Promise.all(CASES.map((c) => compile(c.code)));
    CASES.forEach((c, i) => raws.set(c.name, all[i]));
    clean = await compile(wrap("return n + 1;"));
  });

  for (const c of CASES) {
    it(c.name, () => {
      const raw = raws.get(c.name) ?? "";
      const r = explainCompile(raw);
      expect(r.errors.length, raw).toBeGreaterThan(0);
      expect(r.errors[0].rule, raw).toBe(c.rule);
      expect(r.errors[0].rule).not.toBe("generic");
      expect(r.errors[0].line, raw).toBe(c.line);
      expect(r.headline).toContain(`Line ${c.line}`);
    });
  }

  it("a correct solution compiles with no diagnostics", () => {
    expect(clean).toBe("");
  });

  it("every specific rule is exercised by at least one snippet", () => {
    const covered = new Set(CASES.map((c) => c.rule));
    const missing = RULES.map((r) => r.id).filter((id) => id !== "generic" && !covered.has(id));
    expect(missing).toEqual([]);
  });
});
