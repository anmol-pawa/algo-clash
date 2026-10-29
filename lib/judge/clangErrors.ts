/**
 * Friendly explanations for the most common clang compile errors (GDD §5, ARCH §2.2).
 * Every entry carries a broken `example`; tests/judge-clang-errors.test.ts compiles each one natively
 * and checks that clang's first error is matched by that entry, so the patterns track real clang output.
 * Order matters: the first entry whose pattern matches wins, so specific entries come before generic ones.
 */

export interface Diagnostic {
  file: string;
  line: number;
  col: number;
  severity: "error" | "fatal error" | "warning" | "note";
  message: string;
}

export interface ClangErrorEntry {
  id: string;
  pattern: RegExp;
  title: string;
  explain: string;
  fix: string;
  /** Clang reports this one as a warning (then fails with a follow-on error), so show it as well. */
  warning?: true;
  /** Minimal broken program that triggers this entry (verified natively in tests). */
  example: string;
}

const DIAG_LINE = /^(.*?):(\d+):(\d+): (fatal error|error|warning|note): (.*)$/;

/** Parse clang's plain-text output (`-fno-color-diagnostics`) into diagnostics, ignoring source/caret lines. */
export function parseDiagnostics(raw: string): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const line of raw.split("\n")) {
    const m = DIAG_LINE.exec(line);
    if (!m) continue;
    out.push({ file: m[1], line: Number(m[2]), col: Number(m[3]), severity: m[4] as Diagnostic["severity"], message: m[5] });
  }
  return out;
}

