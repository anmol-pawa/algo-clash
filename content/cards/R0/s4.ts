import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores S4 "Structs and classes for LeetCode" cards (B7d). Outputs and diagnostics are computed by g++ (see lib/content/cardsNative.ts). */
export const s4Cards: Card[] = [
  {
    id: "s4-struct-class-access", kind: "mcq", region: "R0", tags: ["struct", "class", "access"],
    prompt: "What is the only language-level difference between 'struct' and 'class' in C++?",
    choices: [
      "The default access: struct members are public, class members are private (and the default inheritance follows the same rule)",
      "A struct cannot have member functions or constructors",
      "A class is stored on the heap and a struct on the stack",
      "A struct cannot be passed by reference",
    ],
    answer: 0,
    explanation: "Both can have fields, constructors, methods and inheritance, and both can live on the stack or the heap. Only the default access differs: `struct` starts public, `class` starts private. By convention, `struct` marks plain data and `class` marks a type with invariants.",
  },
  {
    id: "s4-init-order", kind: "predict", region: "R0", tags: ["constructor", "initialiser-list", "order"],
    prompt: "What does this program print?",
    code: `#include <iostream>
struct Loud {
    explicit Loud(int x) { std::cout << x; }
};
struct Pair {
    Loud first;
    Loud second;
    Pair() : second(2), first(1) {}
};
int main() {
    Pair p;
    std::cout << "\\n";
}
`,
    explanation: "Members are constructed in the order they are declared in the struct (`first`, then `second`), not in the order written in the initialiser list, so it prints 12 even though the list says `second(2)` first. Compilers warn about the mismatch (-Wreorder); keep the list in declaration order so nobody has to remember the rule, and never make one member's initialiser depend on a later member.",
  },
  {
    id: "s4-this-shadow", kind: "predict", region: "R0", tags: ["constructor", "this", "shadowing"],
    prompt: "What does this program print?",
    code: `#include <iostream>
struct Meter {
    int n;
    explicit Meter(int n) : n(n) { n += 5; }
};
int main() {
    Meter m(1);
    std::cout << m.n << "\\n";
}
`,
    explanation: "In `n(n)` the outer `n` is the member and the inner `n` is the parameter, so the member becomes 1. In the body, the bare `n` is the parameter, so `n += 5` changes a local copy and the member stays 1. To change the member there you would write `this->n += 5;`.",
  },
  {
    id: "s4-no-default-ctor", kind: "compilerError", region: "R0", tags: ["constructor", "default-constructor", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `struct P {
    int x;
    P(int x) : x(x) {}
};
int main() {
    P p;
}
`,
    choices: [
      "Once a struct declares any constructor, the compiler no longer generates a default one, and `P p;` needs a no-argument constructor",
      "A struct cannot have a constructor with a parameter named like a member",
      "`P p;` must be written `P p = P;`",
      "Constructors must be declared after `main`",
    ],
    answer: 0,
    explanation: "A user-declared constructor suppresses the implicit default constructor. Either construct with an argument (`P p(3);`), add `P() : x(0) {}`, or give the parameter a default (`P(int x = 0)`). The same rule explains why a `ListNode` with a constructor needs `ListNode(0)`, not `ListNode n;`.",
  },
  {
    id: "s4-operator-less", kind: "cloze", region: "R0", tags: ["operator<", "sort", "struct", "cloze"],
    prompt: "Fill the blank so 'sort' puts the lightest item first.",
    template: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
struct Item {
    int w;
    std::string name;
    bool operator<(const Item& o) const { return ___; }
};
int main() {
    std::vector<Item> v{{3, "c"}, {1, "a"}, {2, "b"}};
    std::sort(v.begin(), v.end());
    for (const auto& it : v) std::cout << it.name;
    std::cout << "\\n";
}
`,
    blanks: [["w < o.w", "this->w < o.w", "w<o.w"]],
    explanation: "`operator<` answers \"must `*this` come before `o`?\". Comparing the weights with `<` gives ascending order, so the program prints abc. Use `<`, never `<=`: the ordering must be strict, or `sort` can misbehave on equal elements. The `const` after the parameter list lets it be called on const objects.",
  },
  {
    id: "s4-nullptr", kind: "mcq", region: "R0", tags: ["nullptr", "pointers"],
    prompt: "Why do modern C++ solutions write 'nullptr' instead of '0' or 'NULL' for an empty pointer?",
    choices: [
      "`nullptr` has its own pointer type, so it can never be mistaken for the integer 0 in overloads or templates",
      "`nullptr` is faster at run time than `0`",
      "`0` cannot be assigned to a pointer in C++",
      "`nullptr` frees the memory the pointer was holding",
    ],
    answer: 0,
    explanation: "`0` and `NULL` are integers that happen to convert to pointers, so a call like `f(NULL)` can pick the `int` overload. `nullptr` has type `std::nullptr_t`, which converts only to pointer types. It costs nothing at run time and it does not free anything.",
  },
  {
    id: "s4-list-walk", kind: "trace", region: "R0", tags: ["linked-list", "pointer", "traversal"],
    prompt: "What does this program print?",
    code: `#include <iostream>
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
int main() {
    ListNode a(1), b(2), c(3);
    a.next = &b;
    b.next = &c;
    int acc = 0;
    for (ListNode* p = &a; p != nullptr; p = p->next)
        acc = acc * 10 + p->val;
    std::cout << acc << "\\n";
}
`,
    explanation: "The loop visits the nodes in link order 1, 2, 3 and stops when `p` becomes null at the end of the list. Each step shifts `acc` one decimal place and adds the node value, so it prints 123. Note that the loop never dereferences a null pointer, because the check happens before `p->val`.",
  },
  {
    id: "s4-dummy-head", kind: "mcq", region: "R0", tags: ["linked-list", "dummy-head"],
    prompt: "You build a result list node by node. What does a dummy head node buy you?",
    choices: [
      "The first real node is appended like any other, so there is no special case for an empty result; you return `dummy.next`",
      "It makes the list doubly linked",
      "It stops the nodes from needing `new`",
      "It makes traversal O(1) instead of O(n)",
    ],
    answer: 0,
    explanation: "With a dummy, `tail` always points at a real node object, so `tail->next = ...` works even for the first element. It does not change complexity or ownership; it only removes the \"is the list empty yet?\" branch, which is the usual source of head bugs when you also delete the first node.",
  },
  {
    id: "s4-new-pointer", kind: "compilerError", region: "R0", tags: ["new", "pointers", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int x) : val(x), next(nullptr) {}
};
int main() {
    ListNode node = new ListNode(1);
}
`,
    choices: [
      "`new` returns a `ListNode*`, which cannot initialise a `ListNode` object; declare `ListNode* node`",
      "`new` cannot be used with a struct that has a constructor",
      "A `ListNode` must be declared with `auto&`",
      "`next` must be initialised to `0`, not `nullptr`",
    ],
    answer: 0,
    explanation: "`new T(args)` allocates on the heap and returns a pointer. Store it in a `T*`: `ListNode* node = new ListNode(1);`. To make a stack object you would write `ListNode node(1);` with no `new`. In interview code you normally leave heap nodes undeleted.",
  },
  {
    id: "s4-append-parsons", kind: "parsons", region: "R0", tags: ["linked-list", "tail", "parsons"],
    prompt: "Put the lines in order so the program builds the list 1, 2, 3 with a dummy head and prints it.",
    lines: [
      "#include <iostream>",
      "struct ListNode { int val; ListNode* next; ListNode(int x) : val(x), next(nullptr) {} };",
      "int main() {",
      "    ListNode dummy(0);",
      "    ListNode* tail = &dummy;",
      "    for (int x = 1; x <= 3; ++x) {",
      "        tail->next = new ListNode(x);",
      "        tail = tail->next;",
      "    }",
      "    for (ListNode* p = dummy.next; p; p = p->next) std::cout << p->val << \" \";",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "The dummy and the tail pointer come first. Each loop pass hangs a new node off `tail->next` and then moves `tail` onto it, so appending is O(1). The final loop starts at `dummy.next`, the real head, and prints 1 2 3.",
  },
  {
    id: "s4-tree-height", kind: "predict", region: "R0", tags: ["tree", "recursion", "height"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
#include <iostream>
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int height(const TreeNode* root) {
    if (root == nullptr) return 0;
    return 1 + std::max(height(root->left), height(root->right));
}
int main() {
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b;
    b.left = &c;
    b.right = &d;
    std::cout << height(&a) << ' ' << height(&b) << ' ' << height(nullptr) << "\\n";
}
`,
    explanation: "A null tree has height 0. Node `c` and `d` are leaves of height 1, so `b` has height 2 and the root `a`, whose only child is `b`, has height 3. The three calls therefore print 3 2 0.",
  },
  {
    id: "s4-arrow-dot", kind: "compilerError", region: "R0", tags: ["pointers", "arrow", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int main() {
    TreeNode* p = new TreeNode(4);
    int v = p.val;
}
`,
    choices: [
      "`p` is a pointer, so its member is reached with `p->val` (or `(*p).val`), not `p.val`",
      "`val` is private and cannot be read from `main`",
      "A `TreeNode*` cannot be initialised with `new`",
      "`int v` must be declared before `p`",
    ],
    answer: 0,
    explanation: "`.` works on an object or a reference, `->` on a pointer. The compiler says that a member was requested on a pointer type. In recursive tree code this decides most of the typos: `root->left`, but `node.left` when `node` is an object.",
  },
  {
    id: "s4-tree-null-base", kind: "mcq", region: "R0", tags: ["tree", "recursion", "null", "undefined-behaviour"],
    prompt: "A recursive 'height(TreeNode* root)' omits the line 'if (root == nullptr) return 0;'. What happens on any non-empty tree?",
    choices: [
      "The recursion reaches a leaf and then evaluates `root->left` on a null pointer: undefined behaviour, in practice a crash",
      "It returns 0 for every tree",
      "It loops forever on a finite tree without crashing",
      "The compiler inserts the check automatically",
    ],
    answer: 0,
    explanation: "A leaf's children are null. Without the base case, the call on that null child reads `->left` from address 0, which is undefined behaviour and normally a segmentation fault. The compiler does not add null checks for you. Write the null case first, and decide what it returns (0 for height, 0 for a sum, an empty result for a collection).",
  },
  {
    id: "s4-leaf-cloze", kind: "cloze", region: "R0", tags: ["tree", "leaf", "cloze"],
    prompt: "Fill the blank so the function counts leaves (nodes with no children).",
    template: `#include <iostream>
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int leaves(const TreeNode* root) {
    if (root == nullptr) return 0;
    if (___) return 1;
    return leaves(root->left) + leaves(root->right);
}
int main() {
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b;
    a.right = &c;
    b.left = &d;
    std::cout << leaves(&a) << "\\n";
}
`,
    blanks: [["!root->left && !root->right", "root->left == nullptr && root->right == nullptr", "!root->left&&!root->right"]],
    explanation: "A leaf is a non-null node whose left and right children are both null. A null child is falsy, so `!root->left && !root->right` says exactly that. The tree has leaves c (3) and d (4), while b has a child and a is internal, so it prints 2.",
  },
  {
    id: "s4-solution-private", kind: "compilerError", region: "R0", tags: ["class", "access", "solution", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `class Solution {
    int twice(int x) { return 2 * x; }
};
int main() {
    Solution s;
    return s.twice(3);
}
`,
    choices: [
      "Members of a `class` are private by default; add `public:` before the method",
      "A method cannot be called on a local object",
      "`twice` must be declared `static`",
      "`class` types cannot be returned from `main`",
    ],
    answer: 0,
    explanation: "Everything in a `class` is private until a `public:` label. The judge calls your method from outside the class, so it must be public: `class Solution { public: int twice(int x) {...} };`. A `struct` would have worked, but LeetCode's template uses `class Solution { public: ... };`, so keep the label.",
  },
];
