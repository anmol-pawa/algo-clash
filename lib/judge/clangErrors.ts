/** Friendly explanations for clang diagnostics (ARCH §2.2). The rules are checked against real clang output in tests/judge-clang-errors.test.ts. */

export type Severity = "fatal" | "error" | "warning" | "note";

export interface Diagnostic {
  file: string;
  line: number;
  col: number;
  severity: Severity;
  message: string;
  /** The `-Wfoo` flag name (without `-W`) clang appends to warnings that are promoted to errors, if any. */
  flag?: string;
  /** The `note:` lines that follow this diagnostic. */
  notes: { file: string; line: number; message: string }[];
}

export interface FriendlyError {
  rule: string;
  title: string;
  explain: string;
  /** 1-based line in the player's code; null when the error is in harness or driver code. */
  line: number | null;
  col: number | null;
  raw: string;
}

export interface CompileReport {
  errors: FriendlyError[];
  /** Errors beyond the first `max` that are not shown. */
  hidden: number;
  headline: string;
}

/** Extra clang flags so that undefined behaviour the judge can't catch at run time is a compile error. */
export const JUDGE_CLANG_FLAGS = ["-Werror=return-type"];

/** Name of the player's file as set by the `#line` directive in the generated source. */
export const USER_FILE = "solution.cpp";

const DIAG_RE = /^(.+?):(\d+):(\d+): (fatal error|error|warning|note): (.*)$/;
const FLAG_RE = /\s\[-W([\w+-]+)\]$/;

export function parseDiagnostics(raw: string): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const text of raw.split(/\r?\n/)) {
    const m = DIAG_RE.exec(text);
    if (!m) continue;
    let message = m[5];
    const f = FLAG_RE.exec(message);
    if (f) message = message.slice(0, f.index);
    if (m[4] === "note") {
      out[out.length - 1]?.notes.push({ file: m[1], line: Number(m[2]), message: m[5] });
      continue;
    }
    out.push({
      notes: [],
      file: m[1],
      line: Number(m[2]),
      col: Number(m[3]),
      severity: m[4] === "fatal error" ? "fatal" : (m[4] as Severity),
      message,
      flag: f?.[1],
    });
  }
  return out;
}

interface Rule {
  id: string;
  title: string;
  re: RegExp;
  explain: (m: RegExpExecArray) => string;
}

