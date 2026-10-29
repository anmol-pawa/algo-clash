/**
 * The C++ side of the LeetCode-style harness (ARCH §2.3): node types, LC-literal readers and
 * printers. The source of truth is this string so the browser compile worker and the native
 * g++ tests use identical code. It compiles with `-fno-exceptions` (ADR 0001): malformed input
 * aborts instead of throwing. Defined before the player's code, like LeetCode does.
 *
 * Optional node types are switched on by macros the generated driver defines first:
 *   LCH_GRAPH_NODE  `Node` with `val` + `neighbors` (clone-graph style)
 */
export const LC_HARNESS_H = String.raw`#ifndef LCH_HARNESS_H
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
`;
