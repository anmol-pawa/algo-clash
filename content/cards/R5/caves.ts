import type { Card } from "@/lib/cards/types";

/** R5 Chainlink Caves cards. Predict, trace, parsons, cloze and compiler-error results are computed by g++ (content/cards/generated.json). */
export const r5Cards: Card[] = [
  // ---- Pointer rewiring and the dummy node
  {
    id: "r5-ptr-signal", kind: "mcq", region: "R5", tags: ["linked-list", "recognition"],
    prompt: "Which job is a natural fit for a linked list rather than an array?",
    choices: ["Splice a block of nodes out of the middle and reinsert it elsewhere when you already hold pointers to the ends", "Read the 500th element many times", "Binary search for a value", "Sort by comparing elements at random indexes"],
    answer: 0,
    explanation: "A list has no index, so random access and binary search cost O(n). Its strength is O(1) splicing once you hold the neighbouring nodes: only pointers change and nothing shifts.",
  },
  {
    id: "r5-ptr-save-next", kind: "mcq", region: "R5", tags: ["linked-list", "reverse"],
    prompt: "In iterative reversal, why must `cur->next` be saved before it is overwritten with `prev`?",
    choices: ["Otherwise the rest of the list becomes unreachable", "Because next is a const pointer", "To keep the list sorted", "So the old head can be deleted"],
    answer: 0,
    explanation: "`cur->next` is the only link to the untouched suffix. Overwrite it first and nothing points at the remaining nodes any more: the loop ends after one node and the rest leaks.",
  },
  {
    id: "r5-ptr-predict", kind: "predict", region: "R5", tags: ["linked-list", "traversal"],
    prompt: "What does this program print?",
    code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(4, new ListNode(7, new ListNode(1)));
    int count = 0, best = 0;
    for (ListNode* cur = head; cur->next != nullptr; cur = cur->next) {
        ++count;
        if (cur->val > best) best = cur->val;
    }
    std::cout << count << ' ' << best << '\\n';
}
`,
    explanation: "The condition `cur->next != nullptr` stops ON the last node, so the loop body runs only for the first two nodes (4 and 7). The last node (1) is never counted. Use `cur != nullptr` when every node must be visited.",
  },
  {
    id: "r5-ptr-reverse-trace", kind: "trace", region: "R5", tags: ["linked-list", "reverse", "trace"],
    prompt: "What does this program print (the values in list order after reversing)?",
    code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(3, new ListNode(8, new ListNode(5, new ListNode(2))));
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    for (ListNode* p = prev; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`,
    explanation: "Every link is flipped, so the list reads from the old tail to the old head. The loop touches each node once: O(n) time, O(1) extra space.",
  },
  {
    id: "r5-ptr-arrow-error", kind: "compilerError", region: "R5", tags: ["linked-list", "compiler-errors"],
    prompt: "This code does not compile. What is the cause?",
    code: `struct ListNode {
    int val;
    ListNode* next;
};

int length(ListNode* head) {
    int n = 0;
    for (ListNode* cur = head; cur != nullptr; cur = cur.next) ++n;
    return n;
}
`,
    choices: ["`cur` is a pointer, so the member must be reached with `->`, not `.`", "A struct cannot hold a pointer to itself", "`nullptr` cannot be compared with a pointer", "The function must be declared before the struct"],
    answer: 0,
    explanation: "Use `cur->next` on a pointer and `cur.next` on an object. A struct may hold a pointer to its own type (the type is incomplete but a pointer to it is fine).",
  },
  {
    id: "r5-ptr-dummy-uses", kind: "multi", region: "R5", tags: ["linked-list", "dummy-node"],
    prompt: "When does a dummy node make the code simpler? Select all that apply.",
    choices: ["Removing a node that may be the head", "Building a result list by appending to a tail", "Merging two sorted lists", "Reading the value at the 10th position"],
    answers: [0, 1, 2],
    explanation: "A dummy gives the first node a predecessor, so head removal, result building and merging need no special case for the first node. Reading the 10th value is a plain walk and needs no rewiring.",
  },
  {
    id: "r5-ptr-reverse-parsons", kind: "parsons", region: "R5", tags: ["linked-list", "reverse", "parsons"],
    prompt: "Order the lines so the program reverses the list 1 -> 2 -> 3 and prints it.",
    lines: [
      "#include <iostream>",
      "struct ListNode {",
      "    int val;",
      "    ListNode* next;",
      "};",
      "int main() {",
      "    ListNode c{3, nullptr}, b{2, &c}, a{1, &b};",
      "    ListNode* prev = nullptr;",
      "    ListNode* cur = &a;",
      "    while (cur != nullptr) {",
      "        ListNode* nxt = cur->next;",
      "        cur->next = prev;",
      "        prev = cur;",
      "        cur = nxt;",
      "    }",
      "    for (ListNode* p = prev; p; p = p->next) std::cout << p->val << ' ';",
      "}",
    ],
    explanation: "Save the next node, flip the link, then advance both cursors. When `cur` is null, `prev` is the old tail and the new head.",
  },
  {
    id: "r5-ptr-reverse-cloze", kind: "cloze", region: "R5", tags: ["linked-list", "reverse", "cloze"],
    prompt: "Fill the blanks so the program prints 3 2 1.",
    template: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3)));
    ListNode* prev = nullptr;
    while (head != nullptr) {
        ListNode* nxt = head->___;
        head->next = ___;
        prev = head;
        head = nxt;
    }
    for (ListNode* p = prev; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`,
    blanks: [["next"], ["prev"]],
    explanation: "Save `head->next` first, then point the node back at the reversed part (`prev`).",
  },
  {
    id: "r5-ptr-null-loop", kind: "mcq", region: "R5", tags: ["linked-list", "null"],
    prompt: "You must append a node to the END of a non-empty list. Which loop leaves `cur` on the last node?",
    choices: ["while (cur->next != nullptr) cur = cur->next;", "while (cur != nullptr) cur = cur->next;", "while (cur->val != 0) cur = cur->next;", "for (int i = 0; i < 2; ++i) cur = cur->next;"],
    answer: 0,
    explanation: "Stopping when `cur->next` is null leaves `cur` on the last node, so `cur->next = new ListNode(x)` works. The second loop ends with `cur == nullptr`, and you have lost the tail.",
  },
  {
    id: "r5-ptr-dummy-trace", kind: "trace", region: "R5", tags: ["linked-list", "dummy-node", "trace"],
    prompt: "What does this program print (the list after the call)?",
    code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* dropRuns(ListNode* head, int bad) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;
    while (prev->next) {
        if (prev->next->val == bad) prev->next = prev->next->next;
        else prev = prev->next;
    }
    return dummy.next;
}

int main() {
    ListNode* head = new ListNode(6, new ListNode(6, new ListNode(1, new ListNode(6, new ListNode(6, new ListNode(9))))));
    head = dropRuns(head, 6);
    for (ListNode* p = head; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`,
    explanation: "`prev` stays put after a removal, so consecutive bad values (6, 6) are both skipped. The head itself is removed with no special case because the dummy sits in front of it.",
  },
  {
    id: "r5-ptr-complexity", kind: "mcq", region: "R5", tags: ["linked-list", "complexity"],
    prompt: "What are the time and extra space of iterative reversal of an n-node list, versus the recursive version?",
    choices: ["Both O(n) time; iterative O(1) space, recursive O(n) stack", "Iterative O(n^2) time, recursive O(n)", "Both O(1) space", "Iterative O(log n) time"],
    answer: 0,
    explanation: "Each node is visited once either way. Recursion keeps one frame per node on the call stack, which can overflow for very long lists; the loop uses three pointers.",
  },
  {
    id: "r5-ptr-partial-predict", kind: "predict", region: "R5", tags: ["linked-list", "reverse", "predict"],
    prompt: "What does this program print?",
    code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    ListNode* prev = nullptr;
    ListNode* cur = head;
    for (int i = 0; i < 3; ++i) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    head->next = cur;
    head = prev;
    for (ListNode* p = head; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`,
    explanation: "The loop reverses only the first three nodes. The old head (1) is now the end of the reversed block, so `head->next = cur` reconnects it to the untouched suffix (4, 5). This reconnect step is the heart of reversing in blocks of k.",
  },

  // ---- Fast and slow pointers
  {
    id: "r5-fs-signal", kind: "mcq", region: "R5", tags: ["linked-list", "fast-slow", "recognition"],
    prompt: "You need the middle node of a singly linked list of unknown length, in one pass and O(1) extra space. Which technique?",
    choices: ["Two cursors, one moving twice as fast as the other", "Copy the list into a vector and index it", "Recursion that returns the length", "Sort the list first"],
    answer: 0,
    explanation: "When the fast cursor reaches the end, the slow one has travelled half as far, so it stands on the middle. A vector costs O(n) space, and recursion costs O(n) stack.",
  },
  {
    id: "r5-fs-middle-predict", kind: "predict", region: "R5", tags: ["linked-list", "fast-slow", "predict"],
    prompt: "What does this program print?",
    code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(5, new ListNode(8, new ListNode(2, new ListNode(9, new ListNode(4, new ListNode(7))))));
    ListNode* slow = head;
    ListNode* fast = head;
    int rounds = 0;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        ++rounds;
    }
    std::cout << slow->val << ' ' << rounds << '\\n';
}
`,
    explanation: "With six nodes the loop runs n / 2 = 3 times, and slow ends on the fourth node (9), the second of the two middle nodes. Using only `fast->next != nullptr` as the condition would stop one round earlier for an even length.",
  },
  {
    id: "r5-fs-floyd-trace", kind: "trace", region: "R5", tags: ["linked-list", "fast-slow", "cycle", "trace"],
    prompt: "Nodes 0 to 6 hold the values 0, 10, ..., 60, and node 6 links back to node 2. What does this program print?",
    code: `#include <iostream>

struct Node {
    int val;
    Node* next;
};

int main() {
    Node n[7];
    for (int i = 0; i < 7; ++i) n[i] = {i * 10, i + 1 < 7 ? &n[i + 1] : &n[2]};
    Node* slow = &n[0];
    Node* fast = &n[0];
    int steps = 0;
    do {
        slow = slow->next;
        fast = fast->next->next;
        ++steps;
    } while (slow != fast);
    std::cout << steps << ' ' << slow->val << '\\n';
    Node* p = &n[0];
    while (p != slow) {
        p = p->next;
        slow = slow->next;
    }
    std::cout << p->val << '\\n';
}
`,
    explanation: "The tail is 2 nodes long and the cycle has 5, so the gap closes by one per step and the cursors meet after 5 steps, on the node holding 50. Phase 2 walks one cursor from the head and one from the meeting node at the same speed: after 2 steps both stand on the cycle entry, the node holding 20.",
  },
  {
    id: "r5-fs-no-skip", kind: "mcq", region: "R5", tags: ["linked-list", "fast-slow", "cycle", "proof"],
    prompt: "Inside a cycle, why can the fast cursor never jump over the slow one without landing on it?",
    choices: ["The gap between them changes by exactly one node per step, so it must pass through zero", "Fast moves three nodes per step", "Slow stops when fast is close", "The cycle length is always even"],
    answer: 0,
    explanation: "Fast gains two nodes and slow gains one, so the distance changes by exactly one per step. A gap that shrinks one at a time cannot go from positive to negative without being zero. (With a speed ratio of 3 the gap could change by 2 and skip, depending on the cycle length.)",
  },
  {
    id: "r5-fs-entry-reset", kind: "mcq", region: "R5", tags: ["linked-list", "fast-slow", "cycle", "proof"],
    prompt: "The cursors have met inside the cycle. How do you find the node where the cycle begins?",
    choices: ["Put one cursor back on the head and move both one step at a time until they meet", "Keep running fast and slow until they meet again", "Count the cycle length and walk that far from the head", "Reverse the list and look for the old head"],
    answer: 0,
    explanation: "With a = head to entry, b = entry to meeting point and c = cycle length, a + b = k * c, so a = (k - 1) * c + (c - b). Walking a steps from the head, and a steps from the meeting point, both end on the entry.",
  },
  {
    id: "r5-fs-decl-error", kind: "compilerError", region: "R5", tags: ["linked-list", "fast-slow", "compiler-errors"],
    prompt: "This code does not compile. What is the cause?",
    code: `struct ListNode {
    int val;
    ListNode* next;
};

ListNode* middle(ListNode* head) {
    ListNode* slow = head, fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}
`,
    choices: ["In `ListNode* slow = head, fast = head;` only `slow` is a pointer: `fast` is a ListNode", "A function cannot return a pointer to a struct", "`fast->next->next` is not allowed", "`nullptr` cannot be compared with `!=`"],
    answer: 0,
    explanation: "The `*` binds to the name, not the type: one declaration with two names makes `slow` a pointer and `fast` an object. Write two statements, or `ListNode *slow = head, *fast = head;`.",
  },
  {
    id: "r5-fs-which-problems", kind: "multi", region: "R5", tags: ["linked-list", "fast-slow", "recognition"],
    prompt: "Which tasks are solved by fast and slow pointers? Select all that apply.",
    choices: ["Detect a cycle in a linked list", "Find the middle node of a list", "Find the duplicate in an array of n + 1 values in 1..n by treating i -> a[i] as a pointer", "Binary search a sorted array", "Reverse a list in place"],
    answers: [0, 1, 2],
    explanation: "Cycle detection, the middle and the array-as-pointers duplicate all rely on a speed gap. Binary search halves a range instead, and reversal needs prev/cur/next, not two speeds.",
  },
  {
    id: "r5-fs-hascycle-parsons", kind: "parsons", region: "R5", tags: ["linked-list", "fast-slow", "cycle", "parsons"],
    prompt: "Order the lines so the program detects the cycle (c links back to b) and prints 1.",
    lines: [
      "#include <iostream>",
      "struct ListNode {",
      "    int val;",
      "    ListNode* next;",
      "};",
      "bool hasCycle(ListNode* head) {",
      "    ListNode* slow = head;",
      "    ListNode* fast = head;",
      "    while (fast != nullptr && fast->next != nullptr) {",
      "        slow = slow->next;",
      "        fast = fast->next->next;",
      "        if (slow == fast) return true;",
      "    }",
      "    return false;",
      "}",
      "int main() {",
      "    ListNode c{3, nullptr}, b{2, &c}, a{1, &b};",
      "    c.next = &b;",
      "    std::cout << hasCycle(&a) << '\\n';",
      "}",
    ],
    explanation: "Both cursors start on the head, move, and only then are compared: comparing before moving would report a cycle on the very first check. Falling off the end (`fast` or `fast->next` null) means no cycle.",
  },
  {
    id: "r5-fs-middle-cloze", kind: "cloze", region: "R5", tags: ["linked-list", "fast-slow", "cloze"],
    prompt: "Fill the blanks so the program prints the middle value, 3.",
    template: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->___ != nullptr) {
        slow = slow->___;
        fast = fast->next->___;
    }
    std::cout << slow->val << '\\n';
}
`,
    blanks: [["next"], ["next"], ["next"]],
    explanation: "Check `fast->next` before taking two steps, advance slow by one `next` and fast by two.",
  },
  {
    id: "r5-fs-intersect-why", kind: "mcq", region: "R5", tags: ["linked-list", "intersection"],
    prompt: "In the intersection trick each cursor jumps to the other list's head when it reaches the end. Why do they meet at the shared node?",
    choices: ["Each cursor walks lenA + lenB nodes, so they reach the common tail on the same step", "The longer list is cut shorter first", "Both cursors move at double speed", "The lists are sorted"],
    answer: 0,
    explanation: "Cursor A walks its own prefix, the shared tail, then B's prefix; cursor B does the mirror image. Both distances are the sum of the two private parts plus the tail, so the length difference cancels. With no shared node both become nullptr on the same step and the loop stops.",
  },
  {
    id: "r5-fs-intersect-predict", kind: "predict", region: "R5", tags: ["linked-list", "intersection", "predict"],
    prompt: "List A is 1, 2, 7, 8, 9 and list B is 5, 7, 8, 9, where the 7, 8, 9 nodes are shared. What does this program print?",
    code: `#include <iostream>

