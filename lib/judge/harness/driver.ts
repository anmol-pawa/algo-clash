/** Generates the per-problem C++ translation unit: harness + player code + a `main` (ARCH §2.3). */
import { LC_HARNESS_H } from "./lcHarness";

export interface Param {
  /** C++ type as written in the signature, e.g. `vector<int>&` or `const string&`. */
  type: string;
  name: string;
}

export interface MethodSpec {
  name: string;
  params: Param[];
  /** C++ return type, or `void` (then `outParam` names the parameter printed after the call). */
  returns: string;
  outParam?: string;
}

/** `class Solution { public: R method(params); }` with one test per stdin group of lines. */
export interface FunctionSpec extends MethodSpec {
  kind: "function";
  className?: string;
  graphNode?: boolean;
}

/** LC operations format: `["LRUCache","put","get"]` then `[[2],[1,1],[1]]`. */
export interface DesignSpec {
  kind: "design";
  className: string;
  ctor: Param[];
  methods: MethodSpec[];
  graphNode?: boolean;
}

export type DriverSpec = FunctionSpec | DesignSpec;

const IDENT = /^[A-Za-z_]\w*$/;

/** `const vector<int>&` -> `vector<int>`; the harness reads into a plain value. */
export function valueType(t: string): string {
  return t.replace(/\bconst\b/g, "").replace(/&/g, "").replace(/\s+/g, " ").trim();
}

function check(spec: DriverSpec): void {
  const names = [spec.kind === "function" ? spec.name : spec.className, ...paramsOf(spec).map((p) => p.name)];
  for (const n of names) if (!IDENT.test(n)) throw new Error(`bad identifier '${n}'`);
  const methods = spec.kind === "function" ? [spec] : spec.methods;
  for (const m of methods) {
    if (!IDENT.test(m.name)) throw new Error(`bad identifier '${m.name}'`);
    if (m.returns.trim() === "void" && !m.outParam && spec.kind === "function") throw new Error(`void ${m.name} needs outParam`);
    if (m.outParam && !m.params.some((p) => p.name === m.outParam)) throw new Error(`outParam '${m.outParam}' is not a parameter of ${m.name}`);
  }
}

function paramsOf(spec: DriverSpec): Param[] {
  return spec.kind === "function" ? spec.params : [...spec.ctor, ...spec.methods.flatMap((m) => m.params)];
}

const PRELUDE = `#include <bits/stdc++.h>\nusing namespace std;\n`;

const READ_ARG = `
template <class T> static void readArg(T& v) {
  std::string line;
  if (!std::getline(std::cin, line)) lch::fail("missing input line");
  lch::Reader r(line);
  lch::read(r, v);
}
`;

function declare(params: Param[], indent: string, from: (p: Param) => string): string {
  return params.map((p) => `${indent}${valueType(p.type)} ${p.name}{};\n${indent}${from(p)}\n`).join("");
}

function emitPrint(indent: string, expr: string): string {
  return `${indent}lch::print(out, ${expr});\n`;
}

function functionMain(spec: FunctionSpec): string {
  const call = `sol.${spec.name}(${spec.params.map((p) => p.name).join(", ")})`;
  const body = spec.returns.trim() === "void"
    ? `    ${call};\n${emitPrint("    ", spec.outParam!)}`
    : `    auto result = ${call};\n${emitPrint("    ", "result")}`;
  return `${READ_ARG}
int main() {
  std::ios::sync_with_stdio(false);
  std::string header;
  if (!std::getline(std::cin, header)) lch::fail("missing test count");
  const int tests = std::atoi(header.c_str());
  for (int t = 0; t < tests; ++t) {
${declare(spec.params, "    ", (p) => `readArg(${p.name});`)}    ${spec.className ?? "Solution"} sol;
    std::string out;
${body}    std::puts(out.c_str());
  }
  return 0;
}
`;
}

function designMain(spec: DesignSpec): string {
  const readArgs = (params: Param[]) =>
    params
      .map((p, i) => `${i ? "        args.expect(',');\n" : ""}        ${valueType(p.type)} ${p.name}{};\n        lch::read(args, ${p.name});\n`)
      .join("");
  const ctorArgs = spec.ctor.map((p) => p.name).join(", ");
  const branches = spec.methods.map((m) => {
    const call = `obj->${m.name}(${m.params.map((p) => p.name).join(", ")})`;
    const use =
      m.returns.trim() === "void"
        ? `        ${call};\n        out += "null";\n`
        : `        auto result = ${call};\n${emitPrint("        ", "result")}`;
    return `      } else if (ops[i] == "${m.name}") {\n        if (!obj) lch::fail("method called before construction");\n${readArgs(m.params)}${use}`;
  });
  return `${READ_ARG}
int main() {
  std::ios::sync_with_stdio(false);
  std::string header;
  if (!std::getline(std::cin, header)) lch::fail("missing test count");
  const int tests = std::atoi(header.c_str());
  for (int t = 0; t < tests; ++t) {
    std::vector<std::string> ops;
    readArg(ops);
    std::string argsLine;
    if (!std::getline(std::cin, argsLine)) lch::fail("missing arguments line");
    lch::Reader args(argsLine);
    args.expect('[');
    std::unique_ptr<${spec.className}> obj;
    std::string out = "[";
    for (size_t i = 0; i < ops.size(); ++i) {
      if (i) { args.expect(','); out += ','; }
      args.expect('[');
      if (ops[i] == "${spec.className}") {
${readArgs(spec.ctor)}        obj = std::make_unique<${spec.className}>(${ctorArgs});
        out += "null";
${branches.join("")}      } else {
        lch::fail("unknown operation");
      }
      args.expect(']');
    }
    out += ']';
    std::puts(out.c_str());
  }
  return 0;
}
`;
}

/** The complete source handed to the compiler: harness, then the player's code, then `main`. */
export function generateSource(spec: DriverSpec, userCode: string): string {
  check(spec);
  const macros = spec.graphNode ? "#define LCH_GRAPH_NODE 1\n" : "";
  const main = spec.kind === "function" ? functionMain(spec) : designMain(spec);
  return `${macros}${PRELUDE}${LC_HARNESS_H}\n#line 1 "solution.cpp"\n${userCode}\n#line 1 "driver.cpp"\n${main}`;
}

/** Stdin for a batch of tests: the count, then one line per parameter (or ops + args for design). */
export function encodeInput(tests: string[][]): string {
  return `${tests.length}\n${tests.map((t) => t.join("\n")).join("\n")}\n`;
}