export const CLANG_ERRORS: ClangErrorEntry[] = [
  {
    id: "missing-semicolon",
    pattern: /^expected ';'/,
    title: "Missing semicolon",
    explain: "A statement or declaration must end with `;`. Clang reports the spot right after the last token it read, so the real gap is usually at the end of the previous line.",
    fix: "Add `;` at the end of the line above the reported position (also after `struct`/`class` closing braces).",
    example: "int main(){ int x = 1 return x; }",
  },
  {
    id: "expected-expression",
    pattern: /^expected expression/,
    title: "Expression expected",
    explain: "The compiler needed a value here (after `=`, `(`, `,` or an operator) and found nothing it could use.",
    fix: "Supply the missing operand, or remove the dangling operator or comma.",
    example: "int main(){ int x = ; return x; }",
  },
  {
    id: "missing-close-paren",
    pattern: /^expected '\)'/,
    title: "Unbalanced parenthesis",
    explain: "An opening `(` was never closed before the compiler reached something that cannot continue the expression.",
    fix: "Count your parentheses in the reported statement and add the missing `)`.",
    example: "int main(){ return (1 + 2; }",
  },
  {
    id: "missing-close-brace",
    pattern: /^expected '\}'/,
    title: "Unbalanced brace",
    explain: "A `{` was opened but the file ended (or the code became invalid) before it was closed.",
    fix: "Match every `{` with a `}`. Indent consistently so the missing one stands out.",
    example: "int main(){ if (1) { return 0; }",
  },
  {
    id: "extra-close-brace",
    pattern: /^extraneous closing brace/,
    title: "Extra closing brace",
    explain: "There is one more `}` than there are open `{`. Often the function or class already ended earlier.",
    fix: "Delete the extra `}` or find the missing `{` above it.",
    example: "int main(){ return 0; } }",
  },
  {
    id: "unterminated-string",
    warning: true,
    pattern: /missing terminating '"' character/,
    title: "String literal not closed",
    explain: "A string starting with `\"` never gets its closing `\"` on the same line.",
    fix: "Close the string, or use `\\n` instead of a real line break inside it.",
    example: 'int main(){ const char* s = "abc; return 0; }',
  },
  {
    id: "header-not-found",
    pattern: /^'[^']+' file not found/,
    title: "Header not found",
    explain: "The `#include` names a file the compiler cannot find. Usually a typo, or a header that is not part of the standard library.",
    fix: "Check the spelling (`<vector>`, `<unordered_map>`, `<algorithm>`) or include `<bits/stdc++.h>` if the problem allows it.",
    example: "#include <vectorr>\nint main(){ return 0; }",
  },
  {
    id: "undeclared-identifier",
    pattern: /^use of undeclared identifier '/,
    title: "Unknown name",
    explain: "This name has not been declared before this point. Typos, a variable used outside its `{ }` scope, or a missing `std::`/`#include` all cause it.",
    fix: "Declare the variable before use, fix the spelling, or add the missing `std::` prefix and header.",
    example: "int main(){ return y; }",
  },
  {
    id: "unknown-type",
    pattern: /^unknown type name '/,
    title: "Unknown type",
    explain: "The compiler does not know this type name. Common causes: a typo, a missing `#include`, or a missing `std::` (for example `string`).",
    fix: "Include the right header and write `std::` before library types, or fix the spelling.",
    example: "int main(){ Foo f; return 0; }",
  },
  {
    id: "no-template-named",
    pattern: /^no template named '/,
    title: "Library template not found",
    explain: "Names like `vector`, `map` and `unordered_set` live in namespace `std`. Without `std::` (or `using namespace std;`) and the matching header, they do not exist.",
    fix: "Write `std::vector<int>` and `#include <vector>`, or add `using namespace std;` if the problem template does.",
    example: "int main(){ vector<int> v; return 0; }",
  },
  {
    id: "no-member",
    pattern: /^no member named '/,
    title: "No such member",
    explain: "That type has no field or method with this name. Often a different STL spelling (`push` vs `push_back`, `length` vs `size`) or a typo.",
    fix: "Look up the container's real method name; check capitalisation and spelling.",
    example: "#include <vector>\nint main(){ std::vector<int> v; v.push(1); return 0; }",
  },
  {
    id: "private-member",
    pattern: /is a (private|protected) member of /,
    title: "Private member",
    explain: "`class` members are private by default, so code outside the class cannot touch them.",
    fix: "Add a `public:` section for what callers need (LeetCode solutions need `public:` before the method).",
    example: "class A{ int x; };\nint main(){ A a; return a.x; }",
  },
  {
    id: "dot-on-pointer",
    pattern: /is a pointer; did you mean to use '->'/,
    title: "Use -> on pointers",
    explain: "The left side is a pointer, so members are reached with `->` (or `(*p).`).",
    fix: "Replace `.` with `->`. This is the usual fix for `ListNode*` and `TreeNode*`.",
    example: "struct A{int v;};\nint main(){ A* a = nullptr; return a.v; }",
  },
  {
    id: "arrow-on-value",
    pattern: /is not a pointer; did you mean to use '\.'/,
    title: "Use . on objects",
    explain: "The left side is an object, not a pointer, so members are reached with `.`.",
    fix: "Replace `->` with `.`.",
    example: "struct A{int v;};\nint main(){ A a; return a->v; }",
  },
  {
    id: "deref-non-pointer",
    pattern: /^indirection requires pointer operand/,
    title: "Dereferencing a non-pointer",
    explain: "`*x` only works on pointers and iterators. This value is a plain object.",
    fix: "Remove the `*`, or take an address or iterator first.",
    example: "int main(){ int x = 1; return *x; }",
  },
  {
    id: "subscript-non-array",
    pattern: /^subscripted value is not an array/,
    title: "Cannot index this value",
    explain: "`x[i]` needs an array, pointer, vector, string or other type with `operator[]`. This value has none (a plain int, for example).",
    fix: "Index the container, not an element inside it; check how many `[ ]` the type allows.",
    example: "int main(){ int x = 1; return x[0]; }",
  },
  {
    id: "const-assign",
    pattern: /^cannot assign to (variable|non-static data member|return value|.*const)/,
    title: "Writing to something const",
    explain: "The target is `const`: a const variable, a member written inside a `const` method, or a const reference.",
    fix: "Drop `const` from the variable, or remove `const` from the method if it must change state.",
    example: "int main(){ const int x = 1; x = 2; return x; }",
  },
  {
    id: "ref-cannot-bind",
    pattern: /^non-const lvalue reference to type '.*' cannot bind to/,
    title: "Reference cannot bind",
    explain: "A non-const `T&` can only refer to a variable of exactly type `T`, not a temporary or a different type.",
    fix: "Make the reference `const T&`, or pass a variable of the exact type.",
    example: "int main(){ long long a=1; int& r = a; return r; }",
  },
  {
    id: "narrowing",
    pattern: /cannot be narrowed from type/,
    title: "Narrowing conversion in braces",
    explain: "Brace initialisation refuses conversions that might lose data, such as `long long` to `int`.",
    fix: "Use an explicit `static_cast<int>(x)`, or pick a wide enough type.",
    example: "int main(){ long long a = 1; int b{a}; return b; }",
  },
  {
    id: "return-type-mismatch",
    pattern: /^cannot initialize return object of type/,
    title: "Wrong return type",
    explain: "The returned value cannot become the function's declared return type.",
    fix: "Return the right type, or change the function's declared type.",
    example: 'int f(){ return "a"; }\nint main(){ return f(); }',
  },
  {
    id: "void-returns-value",
    pattern: /^void function '.*' should not return a value/,
    title: "Returning a value from void",
    explain: "A `void` function cannot return a value. In-place LeetCode problems (`void rotate(...)`) change the argument instead.",
    fix: "Use plain `return;`, or change the return type.",
    example: "void f(){ return 1; }\nint main(){ f(); return 0; }",
  },
  {
    id: "stream-direction",
    pattern: /^invalid operands to binary expression \('(std::)?(istream|ostream)/,
    title: "Wrong stream operator",
    explain: "`cin` reads with `>>` and `cout` writes with `<<`. The arrows point the way the data flows.",
    fix: "Use `cin >> x;` and `cout << x;`.",
    example: "#include <iostream>\nint main(){ int x; std::cin << x; return 0; }",
  },
  {
    id: "missing-less-than",
    pattern: /^invalid operands to binary expression \('const (\w+)' and 'const \1'\)/,
    title: "Type has no ordering",
    explain: "`std::set`, `std::map` and `std::priority_queue` order keys with `<`. Your struct does not define it.",
    fix: "Add `bool operator<(const T&) const`, or pass a comparator as the last template argument.",
    example: "#include <set>\nstruct P{int a;};\nint main(){ std::set<P> s; s.insert(P{1}); return 0; }",
  },
  {
    id: "invalid-operands",
    pattern: /^invalid operands to binary expression/,
    title: "Operator not defined for these types",
    explain: "The operator is not defined for this pair of types (adding two `vector`s or comparing a string with a char vector, for example).",
    fix: "Operate on elements, convert one side, or write the loop yourself.",
    example: "#include <vector>\nint main(){ std::vector<int> a,b; int c = a * b; return c; }",
  },
  {
    id: "missing-hash",
    pattern: /implicitly-deleted default constructor of 'std::unordered_(map|set)</,
    title: "Type has no hash",
    explain: "`unordered_map` and `unordered_set` need a hash function for the key. Structs and `pair`s have none by default.",
    fix: "Supply a custom hash struct as the template argument, encode the key as a `long long` or `string`, or use `map`.",
    example: "#include <unordered_map>\nstruct P{int a;};\nint main(){ std::unordered_map<P,int> m; m[P{1}]=1; return 0; }",
  },
  {
    id: "deduction-conflict",
    pattern: /^no matching function for call to '(max|min)'/,
    title: "std::max/min with mixed types",
    explain: "`std::max(a, b)` needs both arguments to have the same type; `int` and `long long` (or `int` and `size_t`) conflict.",
    fix: "Cast one argument (`static_cast<long long>(a)`) or write `std::max<long long>(a, b)`.",
    example: "#include <algorithm>\nint main(){ int a = 1; double b = 2; return std::max(a, b); }",
  },
  {
    id: "no-matching-function",
    pattern: /^no matching function for call to /,
    title: "No overload fits this call",
    explain: "No function with this name accepts these arguments: wrong count, wrong types, or a const/reference mismatch. The notes below the error list each candidate.",
    fix: "Compare your call with the candidate signatures in the notes; fix the argument count or types.",
    example: "#include <vector>\nint f(int a,int b){return a+b;}\nint main(){ return f(1); }",
  },
  {
    id: "no-matching-constructor",
    pattern: /^no matching constructor for initialization of /,
    title: "No constructor fits",
    explain: "The type has no constructor accepting these arguments. If you declared any constructor yourself, the implicit default one disappears.",
    fix: "Pass arguments that match a constructor, or add the constructor you need (`A() = default;`).",
    example: "#include <string>\nint main(){ std::string s(1,2,3,4,5); return 0; }",
  },
  {
    id: "ctad-failed",
    pattern: /^no viable constructor or deduction guide/,
    title: "Template arguments cannot be deduced",
    explain: "Without an initialiser, the compiler cannot work out `T` in `vector<T>`.",
    fix: "State it: `std::vector<int> v;`.",
    example: "#include <vector>\nint main(){ std::vector v; return 0; }",
  },
  {
    id: "no-viable-conversion",
    pattern: /^no viable conversion from /,
    title: "Cannot convert between these types",
    explain: "There is no implicit conversion between these types. A string does not become a number, and a vector does not become a string.",
    fix: "Convert on purpose: `std::stoi`, `std::to_string`, or build the container explicitly.",
    example: "#include <string>\nint main(){ int x = std::string(\"1\"); return x; }",
  },
  {
    id: "cannot-initialize",
    pattern: /^cannot initialize (a variable|a parameter|a value) of type /,
    title: "Wrong type on the right-hand side",
    explain: "The value on the right cannot initialise a variable of this type (an `int` for a pointer, a pointer for an `int`, a `void` call result).",
    fix: "Check the types. Use `nullptr` for null pointers, `*p` to read through one, and do not store the result of a `void` call.",
    example: "int main(){ int* p = 5; return 0; }",
  },
  {
    id: "deleted-function",
    pattern: /^call to (deleted|implicitly-deleted) (constructor|function|copy constructor)/,
    title: "Copying something that cannot be copied",
    explain: "`unique_ptr`, streams and other move-only types have deleted copies. One owner only.",
    fix: "Use `std::move(x)` to transfer ownership, or pass by reference.",
    example: "#include <memory>\nint main(){ auto a = std::make_unique<int>(1); auto b = a; return 0; }",
  },
  {
    id: "redefinition",
    pattern: /^redefinition of /,
    title: "Declared twice",
    explain: "This name is already defined in the same scope. Pasting a helper twice or reusing a variable name in one block causes it.",
    fix: "Rename it, delete the duplicate, or assign to the existing variable instead of declaring again.",
    example: "int main(){ int a = 1; int a = 2; return a; }",
  },
  {
    id: "incomplete-type",
    pattern: /^(variable has )?incomplete type|^field has incomplete type/,
    title: "Type is only declared, not defined",
    explain: "The compiler has seen `struct A;` but not its body, so it does not know its size. You can hold pointers to it, not values.",
    fix: "Define the struct before use (move it above), or use a pointer.",
    example: "struct A;\nint main(){ A a; return 0; }",
  },
  {
    id: "abstract-class",
    pattern: /is an abstract class/,
    title: "Instantiating an abstract class",
    explain: "A class with a pure virtual function (`= 0`) is an interface. You can only create objects of subclasses that implement it all.",
    fix: "Instantiate a concrete subclass, or implement every pure virtual method.",
    example: "struct A{ virtual void f()=0; };\nint main(){ A a; return 0; }",
  },
  {
    id: "bad-override",
    pattern: /marked 'override'|only virtual member functions can be marked 'override'/,
    title: "override does not match",
    explain: "`override` promises the function replaces a base virtual with the same signature. The signature (parameters or const) differs.",
    fix: "Copy the base signature exactly, including `const`.",
    example: "struct A{ virtual void f(){} };\nstruct B: A{ void f(int) override {} };\nint main(){ return 0; }",
  },
  {
    id: "non-static-call",
    pattern: /^call to non-static member function without an object argument/,
    title: "Method needs an object",
    explain: "`A::f()` only works for `static` methods. A normal method belongs to an object.",
    fix: "Call it on an instance (`a.f()`), or declare the method `static`.",
    example: "struct A{ int f(){return 1;} };\nint main(){ return A::f(); }",
  },
  {
    id: "lambda-capture",
    pattern: /cannot be implicitly captured in a lambda/,
    title: "Lambda does not capture this variable",
    explain: "A lambda only sees outside variables listed in its `[ ]`.",
    fix: "Write `[&]` to capture by reference, `[=]` by value, or list names like `[&x]`. A recursive lambda needs `std::function` or a `this` auto-parameter.",
    example: "int main(){ int x=1; auto f = []{ return x; }; return f(); }",
  },
  {
    id: "range-for-bad",
    pattern: /^invalid range expression of type/,
    title: "Not something you can loop over",
    explain: "A range-based `for` needs a container or array. A plain number (or a pointer without a length) has no begin/end.",
    fix: "Loop over the container, or use a classic `for (int i = 0; i < n; ++i)`.",
    example: "int main(){ int x = 3; for (auto e : x) {} return 0; }",
  },
  {
    id: "auto-without-init",
    pattern: /with deduced type 'auto' requires an initializer/,
    title: "auto needs a value",
    explain: "`auto` copies its type from the initialiser, so there must be one.",
    fix: "Write the type (`int x;`), or initialise: `auto x = 0;`.",
    example: "int main(){ auto x; return 0; }",
  },
  {
    id: "break-outside",
    pattern: /^'(break|continue)' statement not in loop/,
    title: "break/continue outside a loop",
    explain: "`break` and `continue` only make sense inside a loop (`break` also inside `switch`). The braces probably closed the loop early.",
    fix: "Check bracing; use `return` to leave a function.",
    example: "int main(){ break; return 0; }",
  },
  {
    id: "case-jump",
    pattern: /^cannot jump from switch statement to this case label/,
    title: "Declaration inside a case",
    explain: "A later `case` would jump over the initialisation of a variable declared in an earlier one.",
    fix: "Wrap the case body in `{ ... }`, or declare the variable before the `switch`.",
    example: "int main(){ int k=1; switch(k){ case 1: int a = 2; break; case 2: break; } return 0; }",
  },
  {
    id: "static-assert",
    pattern: /^static assertion failed/,
    title: "static_assert failed",
    explain: "A compile-time check failed. Library errors that mention requirements usually mean the template arguments are unsuitable.",
    fix: "Read the quoted requirement and adjust the types.",
    example: 'int main(){ static_assert(1 == 2, "nope"); return 0; }',
  },
];

/** The entry explaining one clang message, or undefined for messages we do not cover. */
export function explainMessage(message: string): ClangErrorEntry | undefined {
  return CLANG_ERRORS.find((e) => e.pattern.test(message));
}

export interface ExplainedDiagnostic {
  diagnostic: Diagnostic;
  entry?: ClangErrorEntry;
}

/** Diagnostics that count as errors for the player: real errors, plus warnings the table flags as the root cause. */
export function errorDiagnostics(raw: string): ExplainedDiagnostic[] {
  return parseDiagnostics(raw)
    .map((diagnostic) => ({ diagnostic, entry: explainMessage(diagnostic.message) }))
    .filter(({ diagnostic: d, entry }) => d.severity === "error" || d.severity === "fatal error" || (d.severity === "warning" && entry?.warning === true));
}

/** Parse clang output and attach friendly entries to every error (other warnings and notes are dropped). */
export function explainCompile(raw: string): ExplainedDiagnostic[] {
  return errorDiagnostics(raw);
}
