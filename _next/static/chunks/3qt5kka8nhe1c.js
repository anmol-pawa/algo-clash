(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,83587,64517,t=>{let e="/algo-clash",n=null,i=1;t.s(["S",0,function(t,r=["-O2"]){let s=n??=new Worker(`${e}/judge/compile-worker.js`,{type:"module"}),a=i++;return new Promise(e=>{let n=t=>{t.data.id===a&&(s.removeEventListener("message",n),e(t.data))};s.addEventListener("message",n),s.postMessage({id:a,source:t,flags:r})})},"M",0,function(t,n,i,r=[]){let s=new Worker(`${e}/judge/run-worker.js`);return new Promise(e=>{let a=setTimeout(()=>{s.terminate(),e({status:"TLE",exitCode:-1,stdout:"",stderr:"",wallMs:i,detail:"timeout",memPages:0})},i);s.onmessage=t=>{clearTimeout(a),s.terminate(),e(t.data)},s.onerror=t=>{clearTimeout(a),s.terminate(),e({status:"RE",exitCode:-1,stdout:"",stderr:"",wallMs:0,detail:String(t.message),memPages:0})},s.postMessage({wasm:t.slice(),stdin:n,args:r})})}],83587);let r="#include <vector>\n#include <string>\n#include <map>\n#include <unordered_map>\n#include <algorithm>\n",s=t=>`${r}int main() {
${t}
  return 0;
}
`,a=[{id:"expected-semicolon",pattern:/expected ';'(?! after (class|struct|enum))/,title:"Missing semicolon",why:"A statement or declaration must end with `;`. Clang reports it at the end of the previous line.",fix:"Add `;` after the statement just before the reported position (also after a `struct`/`class` closing brace).",snippet:s("  int x = 1\n  x++;")},{id:"undeclared-identifier",pattern:/use of undeclared identifier '/,title:"Unknown name",why:"The name is not declared at this point: a typo, a missing variable declaration, a missing `#include`, or it is declared in an inner scope.",fix:"Check spelling and case, declare the variable before use, and make sure it is in scope.",snippet:s("  total = 5;")},{id:"no-member-named",pattern:/no member named '/,title:"No such member",why:"The type has no field or method with that name. Common with STL: `v.length()` on a vector, `s.push()` on a string.",fix:"Look up the right name (`size()`, `push_back`, `emplace`, `top` vs `front`).",snippet:s("  std::vector<int> v;\n  int n = v.length();")},{id:"no-matching-function",pattern:/no matching function for call to/,title:"No function fits these arguments",why:"No overload accepts the argument types or count you passed (too few or too many arguments also land here).",fix:"Compare your call with the signature in the notes below the error: argument count, order, and const-ness.",snippet:s("  std::vector<int> v;\n  std::sort(v);")},{id:"no-matching-member",pattern:/no matching member function for call to/,title:"No method fits these arguments",why:"The method exists but not with these argument types or count.",fix:"Check the method's parameters in the candidate notes below.",snippet:s("  std::vector<int> v;\n  v.push_back(1, 2);")},{id:"cannot-initialize",pattern:/cannot initialize a (variable|parameter|return object) of type '[^'*]*'/,title:"Type mismatch on initialisation",why:"You are giving a value of one type to something of an incompatible type, such as a string literal to an `int` or a pointer to a `bool` vector element.",fix:"Convert explicitly, or change the declared type to match the value.",snippet:s('  int x = "hello";')},{id:"no-viable-conversion",pattern:/no viable conversion from/,title:"No conversion between these types",why:"There is no implicit conversion between the two types, for example `std::string` to `int` or `vector<int>` to `vector<long long>`.",fix:"Convert element by element, use `std::stoi`/`std::to_string`, or declare the right type.",snippet:s('  std::string s = "12";\n  int n = s;')},{id:"invalid-operands",pattern:/invalid operands to binary expression/,title:"Operator does not apply to these types",why:"The operator is not defined for the operand types, e.g. `+` on two `vector`s or `==` on a struct without `operator==`.",fix:"Use a function that does what you mean (`insert`, a loop) or define the operator.",snippet:s("  std::vector<int> a, b;\n  auto c = a + b;")},{id:"const-assign",pattern:/cannot assign to (variable|return value|non-static data member|.*) .*const|read-only variable is not assignable|cannot assign to variable '.*' with const-qualified type/,title:"Assigning to a const value",why:"The target is `const` (or a `const&` parameter), so it cannot change.",fix:"Remove `const` if you need to modify it, or copy it into a local variable first.",snippet:s("  const int x = 1;\n  x = 2;")},{id:"discards-qualifiers",pattern:/(drops|discards) '?const'? qualifier|'const' qualifier|is not marked const/,title:"Calling a mutating method through const",why:"You called a non-const method on a `const` object or `const&` parameter.",fix:"Take the parameter by non-const reference, or mark the method `const` if it does not modify the object.",snippet:`${r}struct A { void bump() { n++; } int n = 0; };
void f(const A& a) { a.bump(); }
int main() { A a; f(a); }
`},{id:"non-const-ref-temp",pattern:/non-const lvalue reference to type '.*' cannot bind to/,title:"Reference cannot bind to this value",why:"A non-const `T&` only binds to a named variable of exactly that type, not to a temporary or a different type.",fix:"Pass a variable of the right type, or take `const T&` / by value.",snippet:s("  int& r = 5;")},{id:"redefinition",pattern:/redefinition of '/,title:"Declared twice",why:"The same name is declared twice in the same scope.",fix:"Rename one, or drop the second type (`int`) to reuse the variable.",snippet:s("  int x = 1;\n  int x = 2;")},{id:"unknown-type",pattern:/unknown type name '/,title:"Unknown type",why:"Clang does not know this type: missing `#include`, missing `std::`, or a typo (`string` without `std::` in a header).",fix:"Add the right `#include` and write `std::string`, `std::vector`, ... or `using namespace std;` in solution files.",snippet:"int f() { Foo x; return 0; }\nint main() { return f(); }\n"},{id:"not-member-of-std",pattern:/no (type|template) named '.*' in namespace 'std'|no member named '.*' in namespace 'std'/,title:"That is not in std",why:"The name does not exist in `std`, or its header is not included.",fix:"Check the spelling (`unordered_map`, `priority_queue`) and include the matching header.",snippet:"#include <vector>\nint main() { std::vektor<int> v; }\n"},{id:"missing-template-args",pattern:/requires template arguments|no viable constructor or deduction guide/,title:"Template arguments missing",why:"`vector`, `map` and friends need their type arguments.",fix:"Write `vector<int>` (C++17 can deduce some from constructor arguments, but not from nothing).",snippet:"#include <vector>\nint main() { std::vector v; }\n"},{id:"expected-expression",pattern:/expected expression/,title:"Expression expected here",why:"Clang found a token that cannot start an expression: an unfinished line, a stray `)` or an operator with nothing after it.",fix:"Look at the caret: finish the expression or remove the extra token.",snippet:s("  int x = ;")},{id:"expected-rparen",pattern:/expected '\)'/,title:"Missing closing parenthesis",why:"A `(` was opened but not closed.",fix:"Count your parentheses in the condition or call on that line.",snippet:s("  int x = 1;\n  if (x > 0 {\n  }")},{id:"expected-brace",pattern:/expected '}'|extraneous closing brace/,title:"Unbalanced braces",why:"A `{` is never closed, or there is one `}` too many.",fix:"Re-indent the function and match each brace; let the editor highlight the pair.",snippet:"int main() {\n  int x = 1;\n"},{id:"expected-unqualified-id",pattern:/expected unqualified-id|a type specifier is required/,title:"Declaration or name expected",why:"Something sits where a name or declaration should be, often an extra `}` or `;`, or a statement outside a function.",fix:"Check braces above the caret and make sure statements are inside a function.",snippet:"int x = 1;\nx = 2;\nint main() {}\n"},{id:"extra-tokens",pattern:/extraneous '\)' before ';'|expected ';' after (class|struct|enum)|extra tokens/,title:"Stray token",why:"A class/struct/enum definition must end with `;`, or there is an extra `)` or token.",fix:"Add `;` after the closing `}` of the class, or remove the stray token.",snippet:"struct P { int x; }\nint main() {}\n"},{id:"return-type-void",pattern:/void function '.*' should not return a value|should not return a value/,title:"Returning a value from void",why:"The function is declared `void`, so `return x;` is not allowed.",fix:"Change the return type, or write `return;`.",snippet:"void f() { return 1; }\nint main() { f(); }\n"},{id:"return-missing-value",pattern:/non-void function '.*' should return a value|non-void (function|lambda) should return a value/,title:"Missing return value",why:"The function promises a value but a path returns nothing.",fix:"Return a value of the declared type on every path.",snippet:"int f() { return; }\nint main() { f(); }\n"},{id:"member-ptr",pattern:/member reference type '.*' is a pointer; did you mean to use '->'/,title:"Use -> on pointers",why:"`.` accesses members of an object; through a pointer you need `->`.",fix:"Write `node->next` instead of `node.next` (or `(*node).next`).",snippet:"struct N { int v; N* next; };\nint f(N* n) { return n.v; }\nint main() {}\n"},{id:"member-nonptr",pattern:/member reference type '.*' is not a pointer; did you mean to use '\.'|is not a pointer/,title:"Use . on objects",why:"`->` is for pointers; this is an object or reference.",fix:"Write `node.next` instead of `node->next`.",snippet:"struct N { int v; };\nint f(N n) { return n->v; }\nint main() {}\n"},{id:"not-subscriptable",pattern:/type '.*' does not provide a subscript operator|subscripted value is not an array/,title:"Cannot index this type",why:"`[]` does not exist for this type, e.g. `std::set`, `std::list`, or an `int`.",fix:"Use iterators, `std::next`, or a different container (`vector`, `map`).",snippet:"#include <set>\nint main() { std::set<int> s; return s[0]; }\n"},{id:"private-member",pattern:/is a private member of/,title:"Private member",why:"Members of a `class` are private by default, and code outside cannot touch them.",fix:"Put the member in a `public:` section, or use a public method.",snippet:"class A { int x = 0; };\nint main() { A a; return a.x; }\n"},{id:"abstract-class",pattern:/allocating an object of abstract class type|is an abstract class/,title:"Cannot create an abstract class",why:"The class has a pure virtual function (`= 0`) that nothing overrides.",fix:"Create a derived class that overrides every pure virtual method and instantiate that.",snippet:"struct I { virtual void f() = 0; };\nint main() { I i; }\n"},{id:"no-default-ctor",pattern:/no matching constructor for initialization of|no default constructor exists/,title:"No constructor fits",why:"The type has no constructor matching these arguments (or no default constructor, when you gave none).",fix:"Pass the constructor arguments, or add the constructor.",snippet:"struct A { A(int) {} };\nint main() { A a; }\n"},{id:"break-outside",pattern:/'(break|continue)' statement not in (loop|switch)/,title:"break/continue outside a loop",why:"`break` and `continue` only work inside a loop (`break` also in a `switch`). Usually a brace is misplaced and the loop ended early.",fix:"Check the braces around the loop body.",snippet:s("  break;")},{id:"deduce-auto",pattern:/(cannot deduce type for|declaration of variable '.*' with deduced type 'auto' requires an initializer)/,title:"auto needs an initial value",why:"`auto` copies the type of its initialiser, so it must have one.",fix:"Write the type or give an initial value.",snippet:s("  auto x;")},{id:"jump-bypasses",pattern:/cannot jump from switch statement to this case label|jump bypasses variable initialization/,title:"Declaration inside a case",why:"A `case` jumps past a variable's initialisation. Declare it inside braces.",fix:"Wrap the case body in `{ ... }`.",snippet:s("  int k = 1;\n  switch (k) {\n    case 0:\n      int y = 3;\n      break;\n    case 1:\n      break;\n  }")},{id:"narrowing",pattern:/(type '.*' cannot be narrowed to '.*' in initializer list|non-constant-expression cannot be narrowed)/,title:"Narrowing in braces",why:"Brace-initialisation refuses to silently lose information (e.g. `long long` to `int`).",fix:"Use the matching type or an explicit cast.",snippet:s("  long long big = 5;\n  int x{big};")},{id:"lambda-capture",pattern:/variable '.*' cannot be implicitly captured in a lambda with no capture-default specified/,title:"Lambda needs a capture",why:"A lambda cannot see local variables unless you capture them.",fix:"Use `[&]` (by reference) or `[=]`, or list the variable in `[...]`.",snippet:s("  int k = 2;\n  auto f = [](int x) { return x * k; };\n  f(1);")},{id:"recursive-lambda",pattern:/variable '.*' declared with deduced type 'auto' cannot appear in its own initializer/,title:"auto lambda cannot call itself",why:"The type of an `auto` variable is unknown while its own initialiser is being compiled.",fix:"Declare it as `std::function<int(int)> f = [&](int x) { ... f(x-1) ... };` or use a named helper.",snippet:s("  auto f = [&](int n) -> int { return n ? f(n - 1) : 0; };\n  f(2);")},{id:"ptr-compare-int",pattern:/ordered comparison between pointer and integer|comparison between pointer and integer/,title:"Comparing a pointer with a number",why:"A pointer such as a `ListNode*` cannot be compared with an integer other than `nullptr`/`0`.",fix:"Compare `node->val` with the number, or `node` with `nullptr`.",snippet:"struct N { int v; };\nbool f(N* n) { return n > 5; }\nint main() {}\n"},{id:"ptr-int-conv",pattern:/(incompatible (integer to pointer|pointer to integer) conversion|cannot initialize a variable of type '.*\*' with an (lvalue|rvalue) of type 'int')/,title:"Integer where a pointer is expected",why:'A number cannot become a pointer. Use `nullptr` for "no node".',fix:"Write `nullptr` (or `new Node(x)` for a real node).",snippet:"struct N { int v; };\nint main() { N* p = 5; }\n"},{id:"static-nonstatic",pattern:/(call to non-static member function without an object argument|invalid use of non-static data member|invalid use of member '.*' in static member function)/,title:"Instance member used without an object",why:"A non-static member needs an object (`this`); static functions and free functions have none.",fix:"Make the helper `static`, or call it on an object.",snippet:"struct S { int f(); static int g() { return f(); } };\nint S::f() { return 1; }\nint main() {}\n"},{id:"undefined-ref",pattern:/undefined (reference|symbol)|function '.*' is not defined|use of undeclared identifier 'main'/,title:"Declared but never defined",why:"The linker found a call to a function with no body.",fix:"Provide the definition (and check its signature matches the declaration exactly).",snippet:"int missing();\nint main() { return missing(); }\n"},{id:"conflicting-types",pattern:/(conflicting types for|functions that differ only in their return type cannot be overloaded|out-of-line definition of '.*' does not match any declaration)/,title:"Declaration mismatch",why:"Two declarations of the same function disagree on parameters or return type.",fix:"Make the declaration and definition signatures identical.",snippet:"int f(int a);\nlong f(int a) { return a; }\nint main() {}\n"},{id:"unused-or-err-ternary",pattern:/(incompatible operand types|different types for the operands of '\?:')/,title:"Ternary branches differ",why:"Both branches of `a ? b : c` must have compatible types.",fix:"Convert one branch so both are the same type.",snippet:'#include <string>\nint main() { bool b = true; auto x = b ? 1 : std::string("s"); }\n'}],o=/^(?:.*?):(\d+):(\d+): (?:fatal )?error: (.*)$/gm,l=String.raw`#ifndef LCH_HARNESS_H
#define LCH_HARNESS_H
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <queue>
#include <string>
#include <type_traits>
#include <unordered_map>
#include <vector>

struct ListNode {
  int val;
  ListNode* next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode* next) : val(x), next(next) {}
};

struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
  TreeNode() : val(0), left(nullptr), right(nullptr) {}
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

#ifdef LCH_GRAPH_NODE
class Node {
 public:
  int val;
  std::vector<Node*> neighbors;
  Node() : val(0) {}
  Node(int _val) : val(_val) {}
  Node(int _val, std::vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};
#endif

namespace lch {

[[noreturn]] inline void fail(const char* what) {
  std::fprintf(stderr, "harness: %s\n", what);
  std::abort();
}

// Cursor over one LC literal such as [1,2,null], [["a"],[]], "abc", true, -3, 1.5.
struct Reader {
  const std::string& s;
  size_t p = 0;
  explicit Reader(const std::string& text) : s(text) {}
  void ws() { while (p < s.size() && (s[p] == ' ' || s[p] == '\t' || s[p] == '\r' || s[p] == '\n')) ++p; }
  char peek() { ws(); return p < s.size() ? s[p] : '\0'; }
  void expect(char c) { if (peek() != c) fail("malformed input literal"); ++p; }
  bool take(char c) { if (peek() != c) return false; ++p; return true; }
  bool takeWord(const char* w) {
    ws();
    size_t n = std::strlen(w);
    if (s.compare(p, n, w) != 0) return false;
    p += n;
    return true;
  }
  bool atEnd() { ws(); return p >= s.size(); }
  long long integer() {
    ws();
    const char* b = s.c_str() + p;
    char* e = nullptr;
    long long v = std::strtoll(b, &e, 10);
    if (e == b) fail("expected an integer");
    p += static_cast<size_t>(e - b);
    return v;
  }
  double real() {
    ws();
    const char* b = s.c_str() + p;
    char* e = nullptr;
    double v = std::strtod(b, &e);
    if (e == b) fail("expected a number");
    p += static_cast<size_t>(e - b);
    return v;
  }
  std::string str() {
    expect('"');
    std::string out;
    while (p < s.size() && s[p] != '"') {
      if (s[p] == '\\' && p + 1 < s.size()) {
        ++p;
        out += s[p] == 'n' ? '\n' : s[p] == 't' ? '\t' : s[p];
      } else {
        out += s[p];
      }
      ++p;
    }
    expect('"');
    return out;
  }
};

template <class T> struct IsVector : std::false_type {};
template <class T, class A> struct IsVector<std::vector<T, A>> : std::true_type {};

template <class T> void read(Reader& r, T& out);

inline void readTree(Reader& r, TreeNode*& out) {
  r.expect('[');
  out = nullptr;
  if (r.take(']')) return;
  auto slot = [&r]() -> TreeNode* {
    if (r.takeWord("null")) return nullptr;
    return new TreeNode(static_cast<int>(r.integer()));
  };
  out = slot();
  if (!out) fail("tree literal must not start with null");
  std::vector<TreeNode*> level{out};  // parents in level order; null slots are not stored
  size_t parent = 0;
  bool wantLeft = true;
  while (r.take(',')) {
    if (parent >= level.size()) fail("tree literal has more nodes than parents");
    TreeNode* made = slot();
    (wantLeft ? level[parent]->left : level[parent]->right) = made;
    if (made) level.push_back(made);
    if (!wantLeft) ++parent;
    wantLeft = !wantLeft;
  }
  r.expect(']');
}

inline void readList(Reader& r, ListNode*& out) {
  r.expect('[');
  out = nullptr;
  ListNode* tail = nullptr;
  if (r.take(']')) return;
  do {
    ListNode* n = new ListNode(static_cast<int>(r.integer()));
    if (tail) tail->next = n; else out = n;
    tail = n;
  } while (r.take(','));
  r.expect(']');
}

#ifdef LCH_GRAPH_NODE
// Adjacency list, 1-indexed like LeetCode: [[2,4],[1,3],[2,4],[1,3]]. Reads node 1 (null if empty).
inline void readGraph(Reader& r, Node*& out) {
  std::vector<std::vector<int>> adj;
  read(r, adj);
  out = nullptr;
  if (adj.empty()) return;
  std::vector<Node*> nodes(adj.size() + 1, nullptr);
  for (size_t i = 1; i <= adj.size(); ++i) nodes[i] = new Node(static_cast<int>(i));
  for (size_t i = 0; i < adj.size(); ++i)
    for (int to : adj[i]) {
      if (to < 1 || static_cast<size_t>(to) > adj.size()) fail("graph neighbour out of range");
      nodes[i + 1]->neighbors.push_back(nodes[to]);
    }
  out = nodes[1];
}
#endif

template <class T> void read(Reader& r, T& out) {
  if constexpr (std::is_same_v<T, bool>) {
    if (r.takeWord("true")) out = true;
    else if (r.takeWord("false")) out = false;
    else fail("expected true or false");
  } else if constexpr (std::is_same_v<T, char>) {
    std::string s = r.str();
    if (s.size() != 1) fail("expected a one-character string");
    out = s[0];
  } else if constexpr (std::is_integral_v<T>) {
    out = static_cast<T>(r.integer());
  } else if constexpr (std::is_floating_point_v<T>) {
    out = static_cast<T>(r.real());
  } else if constexpr (std::is_same_v<T, std::string>) {
    out = r.str();
  } else if constexpr (std::is_same_v<T, ListNode*>) {
    readList(r, out);
  } else if constexpr (std::is_same_v<T, TreeNode*>) {
    readTree(r, out);
#ifdef LCH_GRAPH_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    readGraph(r, out);
#endif
  } else if constexpr (IsVector<T>::value) {
    out.clear();
    r.expect('[');
    if (r.take(']')) return;
    do {
      typename T::value_type item{};
      read(r, item);
      out.push_back(std::move(item));
    } while (r.take(','));
    r.expect(']');
  } else {
    static_assert(sizeof(T) == 0, "lch::read: unsupported type");
  }
}

template <class T> void print(std::string& out, const T& v);

inline void printString(std::string& out, const std::string& s) {
  out += '"';
  for (char c : s) {
    if (c == '"') out += "\\\"";
    else if (c == '\\') out += "\\\\";
    else if (c == '\n') out += "\\n";
    else if (c == '\t') out += "\\t";
    else out += c;
  }
  out += '"';
}

inline void printReal(std::string& out, double d) {
  if (std::isnan(d) || std::isinf(d)) fail("cannot print a non-finite number");
  char buf[40];
  std::snprintf(buf, sizeof buf, "%.10g", d);
  out += buf;
}

inline void printTree(std::string& out, const TreeNode* root) {
  std::vector<std::string> items;
  std::queue<const TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    const TreeNode* n = q.front();
    q.pop();
    if (!n) { items.push_back("null"); continue; }
    items.push_back(std::to_string(n->val));
    q.push(n->left);
    q.push(n->right);
  }
  while (!items.empty() && items.back() == "null") items.pop_back();
  out += '[';
  for (size_t i = 0; i < items.size(); ++i) { if (i) out += ','; out += items[i]; }
  out += ']';
}

inline void printList(std::string& out, const ListNode* head) {
  out += '[';
  bool first = true;
  size_t guard = 0;
  for (const ListNode* n = head; n; n = n->next) {
    if (++guard > 10000000) fail("linked list is cyclic or too long to print");
    if (!first) out += ',';
    first = false;
    out += std::to_string(n->val);
  }
  out += ']';
}

#ifdef LCH_GRAPH_NODE
// Adjacency list ordered by node value, so any traversal order of a correct clone prints alike.
inline void printGraph(std::string& out, const Node* start) {
  if (!start) { out += "[]"; return; }
  std::unordered_map<int, const Node*> byVal;
  std::queue<const Node*> q;
  q.push(start);
  byVal[start->val] = start;
  int maxVal = start->val;
  while (!q.empty()) {
    const Node* n = q.front();
    q.pop();
    for (const Node* m : n->neighbors)
      if (byVal.emplace(m->val, m).second) { q.push(m); if (m->val > maxVal) maxVal = m->val; }
  }
  out += '[';
  for (int v = 1; v <= maxVal; ++v) {
    if (v > 1) out += ',';
    out += '[';
    auto it = byVal.find(v);
    if (it != byVal.end()) {
      bool first = true;
      for (const Node* m : it->second->neighbors) { if (!first) out += ','; first = false; out += std::to_string(m->val); }
    }
    out += ']';
  }
  out += ']';
}
#endif

template <class T> void print(std::string& out, const T& v) {
  if constexpr (std::is_same_v<T, bool>) {
    out += v ? "true" : "false";
  } else if constexpr (std::is_same_v<T, char>) {
    printString(out, std::string(1, v));
  } else if constexpr (std::is_integral_v<T>) {
    out += std::to_string(v);
  } else if constexpr (std::is_floating_point_v<T>) {
    printReal(out, static_cast<double>(v));
  } else if constexpr (std::is_same_v<T, std::string>) {
    printString(out, v);
  } else if constexpr (std::is_same_v<T, ListNode*>) {
    printList(out, v);
  } else if constexpr (std::is_same_v<T, TreeNode*>) {
    printTree(out, v);
#ifdef LCH_GRAPH_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    printGraph(out, v);
#endif
  } else if constexpr (IsVector<T>::value) {
    out += '[';
    bool first = true;
    for (const auto& item : v) { if (!first) out += ','; first = false; print(out, item); }
    out += ']';
  } else {
    static_assert(sizeof(T) == 0, "lch::print: unsupported type");
  }
}

}  // namespace lch

#endif  // LCH_HARNESS_H
`,d=/^[A-Za-z_]\w*$/;function c(t){return t.replace(/\bconst\b/g,"").replace(/&/g,"").replace(/\s+/g," ").trim()}let u=`#include <bits/stdc++.h>
using namespace std;
`,p=`
template <class T> static void readArg(T& v) {
  std::string line;
  if (!std::getline(std::cin, line)) lch::fail("missing input line");
  lch::Reader r(line);
  lch::read(r, v);
}
`;function f(t,e){return`${t}lch::print(out, ${e});
`}function m(t){return`${t.length}
${t.map(t=>t.join("\n")).join("\n")}
`}function h(t){let e=new v(t),n=e.value();if(e.ws(),!e.done())throw Error(`unexpected '${e.peek()}' at ${e.pos}`);return n}class v{s;pos;constructor(t){this.s=t,this.pos=0}done(){return this.pos>=this.s.length}peek(){return this.s[this.pos]??""}ws(){for(;/\s/.test(this.peek())&&!this.done();)this.pos++}value(){this.ws();let t=this.peek();if("["===t)return this.array();if('"'===t)return this.string();if(this.s.startsWith("null",this.pos))return this.pos+=4,null;if(this.s.startsWith("true",this.pos))return this.pos+=4,!0;if(this.s.startsWith("false",this.pos))return this.pos+=5,!1;let e=/^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(this.s.slice(this.pos));if(!e)throw Error(this.done()?"unexpected end":`unexpected '${t}' at ${this.pos}`);return this.pos+=e[0].length,Number(e[0])}array(){this.pos++;let t=[];if(this.ws(),"]"===this.peek())return this.pos++,t;for(;;){t.push(this.value()),this.ws();let e=this.peek();if(this.pos++,"]"===e)return t;if(","!==e)throw Error(`expected ',' or ']' at ${this.pos-1}`)}}string(){this.pos++;let t="";for(;!this.done()&&'"'!==this.peek();){if("\\"===this.peek()){this.pos++;let e=this.peek();t+="n"===e?"\n":"t"===e?"	":e}else t+=this.peek();this.pos++}if(this.done())throw Error("unterminated string");return this.pos++,t}}function b(t){try{return function t(e){return null===e?"null":"string"==typeof e?`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\t/g,"\\t")}"`:Array.isArray(e)?`[${e.map(t).join(",")}]`:String(e)}(h(t.trim()))}catch{return t.trim().split(/\s+/).join(" ")}}function g(t,e,n={}){if("TLE"===e.status)return{verdict:"TLE",wallMs:e.wallMs,reason:"Time limit exceeded: try a better complexity."};if("RE"===e.status){var i,r;let t;return{verdict:"RE",wallMs:e.wallMs,reason:(i=e.detail,r=e.stderr,(t=`${i}
${r}`.toLowerCase()).includes("stack overflow")||t.includes("call stack")?"Stack overflow: your recursion is too deep or never stops.":t.includes("out of bounds")||t.includes("memory access")?"Out-of-bounds access: an index or iterator went outside its container.":t.includes("unreachable")||t.includes("abort")||t.includes("assert")?"The program aborted (an assertion failed, or something like .at()/pop on an empty container).":t.includes("divide")||t.includes("division")?"Division by zero.":t.includes("memory")&&t.includes("grow")?"Out of memory.":"Runtime error: the program crashed. Check indices, null pointers and empty containers.")}}return!function(t,e,n){let i,r;if(void 0===n)return b(t)===b(e);try{i=h(t.trim()),r=h(e.trim())}catch{return!1}return function t(e,n,i){return"number"==typeof e&&"number"==typeof n?Math.abs(e-n)<=i*Math.max(1,Math.abs(e)):Array.isArray(e)&&Array.isArray(n)?e.length===n.length&&e.every((e,r)=>t(e,n[r],i)):e===n}(i,r,n)}(t.expected,e.stdout,n.floatTol)?{verdict:"WA",wallMs:e.wallMs,got:e.stdout.trim(),expected:t.expected.trim(),reason:"Wrong answer."}:{verdict:"AC",wallMs:e.wallMs}}function y(t){return t.input.split("\n")}async function w(t,e,n,i,r){let s,h,v=function(t,e){var n,i,r,s;let a,o,m,h,v;for(let e of["function"===t.kind?t.name:t.className,...("function"===(s=t).kind?s.params:[...s.ctor,...s.methods.flatMap(t=>t.params)]).map(t=>t.name)])if(!d.test(e))throw Error(`bad identifier '${e}'`);for(let e of"function"===t.kind?[t]:t.methods){if(!d.test(e.name))throw Error(`bad identifier '${e.name}'`);if("void"===e.returns.trim()&&!e.outParam&&"function"===t.kind)throw Error(`void ${e.name} needs outParam`);if(e.outParam&&!e.params.some(t=>t.name===e.outParam))throw Error(`outParam '${e.outParam}' is not a parameter of ${e.name}`)}let b=t.graphNode?"#define LCH_GRAPH_NODE 1\n":"",g="function"===t.kind?(a=`sol.${t.name}(${t.params.map(t=>t.name).join(", ")})`,o="void"===t.returns.trim()?`    ${a};
${f("    ",t.outParam)}`:`    auto result = ${a};
${f("    ","result")}`,`${p}
int main() {
  std::ios::sync_with_stdio(false);
  std::string header;
  if (!std::getline(std::cin, header)) lch::fail("missing test count");
  const int tests = std::atoi(header.c_str());
  for (int t = 0; t < tests; ++t) {
${n=t.params,i="    ",r=t=>`readArg(${t.name});`,n.map(t=>`${i}${c(t.type)} ${t.name}{};
${i}${r(t)}
`).join("")}    ${t.className??"Solution"} sol;
    std::string out;
${o}    std::puts(out.c_str());
  }
  return 0;
}
`):(m=t=>t.map((t,e)=>`${e?"        args.expect(',');\n":""}        ${c(t.type)} ${t.name}{};
        lch::read(args, ${t.name});
