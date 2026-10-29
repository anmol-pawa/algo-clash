/**
 * Friendly explanations for the most common clang errors (GDD §5, ARCH §2.2).
 * Every entry carries a broken `snippet`; tests/judge-clang-errors.test.ts compiles it natively
 * and checks that the clang message matches `pattern`, so the table cannot drift from real output.
 */
export interface ClangErrorEntry {
  id: string;
  /** Matches the message part of a clang `error:` line. */
  pattern: RegExp;
  title: string;
  why: string;
  fix: string;
  /** Minimal program that triggers this error. */
  snippet: string;
}

const inc = "#include <vector>\n#include <string>\n#include <map>\n#include <unordered_map>\n#include <algorithm>\n";
const main = (body: string) => `${inc}int main() {\n${body}\n  return 0;\n}\n`;

export const CLANG_ERRORS: ClangErrorEntry[] = [
  { id: "expected-semicolon", pattern: /expected ';'(?! after (class|struct|enum))/, title: "Missing semicolon", why: "A statement or declaration must end with `;`. Clang reports it at the end of the previous line.", fix: "Add `;` after the statement just before the reported position (also after a `struct`/`class` closing brace).", snippet: main("  int x = 1\n  x++;") },
  { id: "undeclared-identifier", pattern: /use of undeclared identifier '/, title: "Unknown name", why: "The name is not declared at this point: a typo, a missing variable declaration, a missing `#include`, or it is declared in an inner scope.", fix: "Check spelling and case, declare the variable before use, and make sure it is in scope.", snippet: main("  total = 5;") },
  { id: "no-member-named", pattern: /no member named '/, title: "No such member", why: "The type has no field or method with that name. Common with STL: `v.length()` on a vector, `s.push()` on a string.", fix: "Look up the right name (`size()`, `push_back`, `emplace`, `top` vs `front`).", snippet: main("  std::vector<int> v;\n  int n = v.length();") },
  { id: "no-matching-function", pattern: /no matching function for call to/, title: "No function fits these arguments", why: "No overload accepts the argument types or count you passed (too few or too many arguments also land here).", fix: "Compare your call with the signature in the notes below the error: argument count, order, and const-ness.", snippet: main("  std::vector<int> v;\n  std::sort(v);") },
  { id: "no-matching-member", pattern: /no matching member function for call to/, title: "No method fits these arguments", why: "The method exists but not with these argument types or count.", fix: "Check the method's parameters in the candidate notes below.", snippet: main("  std::vector<int> v;\n  v.push_back(1, 2);") },
  { id: "cannot-initialize", pattern: /cannot initialize a (variable|parameter|return object) of type '[^'*]*'/, title: "Type mismatch on initialisation", why: "You are giving a value of one type to something of an incompatible type, such as a string literal to an `int` or a pointer to a `bool` vector element.", fix: "Convert explicitly, or change the declared type to match the value.", snippet: main("  int x = \"hello\";") },
  { id: "no-viable-conversion", pattern: /no viable conversion from/, title: "No conversion between these types", why: "There is no implicit conversion between the two types, for example `std::string` to `int` or `vector<int>` to `vector<long long>`.", fix: "Convert element by element, use `std::stoi`/`std::to_string`, or declare the right type.", snippet: main("  std::string s = \"12\";\n  int n = s;") },
  { id: "invalid-operands", pattern: /invalid operands to binary expression/, title: "Operator does not apply to these types", why: "The operator is not defined for the operand types, e.g. `+` on two `vector`s or `==` on a struct without `operator==`.", fix: "Use a function that does what you mean (`insert`, a loop) or define the operator.", snippet: main("  std::vector<int> a, b;\n  auto c = a + b;") },
  { id: "const-assign", pattern: /cannot assign to (variable|return value|non-static data member|.*) .*const|read-only variable is not assignable|cannot assign to variable '.*' with const-qualified type/, title: "Assigning to a const value", why: "The target is `const` (or a `const&` parameter), so it cannot change.", fix: "Remove `const` if you need to modify it, or copy it into a local variable first.", snippet: main("  const int x = 1;\n  x = 2;") },
  { id: "discards-qualifiers", pattern: /(drops|discards) '?const'? qualifier|'const' qualifier|is not marked const/, title: "Calling a mutating method through const", why: "You called a non-const method on a `const` object or `const&` parameter.", fix: "Take the parameter by non-const reference, or mark the method `const` if it does not modify the object.", snippet: `${inc}struct A { void bump() { n++; } int n = 0; };\nvoid f(const A& a) { a.bump(); }\nint main() { A a; f(a); }\n` },
  { id: "non-const-ref-temp", pattern: /non-const lvalue reference to type '.*' cannot bind to/, title: "Reference cannot bind to this value", why: "A non-const `T&` only binds to a named variable of exactly that type, not to a temporary or a different type.", fix: "Pass a variable of the right type, or take `const T&` / by value.", snippet: main("  int& r = 5;") },
  { id: "redefinition", pattern: /redefinition of '/, title: "Declared twice", why: "The same name is declared twice in the same scope.", fix: "Rename one, or drop the second type (`int`) to reuse the variable.", snippet: main("  int x = 1;\n  int x = 2;") },
  { id: "unknown-type", pattern: /unknown type name '/, title: "Unknown type", why: "Clang does not know this type: missing `#include`, missing `std::`, or a typo (`string` without `std::` in a header).", fix: "Add the right `#include` and write `std::string`, `std::vector`, ... or `using namespace std;` in solution files.", snippet: "int f() { Foo x; return 0; }\nint main() { return f(); }\n" },
  { id: "not-member-of-std", pattern: /no (type|template) named '.*' in namespace 'std'|no member named '.*' in namespace 'std'/, title: "That is not in std", why: "The name does not exist in `std`, or its header is not included.", fix: "Check the spelling (`unordered_map`, `priority_queue`) and include the matching header.", snippet: "#include <vector>\nint main() { std::vektor<int> v; }\n" },
  { id: "missing-template-args", pattern: /requires template arguments|no viable constructor or deduction guide/, title: "Template arguments missing", why: "`vector`, `map` and friends need their type arguments.", fix: "Write `vector<int>` (C++17 can deduce some from constructor arguments, but not from nothing).", snippet: "#include <vector>\nint main() { std::vector v; }\n" },
  { id: "expected-expression", pattern: /expected expression/, title: "Expression expected here", why: "Clang found a token that cannot start an expression: an unfinished line, a stray `)` or an operator with nothing after it.", fix: "Look at the caret: finish the expression or remove the extra token.", snippet: main("  int x = ;") },
  { id: "expected-rparen", pattern: /expected '\)'/, title: "Missing closing parenthesis", why: "A `(` was opened but not closed.", fix: "Count your parentheses in the condition or call on that line.", snippet: main("  int x = 1;\n  if (x > 0 {\n  }") },
  { id: "expected-brace", pattern: /expected '}'|extraneous closing brace/, title: "Unbalanced braces", why: "A `{` is never closed, or there is one `}` too many.", fix: "Re-indent the function and match each brace; let the editor highlight the pair.", snippet: "int main() {\n  int x = 1;\n" },
  { id: "expected-unqualified-id", pattern: /expected unqualified-id|a type specifier is required/, title: "Declaration or name expected", why: "Something sits where a name or declaration should be, often an extra `}` or `;`, or a statement outside a function.", fix: "Check braces above the caret and make sure statements are inside a function.", snippet: "int x = 1;\nx = 2;\nint main() {}\n" },
  { id: "extra-tokens", pattern: /extraneous '\)' before ';'|expected ';' after (class|struct|enum)|extra tokens/, title: "Stray token", why: "A class/struct/enum definition must end with `;`, or there is an extra `)` or token.", fix: "Add `;` after the closing `}` of the class, or remove the stray token.", snippet: "struct P { int x; }\nint main() {}\n" },
  { id: "return-type-void", pattern: /void function '.*' should not return a value|should not return a value/, title: "Returning a value from void", why: "The function is declared `void`, so `return x;` is not allowed.", fix: "Change the return type, or write `return;`.", snippet: "void f() { return 1; }\nint main() { f(); }\n" },
  { id: "return-missing-value", pattern: /non-void function '.*' should return a value|non-void (function|lambda) should return a value/, title: "Missing return value", why: "The function promises a value but a path returns nothing.", fix: "Return a value of the declared type on every path.", snippet: "int f() { return; }\nint main() { f(); }\n" },
  { id: "member-ptr", pattern: /member reference type '.*' is a pointer; did you mean to use '->'/, title: "Use -> on pointers", why: "`.` accesses members of an object; through a pointer you need `->`.", fix: "Write `node->next` instead of `node.next` (or `(*node).next`).", snippet: "struct N { int v; N* next; };\nint f(N* n) { return n.v; }\nint main() {}\n" },
  { id: "member-nonptr", pattern: /member reference type '.*' is not a pointer; did you mean to use '\.'|is not a pointer/, title: "Use . on objects", why: "`->` is for pointers; this is an object or reference.", fix: "Write `node.next` instead of `node->next`.", snippet: "struct N { int v; };\nint f(N n) { return n->v; }\nint main() {}\n" },
  { id: "not-subscriptable", pattern: /type '.*' does not provide a subscript operator|subscripted value is not an array/, title: "Cannot index this type", why: "`[]` does not exist for this type, e.g. `std::set`, `std::list`, or an `int`.", fix: "Use iterators, `std::next`, or a different container (`vector`, `map`).", snippet: "#include <set>\nint main() { std::set<int> s; return s[0]; }\n" },
  { id: "private-member", pattern: /is a private member of/, title: "Private member", why: "Members of a `class` are private by default, and code outside cannot touch them.", fix: "Put the member in a `public:` section, or use a public method.", snippet: "class A { int x = 0; };\nint main() { A a; return a.x; }\n" },
  { id: "abstract-class", pattern: /allocating an object of abstract class type|is an abstract class/, title: "Cannot create an abstract class", why: "The class has a pure virtual function (`= 0`) that nothing overrides.", fix: "Create a derived class that overrides every pure virtual method and instantiate that.", snippet: "struct I { virtual void f() = 0; };\nint main() { I i; }\n" },
  { id: "no-default-ctor", pattern: /no matching constructor for initialization of|no default constructor exists/, title: "No constructor fits", why: "The type has no constructor matching these arguments (or no default constructor, when you gave none).", fix: "Pass the constructor arguments, or add the constructor.", snippet: "struct A { A(int) {} };\nint main() { A a; }\n" },
  { id: "break-outside", pattern: /'(break|continue)' statement not in (loop|switch)/, title: "break/continue outside a loop", why: "`break` and `continue` only work inside a loop (`break` also in a `switch`). Usually a brace is misplaced and the loop ended early.", fix: "Check the braces around the loop body.", snippet: main("  break;") },
  { id: "deduce-auto", pattern: /(cannot deduce type for|declaration of variable '.*' with deduced type 'auto' requires an initializer)/, title: "auto needs an initial value", why: "`auto` copies the type of its initialiser, so it must have one.", fix: "Write the type or give an initial value.", snippet: main("  auto x;") },
  { id: "jump-bypasses", pattern: /cannot jump from switch statement to this case label|jump bypasses variable initialization/, title: "Declaration inside a case", why: "A `case` jumps past a variable's initialisation. Declare it inside braces.", fix: "Wrap the case body in `{ ... }`.", snippet: main("  int k = 1;\n  switch (k) {\n    case 0:\n      int y = 3;\n      break;\n    case 1:\n      break;\n  }") },
  { id: "narrowing", pattern: /(type '.*' cannot be narrowed to '.*' in initializer list|non-constant-expression cannot be narrowed)/, title: "Narrowing in braces", why: "Brace-initialisation refuses to silently lose information (e.g. `long long` to `int`).", fix: "Use the matching type or an explicit cast.", snippet: main("  long long big = 5;\n  int x{big};") },
  { id: "lambda-capture", pattern: /variable '.*' cannot be implicitly captured in a lambda with no capture-default specified/, title: "Lambda needs a capture", why: "A lambda cannot see local variables unless you capture them.", fix: "Use `[&]` (by reference) or `[=]`, or list the variable in `[...]`.", snippet: main("  int k = 2;\n  auto f = [](int x) { return x * k; };\n  f(1);") },
  { id: "recursive-lambda", pattern: /variable '.*' declared with deduced type 'auto' cannot appear in its own initializer/, title: "auto lambda cannot call itself", why: "The type of an `auto` variable is unknown while its own initialiser is being compiled.", fix: "Declare it as `std::function<int(int)> f = [&](int x) { ... f(x-1) ... };` or use a named helper.", snippet: main("  auto f = [&](int n) -> int { return n ? f(n - 1) : 0; };\n  f(2);") },
  { id: "ptr-compare-int", pattern: /ordered comparison between pointer and integer|comparison between pointer and integer/, title: "Comparing a pointer with a number", why: "A pointer such as a `ListNode*` cannot be compared with an integer other than `nullptr`/`0`.", fix: "Compare `node->val` with the number, or `node` with `nullptr`.", snippet: "struct N { int v; };\nbool f(N* n) { return n > 5; }\nint main() {}\n" },
  { id: "ptr-int-conv", pattern: /(incompatible (integer to pointer|pointer to integer) conversion|cannot initialize a variable of type '.*\*' with an (lvalue|rvalue) of type 'int')/, title: "Integer where a pointer is expected", why: "A number cannot become a pointer. Use `nullptr` for \"no node\".", fix: "Write `nullptr` (or `new Node(x)` for a real node).", snippet: "struct N { int v; };\nint main() { N* p = 5; }\n" },
  { id: "static-nonstatic", pattern: /(call to non-static member function without an object argument|invalid use of non-static data member|invalid use of member '.*' in static member function)/, title: "Instance member used without an object", why: "A non-static member needs an object (`this`); static functions and free functions have none.", fix: "Make the helper `static`, or call it on an object.", snippet: "struct S { int f(); static int g() { return f(); } };\nint S::f() { return 1; }\nint main() {}\n" },
  { id: "undefined-ref", pattern: /undefined (reference|symbol)|function '.*' is not defined|use of undeclared identifier 'main'/, title: "Declared but never defined", why: "The linker found a call to a function with no body.", fix: "Provide the definition (and check its signature matches the declaration exactly).", snippet: "int missing();\nint main() { return missing(); }\n" },
  { id: "conflicting-types", pattern: /(conflicting types for|functions that differ only in their return type cannot be overloaded|out-of-line definition of '.*' does not match any declaration)/, title: "Declaration mismatch", why: "Two declarations of the same function disagree on parameters or return type.", fix: "Make the declaration and definition signatures identical.", snippet: "int f(int a);\nlong f(int a) { return a; }\nint main() {}\n" },
  { id: "unused-or-err-ternary", pattern: /(incompatible operand types|different types for the operands of '\?:')/, title: "Ternary branches differ", why: "Both branches of `a ? b : c` must have compatible types.", fix: "Convert one branch so both are the same type.", snippet: "#include <string>\nint main() { bool b = true; auto x = b ? 1 : std::string(\"s\"); }\n" },
];

export interface ClangDiagnostic {
  line: number;
  column: number;
  message: string;
  entry: ClangErrorEntry | null;
}

const DIAG_RE = /^(?:.*?):(\d+):(\d+): (?:fatal )?error: (.*)$/gm;

/** Parse clang stderr into diagnostics with the matching friendly entry, in output order. */
export function parseClangErrors(stderr: string, lineOffset = 0): ClangDiagnostic[] {
  const out: ClangDiagnostic[] = [];
  for (const m of stderr.matchAll(DIAG_RE)) {
    const message = m[3].trim();
    out.push({ line: Number(m[1]) - lineOffset, column: Number(m[2]), message, entry: CLANG_ERRORS.find((e) => e.pattern.test(message)) ?? null });
  }
  return out;
}

/** The first error is the one to fix first: later ones are often knock-on effects. */
export function explainFirstError(stderr: string, lineOffset = 0): ClangDiagnostic | null {
  return parseClangErrors(stderr, lineOffset)[0] ?? null;
}
