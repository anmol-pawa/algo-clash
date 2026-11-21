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
];