`).join(""),h=t.ctor.map(t=>t.name).join(", "),v=t.methods.map(t=>{let e=`obj->${t.name}(${t.params.map(t=>t.name).join(", ")})`,n="void"===t.returns.trim()?`        ${e};
        out += "null";
`:`        auto result = ${e};
${f("        ","result")}`;return`      } else if (ops[i] == "${t.name}") {
        if (!obj) lch::fail("method called before construction");
${m(t.params)}${n}`}),`${p}
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
    std::unique_ptr<${t.className}> obj;
    std::string out = "[";
    for (size_t i = 0; i < ops.size(); ++i) {
      if (i) { args.expect(','); out += ','; }
      args.expect('[');
      if (ops[i] == "${t.className}") {
${m(t.ctor)}        obj = std::make_unique<${t.className}>(${h});
        out += "null";
${v.join("")}      } else {
        lch::fail("unknown operation");
      }
      args.expect(']');
    }
    out += ']';
    std::puts(out.c_str());
  }
  return 0;
}
`);return`${b}${u}${l}
#line 1 "solution.cpp"
${e}
#line 1 "driver.cpp"
${g}`}(t,e),b=await r.compile(v);if(!b.ok||!b.wasm)return{verdict:"CE",failedAt:null,outcomes:[],maxMs:0,diagnostics:b.diagnostics,firstError:function(t,e=0){return function(t,e=0){let n=[];for(let i of t.matchAll(o)){let t=i[3].trim();n.push({line:Number(i[1])-e,column:Number(i[2]),message:t,entry:a.find(e=>e.pattern.test(t))??null})}return n}(t,e)[0]??null}(b.diagnostics),compileMs:b.timings.compileMs};let w=b.wasm,x=i.batchCapMs??2e4,k=await r.run(w,m(n.map(y)),Math.min(x,i.timeLimitMs*n.length)),_=[];if("ok"===k.status){let t=k.stdout.split("\n"),e=Math.round(k.wallMs/Math.max(1,n.length));if(n.forEach((n,r)=>_.push(g(n,{...k,stdout:t[r]??"",wallMs:e},i))),t.filter(t=>""!==t).length<n.length){let i=_.findIndex((e,i)=>"AC"===e.verdict&&(t[i]??"")===""&&""!==n[i].expected.trim());i>=0&&(_[i]={verdict:"RE",wallMs:e,reason:"The program produced no output for this test."})}}else for(let t of n){let e=await r.run(w,m([y(t)]),i.timeLimitMs),n=g(t,e,i);if(_.push(n),"AC"!==n.verdict)break}return{...(s=_.reduce((t,e)=>Math.max(t,e.wallMs),0),(h=_.findIndex(t=>"AC"!==t.verdict))<0?{verdict:"AC",failedAt:null,maxMs:s}:{verdict:_[h].verdict,failedAt:h,maxMs:s}),outcomes:_,compileMs:b.timings.compileMs}}t.s(["f",0,w],64517)},96770,18853,t=>{let e="main";function n(t){return new Promise((e,n)=>{t.onsuccess=()=>e(t.result),t.onerror=()=>n(t.error)})}function i(t){return new Promise((e,n)=>{t.oncomplete=()=>e(),t.onerror=()=>n(t.error),t.onabort=()=>n(t.error??Error("IndexedDB transaction aborted"))})}t.s(["f",0,class{dbPromise=null;db(){return this.dbPromise??=new Promise((t,e)=>{let n=indexedDB.open("algo-clash",1);n.onupgradeneeded=()=>{let t=n.result;t.objectStoreNames.contains("core")||t.createObjectStore("core"),t.objectStoreNames.contains("attempts")||t.createObjectStore("attempts",{autoIncrement:!0}).createIndex("problemId","problemId"),t.objectStoreNames.contains("drafts")||t.createObjectStore("drafts",{keyPath:"problemId"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)}),this.dbPromise}async store(t,e){let n=(await this.db()).transaction(t,e);return{store:n.objectStore(t),tx:n}}async getCore(){let{store:t}=await this.store("core","readonly");return n(t.get(e))}async putCore(t){let{store:n,tx:r}=await this.store("core","readwrite");n.put(t,e),await i(r)}async addAttempt(t){let{store:e,tx:n}=await this.store("attempts","readwrite");e.add(t),await i(n)}async listAttempts(){let{store:t}=await this.store("attempts","readonly");return n(t.getAll())}async getDraft(t){let{store:e}=await this.store("drafts","readonly");return n(e.get(t))}async putDraft(t){let{store:e,tx:n}=await this.store("drafts","readwrite");e.put(t),await i(n)}async deleteDraft(t){let{store:e,tx:n}=await this.store("drafts","readwrite");e.delete(t),await i(n)}async listDrafts(){let{store:t}=await this.store("drafts","readonly");return n(t.getAll())}async clear(){let t=(await this.db()).transaction(["core","attempts","drafts"],"readwrite");for(let e of["core","attempts","drafts"])t.objectStore(e).clear();await i(t)}}],96770);let r={textSpeed:"normal",audio:!0,reduceMotion:!1,editor:{theme:"night",fontSize:16,autocomplete:!0}};function s(t,e="Trainer"){return{version:1,profile:{name:e,createdAt:t,level:1,xp:0,bits:0,streakDays:0,lastPlayedDay:""},party:[],mastery:{},settings:{...r,editor:{...r.editor}},flags:{}}}let a=(t,e,n=-1/0,i=1/0)=>"number"==typeof t&&Number.isFinite(t)?Math.min(i,Math.max(n,t)):e,o=(t,e,n=200)=>"string"==typeof t?t.slice(0,n):e,l=t=>t&&"object"==typeof t&&!Array.isArray(t)?t:{},d=["unseen","learning","solved","mastered","rusty"],c=["AC","WA","TLE","RE","CE"],u=["learn","practice","interview"];function p(t){let e=l(t);if("string"!=typeof e.problemId||!e.problemId||!c.includes(e.verdict))return null;let n={problemId:e.problemId.slice(0,80),at:a(e.at,0,0),verdict:e.verdict,seconds:a(e.seconds,0,0),hintsUsed:Math.round(a(e.hintsUsed,0,0,3)),mode:u.includes(e.mode)?e.mode:"practice"};return"string"==typeof e.cause&&(n.cause=e.cause.slice(0,60)),n}function f(t){let e=l(t);return"string"==typeof e.problemId&&e.problemId&&"string"==typeof e.code?{problemId:e.problemId.slice(0,80),code:e.code.slice(0,2e5),updatedAt:a(e.updatedAt,0,0)}:null}let m={0:t=>{let e=t.player&&"object"==typeof t.player?t.player:{},n={};if(Array.isArray(t.solved))for(let e of t.solved)"string"==typeof e&&(n[e]={state:"solved",solves:1});return{version:1,profile:{name:e.name,level:e.level,xp:e.xp,bits:t.coins},party:t.party,mastery:n,settings:t.settings,flags:t.flags}}};class h extends Error{}function v(t,e){if(!t||"object"!=typeof t)throw Error("Save data is not an object");let n=t,i="number"==typeof n.version&&Number.isInteger(n.version)?n.version:0;if(i>1)throw new h(`Save is from a newer game version (${i} > 1)`);for(i<0&&(i=0);i<1;i++){let t=m[i];if(!t)throw new h(`No migration from save version ${i}`);n=t(n)}return function(t,e){let n=l(t),i=s(e),r=l(n.profile),c=l(n.settings),u=l(c.editor),p={};for(let[t,e]of Object.entries(l(n.mastery)))p[t]=function(t){let e=l(t);return{state:d.includes(e.state)?e.state:"unseen",solves:Math.round(a(e.solves,0,0)),due:a(e.due,0,0),intervalDays:a(e.intervalDays,0,0),ease:a(e.ease,2.5,1.3,3.5),lastSolvedAt:a(e.lastSolvedAt,0,0)}}(e);let f={};for(let[t,e]of Object.entries(l(n.flags)))("boolean"==typeof e||"string"==typeof e||"number"==typeof e&&Number.isFinite(e))&&(f[t]=e);return{version:1,profile:{name:o(r.name,i.profile.name,24)||i.profile.name,createdAt:a(r.createdAt,e,0),level:Math.round(a(r.level,1,1,60)),xp:Math.round(a(r.xp,0,0)),bits:Math.round(a(r.bits,0,0)),streakDays:Math.round(a(r.streakDays,0,0)),lastPlayedDay:o(r.lastPlayedDay,"",10)},party:Array.isArray(n.party)?n.party.filter(t=>"string"==typeof t).slice(0,6):[],mastery:p,settings:{textSpeed:"slow"===c.textSpeed||"fast"===c.textSpeed?c.textSpeed:"normal",audio:"boolean"!=typeof c.audio||c.audio,reduceMotion:"boolean"==typeof c.reduceMotion&&c.reduceMotion,editor:{theme:"paper"===u.theme?"paper":"night",fontSize:Math.round(a(u.fontSize,16,12,24)),autocomplete:"boolean"!=typeof u.autocomplete||u.autocomplete}},flags:f}}(n,e)}let b="algo-clash-save";t.s(["f",0,class{backend;now;constructor(t,e=Date.now){this.backend=t,this.now=e}async load(){let t=await this.backend.getCore();if(void 0===t)return s(this.now());try{let e=v(t,this.now());return 1!==t.version&&await this.backend.putCore(e),e}catch(t){if(t instanceof h)throw t;return s(this.now())}}save(t){return this.backend.putCore(t)}async recordAttempt(t){let e=p(t);if(!e)throw Error("Invalid attempt");await this.backend.addAttempt(e)}async attempts(t){let e=(await this.backend.listAttempts()).map(p).filter(t=>null!==t);return t?e.filter(e=>e.problemId===t):e}saveDraft(t,e){return this.backend.putDraft({problemId:t,code:e,updatedAt:this.now()})}async loadDraft(t){return f(await this.backend.getDraft(t))}clearDraft(t){return this.backend.deleteDraft(t)}async exportJson(){return JSON.stringify({format:b,version:1,exportedAt:this.now(),core:await this.load(),attempts:await this.attempts(),drafts:(await this.backend.listDrafts()).map(f).filter(t=>null!==t)},null,2)}async importJson(t){let e;try{e=JSON.parse(t)}catch{throw Error("That file is not valid JSON")}let n=e&&"object"==typeof e?e:{};if(n.format!==b)throw Error("That file is not an Algo Clash save");let i=v({...n.core,version:n.version},this.now()),r=(Array.isArray(n.attempts)?n.attempts:[]).map(p).filter(t=>null!==t),s=(Array.isArray(n.drafts)?n.drafts:[]).map(f).filter(t=>null!==t);for(let t of(await this.backend.clear(),await this.backend.putCore(i),r))await this.backend.addAttempt(t);for(let t of s)await this.backend.putDraft(t);return i}reset(){return this.backend.clear()}}],18853)}])})();