struct Node {
    int val;
    Node* next;
};

int main() {
    Node t3{9, nullptr}, t2{8, &t3}, t1{7, &t2};
    Node a2{2, &t1}, a1{1, &a2};
    Node b1{5, &t1};
    Node* pa = &a1;
    Node* pb = &b1;
    int steps = 0;
    while (pa != pb) {
        pa = pa ? pa->next : &b1;
        pb = pb ? pb->next : &a1;
        ++steps;
    }
    std::cout << (pa ? pa->val : -1) << ' ' << steps << '\\n';
}
`,
    explanation: "The private parts have 2 and 1 nodes and the shared tail has 3. Each cursor walks its private part, the tail, one step through nullptr, and then the other private part, so they meet on the first shared node (7) after 2 + 1 + 3 + 1 = 7 steps.",
  },
  {
    id: "r5-fs-palindrome-cost", kind: "mcq", region: "R5", tags: ["linked-list", "palindrome", "complexity"],
    prompt: "What does the middle, reverse-second-half, compare approach to a palindrome list cost, and what must you mention?",
    choices: ["O(n) time and O(1) extra space, and it modifies the list unless you reverse the half back", "O(n log n) time and O(1) space, and it is read-only", "O(n) time and O(n) extra space, and it is read-only", "O(n^2) time and O(1) space"],
    answer: 0,
    explanation: "Finding the middle, reversing and comparing are three linear passes with a few pointers. The reversal damages the list, so say so and offer to restore it. Copying to a vector is the read-only O(n)-space alternative.",
  },
];
