import type { Lesson } from "@/lib/lessons/types";

/** R0 Syntax Shores S4 "Structs and classes for LeetCode" (CURRICULUM §2). Original wording. */
export const s4Lessons: Lesson[] = [
  {
    id: "s4-structs", region: "R0", section: "S4",
    title: "Structs, constructors and ordering",
    summary: "A struct bundles fields; a constructor with an initialiser list sets them up; operator< teaches sort how to order your type.",
    cardIds: ["s4-struct-class-access", "s4-init-order", "s4-this-shadow", "s4-no-default-ctor", "s4-operator-less"],
    problemIds: ["rank-roster", "step-counter"],
    pages: [
      {
        title: "Fields and constructors",
        blocks: [
          { kind: "text", text: "A `struct` groups related fields into one type. It is the same as a `class` except for the default access: members of a `struct` are public unless you say otherwise, members of a `class` are private. Interview code uses `struct` for plain data (nodes, points, records) and `class` when there is an invariant to protect." },
          { kind: "text", text: "A constructor runs when an object is created. The member initialiser list (`: a(x), b(y)`) builds each member directly, which is the right place to set them: the body of the constructor runs after every member already exists. Members are initialised in the order they are *declared* in the struct, not the order you write them in the list." },
          { kind: "code", run: true, caption: "Initialiser list, then the body.", code: `#include <iostream>

struct Meter {
    int n;
    explicit Meter(int n) : n(n) {   // member n(parameter n)
        n += 5;                      // changes only the parameter
    }
};

int main() {
    Meter m(1);
    std::cout << m.n << '\\n';
}
` },
          { kind: "pitfall", title: "The shadowed member", text: "When a parameter has the same name as a member, the bare name means the parameter. `n = n;` in the body assigns the parameter to itself and leaves the member uninitialised. Use the initialiser list, or write `this->n = n;`." },
          { kind: "idiom", title: "Initialise in the list", text: "`Point(int x, int y) : x(x), y(y) {}` is the standard shape. Declare members in the order you want them initialised and keep the list in that same order, so no one has to guess." },
          { kind: "interview", text: "Writing a constructor with an initialiser list on the first try signals that you have written real C++ and not only C. Say why you mark single-argument constructors `explicit`: it stops silent conversions like `Meter m = 5;`." },
        ],
      },
      {
        title: "Ordering your own type",
        blocks: [
          { kind: "text", text: "`std::sort` orders elements with `operator<`. For your own struct you teach it by defining `bool operator<(const T& other) const`: return true when `*this` must come before `other`. The trailing `const` matters, because the sort compares through const references." },
          { kind: "code", run: true, caption: "Sort records by weight, then print their names.", code: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Item {
    int w;
    std::string name;
    bool operator<(const Item& o) const { return w < o.w; }
};

int main() {
    std::vector<Item> v{{3, "c"}, {1, "a"}, {2, "b"}};
    std::sort(v.begin(), v.end());
    for (const auto& it : v) std::cout << it.name;
    std::cout << '\\n';
}
` },
          { kind: "text", text: "A struct without a user constructor can be built with braces, as above (`{3, \"c\"}`). The moment you write any constructor, the compiler stops generating the default one: `P p;` no longer compiles unless you also provide a no-argument constructor or default arguments." },
          { kind: "pitfall", title: "Ties and strictness", text: "`operator<` must be a strict ordering: `a < a` is false. Writing `<=` can crash `std::sort` on equal elements. For a tie-break, compare the next field only when the first is equal, for example with `std::tie(a, b) < std::tie(o.a, o.b)`." },
          { kind: "idiom", title: "A comparator when you cannot edit the type", text: "`sort(v.begin(), v.end(), [](const Item& a, const Item& b) { return a.w > b.w; });` orders descending without touching the struct." },
          { kind: "interview", text: "Name the ordering out loud: \"smaller weight first, ties by name\". A vague comparator is where most sort bugs and most follow-up questions come from." },
        ],
      },
    ],
  },
  {
    id: "s4-lists", region: "R0", section: "S4",
    title: "Linked lists as LeetCode gives them",
    summary: "ListNode, nullptr, walking with a pointer, the dummy head, and why interview code uses new and does not free.",
    cardIds: ["s4-nullptr", "s4-list-walk", "s4-dummy-head", "s4-new-pointer", "s4-append-parsons"],
    problemIds: ["drop-negatives", "middle-link", "forge-chain"],
    pages: [
      {
        title: "ListNode and pointers",
        blocks: [
          { kind: "text", text: "LeetCode hands you a singly linked list as a pointer to the first `ListNode`. Each node holds a value and a pointer to the next node; the last node's `next` is `nullptr`, and an empty list is a null head. Use `nullptr`, not `0` or `NULL`: it has its own pointer type, so overload resolution and templates cannot mistake it for an integer." },
          { kind: "code", run: true, caption: "Nodes on the stack, linked by address, walked with a pointer.", code: `#include <iostream>

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
    std::cout << acc << '\\n';
}
` },
          { kind: "text", text: "A pointer uses `->` to reach a member (`p->val`); an object or reference uses `.`. `p->val` is shorthand for `(*p).val`. Dereferencing a null pointer is undefined behaviour and usually a crash, so every walk checks for `nullptr` first." },
          { kind: "pitfall", title: "Dot versus arrow", text: "`p.val` on a pointer does not compile: the compiler tells you the member was requested on a pointer type. Use `p->val`. The mirror mistake, `obj->val` on an object, is rejected too." },
          { kind: "interview", text: "Before you write any list loop, state the empty and single-node cases out loud. \"head is null\" and \"head->next is null\" are the two inputs that break most first attempts." },
        ],
      },
      {
        title: "Building, the dummy head, and new",
        blocks: [
          { kind: "text", text: "Nodes you return from a function must outlive it, so you create them on the heap with `new ListNode(x)`, which returns a `ListNode*`. Interview solutions conventionally do not `delete` them: the judge ends the process right after, and freeing correctly is rarely the point of the question. Mention it once if asked, and prefer `unique_ptr` in real code." },
          { kind: "code", run: true, caption: "Append to the tail with a tail pointer: O(1) per node.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode* head = nullptr;
    ListNode* tail = nullptr;
    for (int x = 1; x <= 3; ++x) {
        ListNode* node = new ListNode(x);
        if (tail == nullptr) head = tail = node;
        else { tail->next = node; tail = node; }
    }
    for (ListNode* p = head; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "The `if (tail == nullptr)` special case exists only because the list can start empty. A dummy head removes it: create a throwaway node `ListNode dummy(0); ListNode* tail = &dummy;`, always append with `tail->next = ...`, and return `dummy.next`. The same trick makes deleting the head node just another delete." },
          { kind: "code", run: true, caption: "Same list, no special case.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int x = 1; x <= 3; ++x) {
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    for (ListNode* p = dummy.next; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "idiom", title: "Dummy head by default", text: "Whenever the answer list might lose or gain its first node, start with a dummy head and return `dummy.next`." },
        ],
      },
    ],
  },
  {
    id: "s4-trees-solution", region: "R0", section: "S4",
    title: "TreeNode and class Solution",
    summary: "TreeNode with two child pointers, the null base case, and the class Solution wrapper with its public section.",
    cardIds: ["s4-tree-height", "s4-arrow-dot", "s4-tree-null-base", "s4-leaf-cloze", "s4-solution-private"],
    problemIds: ["tree-height", "leaf-sum"],
    pages: [
      {
        title: "TreeNode and the null base case",
        blocks: [
          { kind: "text", text: "A binary tree node is a value plus two child pointers; a missing child is `nullptr`, and an empty tree is a null root. Almost every tree function is recursive with the same skeleton: handle the null pointer first, then combine the answers of the left and right subtrees." },
          { kind: "code", run: true, caption: "Height of a three-node tree: null is height 0.", code: `#include <algorithm>
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
    TreeNode root(1), l(2), r(3);
    root.left = &l;
    root.right = &r;
    std::cout << height(&root) << '\\n';
}
` },
          { kind: "pitfall", title: "Forgetting the null check", text: "Without `if (root == nullptr) return ...;` the recursion walks off a leaf into `root->left` on a null pointer: undefined behaviour, in practice a crash. Write the null case first, every time." },
          { kind: "idiom", title: "Leaf test", text: "A leaf has no children: `!root->left && !root->right`. Test it after the null check, and take care to say what an empty tree returns." },
          { kind: "interview", text: "State the recursion's contract in one sentence before coding: \"height(node) returns the number of nodes on the longest downward path, 0 for null\". Then the code writes itself, and the complexity is O(n) time and O(h) stack." },
        ],
      },
      {
        title: "class Solution",
        blocks: [
          { kind: "text", text: "LeetCode wraps your code in `class Solution { public: ... };` and calls a method on it. Remember the `public:` label, because members of a `class` are private by default, and the judge cannot call a private method. Helper functions can sit below it, either as extra methods or as private members." },
          { kind: "code", run: true, caption: "A helper method inside Solution, called with a small tree.", code: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int countLeaves(TreeNode* root) {
        if (root == nullptr) return 0;
        if (!root->left && !root->right) return 1;
        return countLeaves(root->left) + countLeaves(root->right);
    }
};

int main() {
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b; a.right = &c; b.left = &d;
    Solution s;
    std::cout << s.countLeaves(&a) << '\\n';
}
` },
          { kind: "text", text: "The method does not use any member data here, so it could be `static`, but leaving it as a normal method matches the signature the judge expects. Keep per-call state in parameters or local variables: the same `Solution` object may be reused across tests, so a leftover member field from the last test would leak into the next." },
          { kind: "pitfall", title: "State that survives", text: "A member like `int best;` that you update during one call is still holding its old value on the next call. Reset it at the start of the method, or pass state down as an argument." },
          { kind: "interview", text: "Mention the signature you were given and keep it unchanged. Adding a helper is fine; changing the public method breaks the harness." },
        ],
      },
    ],
  },
];