/** Order matters: the first matching rule wins, so specific rules go before general ones. */
export const RULES: Rule[] = [
  { id: "missing-semicolon", title: "Missing semicolon", re: /^expected ';'/, explain: () => "A statement, declaration or struct/class definition must end with `;`. Look at the end of this line, or the line just above it." },
  { id: "missing-paren", title: "Missing bracket", re: /^expected '[)\]]'/, explain: () => "A `(` or `[` was opened but not closed. Count your brackets on this line." },
  { id: "missing-brace", title: "Missing closing brace", re: /^expected '}'/, explain: () => "A `{` was opened but never closed. Check that every block ends with `}`." },
  { id: "extra-brace", title: "Extra closing brace", re: /^extraneous closing brace/, explain: () => "There is a `}` with no matching `{`. Remove it, or add the missing `{` above." },
  { id: "bad-syntax", title: "Syntax error", re: /^(expected (statement|expression|identifier|unqualified-id|member name)|unexpected|invalid digit)/, explain: (m) => `The compiler could not parse this (${m[0]}). The real mistake is often a missing ), ; or } just before this spot.` },
  { id: "undeclared", title: "Unknown name", re: /^use of undeclared identifier '(.+?)'/, explain: (m) => `\`${m[1]}\` has not been declared at this point. Check the spelling, that it is declared before use, and that it is in scope (a variable declared inside a loop or if-block is gone after the closing brace).` },
  { id: "undeclared-label", title: "Unknown label", re: /^use of undeclared label/, explain: () => "This `goto` names a label that does not exist." },
  { id: "unknown-type", title: "Unknown type", re: /^(unknown type name|no template named|no type named) '(.+?)'/, explain: (m) => `\`${m[2]}\` is not a known type here. Check the spelling and the template arguments (e.g. \`vector<int>\`).` },
  { id: "no-member", title: "No such member", re: /^no member named '(.+?)' in (?:namespace )?'?(.+?)'?(?:;|$)/, explain: (m) => `\`${m[2]}\` has no member \`${m[1]}\`. Check the spelling, and whether it is a function (needs \`()\`) on a different container.` },
  { id: "member-not-called", title: "Function not called", re: /^reference to non-static member function must be called/, explain: () => "A member function such as `size` needs parentheses: `v.size()`, not `v.size`." },
  { id: "member-on-nonclass", title: "Dot on a non-object", re: /^member reference base type '(.+?)' is not a structure or union/, explain: (m) => `You used \`.\` on a value of type \`${m[1]}\`, which has no members. If it is a pointer use \`->\`; if it is a plain number, there is nothing to call.` },
  { id: "private-member", title: "Private member", re: /^'(.+?)' is a (private|protected) member of '(.+?)'/, explain: (m) => `\`${m[1]}\` is ${m[2]} in \`${m[3]}\`. Make it \`public:\` or access it through a method (in a \`struct\`, members are public by default).` },
  { id: "const-assign", title: "Changing a const value", re: /^(cannot assign to (variable|non-static data member|return value|.*?) .*const|read-only variable is not assignable|const-qualified)/, explain: () => "You are modifying something that is `const` (often a `const&` parameter, or a `const` variable). Copy it first, or drop the `const`." },
  { id: "redefinition", title: "Declared twice", re: /^redefinition of '(.+?)'/, explain: (m) => `\`${m[1]}\` is declared twice in the same scope. Rename one, or assign instead of redeclaring.` },
  { id: "auto-no-init", title: "`auto` needs a value", re: /^declaration of variable '.+?' with deduced type 'auto' requires an initializer/, explain: () => "`auto` copies its type from the initial value, so write `auto x = value;`." },
  { id: "return-mismatch", title: "Return type mismatch", re: /^no viable conversion from returned value/, explain: () => "The value you return does not match the function's return type in the signature." },
  { id: "bad-conversion", title: "Wrong type", re: /^(no viable conversion|cannot initialize a (variable|return object)|assigning to|non-const lvalue reference|invalid operands to binary expression|no viable overloaded|cannot convert|implicit conversion)/, explain: () => "The types do not match here: you are mixing two types that cannot be converted (for example `int*` with `int`, a `vector` with a number, or a string with a char). Check the types on both sides." },
  { id: "narrowing", title: "Narrowing conversion", re: /cannot be narrowed from type '(.+?)' to '(.+?)'/, explain: (m) => `Braces refuse to silently shrink \`${m[1]}\` into \`${m[2]}\`. Use \`static_cast<${m[2]}>(...)\` or round brackets if you mean it.` },
  { id: "const-method", title: "Changing a const value", re: /^no matching member function for call to '(.+?)'$/, explain: (m) => `\`${m[1]}\` modifies the object, but here the object is \`const\` (often a \`const&\` parameter). Copy it first, or drop the \`const\`.` },
  { id: "bad-call", title: "Wrong arguments in call", re: /^(no matching (member )?function for call to '(.+?)'|too (many|few) arguments|candidate)/, explain: (m) => `The call to \`${m[3] ?? "this function"}\` does not match any version of it: check the number of arguments, their types, and \`const\`.` },
  { id: "missing-return", title: "Missing return", re: /^non-void function does not return a value|control reaches end of non-void function/, explain: () => "Some path through this function ends without `return`. That is undefined behaviour: return a value on every path." },
  { id: "void-return", title: "Returning from void", re: /^void function '(.+?)' should not return a value/, explain: (m) => `\`${m[1]}\` is declared \`void\`, so \`return\` takes no value. Change the return type, or remove the value.` },
  { id: "bad-range-for", title: "Cannot loop over this", re: /^invalid range expression/, explain: () => "A range-for (`for (auto x : y)`) needs something with begin() and end(), such as a vector, string or array. A single number does not work." },
  { id: "vla-init", title: "Variable-sized array", re: /^variable-sized object may not be initialized/, explain: () => "An array whose size is a runtime variable cannot have `= {…}`. Use `vector<int> a(n);` instead." },
  { id: "jump-case", title: "Declaration inside case", re: /^cannot jump from switch statement to this case label/, explain: () => "A variable declared inside one `case` is visible to the next. Wrap the case body in `{ }`." },
  { id: "abstract", title: "Abstract class", re: /is an abstract class/, explain: () => "This class still has a pure virtual function (`= 0`), so it cannot be instantiated. Implement it in a derived class." },
  { id: "not-assignable", title: "Cannot assign here", re: /^expression is not assignable|^lvalue required/, explain: () => "The left side of `=`, `++` or `--` must be a variable, not a temporary value or expression result." },
  { id: "missing-include", title: "Header not found", re: /^'(.+?)' file not found/, explain: (m) => `\`${m[1]}\` does not exist. The standard library headers are already included for you, so you can delete this line.` },
  { id: "generic", title: "Compile error", re: /./, explain: () => "The compiler rejected this line. Read the message below; fix the first error first, because later errors are often caused by it." },
];

function classify(d: Diagnostic): { rule: string; title: string; explain: string } {
  for (const r of RULES) {
    const m = r.re.exec(d.message);
    if (!m) continue;
    // `no matching member function` is a const problem only when a note says the method is not const.
    if (r.id === "const-method" && !d.notes.some((n) => n.message.includes("not marked const"))) continue;
    return { rule: r.id, title: r.title, explain: r.explain(m) };
  }
  throw new Error("unreachable: the last rule matches everything");
}

/** Turn raw clang output into friendly errors, in order, capped at `max` (default 40). Notes and warnings are skipped unless promoted to errors. */
export function explainCompile(raw: string, max = 40): CompileReport {
  const errs = parseDiagnostics(raw).filter((d) => d.severity === "error" || d.severity === "fatal");
  const shown = errs.slice(0, max).map((d): FriendlyError => {
    // An error reported in harness code (e.g. an unclosed brace swallowing the driver) may point back into the player's code via a note.
    const at = d.file === USER_FILE ? d : d.notes.find((n) => n.file === USER_FILE);
    return { ...classify(d), line: at?.line ?? null, col: d.file === USER_FILE ? d.col : null, raw: d.message };
  });
  const hidden = errs.length - shown.length;
  const first = shown[0];
  const headline = !first
    ? "Compile failed, but no readable error was reported."
    : first.line === null
      ? `${first.title}: this looks like it comes from how your code is used by the judge. Check your method signature.`
      : `Line ${first.line}: ${first.title}`;
  return { errors: shown, hidden, headline };
}
