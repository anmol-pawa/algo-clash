import type { Lesson } from "@/lib/lessons/types";

/** R5 Chainlink Caves (CURRICULUM R5): linked lists. Original wording. */
export const r5Lessons: Lesson[] = [
  {
    id: "r5-pointer-rewiring", region: "R5", section: "R5",
    title: "Linked lists: rewire the pointers",
    summary: "A linked list is nodes joined by next pointers. Almost every list problem is a careful rewiring: save what you are about to lose, change one pointer, move on. A dummy node removes the special case at the head.",
    cardIds: ["r5-ptr-signal", "r5-ptr-save-next", "r5-ptr-predict", "r5-ptr-reverse-trace", "r5-ptr-arrow-error", "r5-ptr-dummy-uses", "r5-ptr-reverse-parsons", "r5-ptr-reverse-cloze", "r5-ptr-null-loop", "r5-ptr-dummy-trace", "r5-ptr-complexity", "r5-ptr-partial-predict"],
    problemIds: ["flip-chain", "tail-snip", "spin-chain", "parity-rails", "relay-flip"],
    pages: [
      {
        title: "Nodes and next pointers",
        blocks: [
          { kind: "text", text: "A node holds a value and a pointer to the next node. The list itself is just the pointer to the first node, the `head`. The last node's `next` is `nullptr`. There is no index: to reach the fifth node you must walk four `next` pointers, which is `O(n)`. In return, inserting or removing after a node you already hold is `O(1)`, because only pointers change and nothing shifts." },
          { kind: "code", run: true, caption: "Build 1 -> 2 -> 3 by hand, then walk it with a cursor.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

int main() {
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3)));
    int count = 0, sum = 0;
    for (ListNode* cur = head; cur != nullptr; cur = cur->next) {
        ++count;
        sum += cur->val;
    }
    std::cout << count << ' ' << sum << '\\n';
    while (head != nullptr) {          // free the nodes
        ListNode* gone = head;
        head = head->next;
        delete gone;
    }
}
` },
          { kind: "text", text: "The walking loop is `for (cur = head; cur != nullptr; cur = cur->next)`. Use `->` on a pointer and `.` on an object. The condition `cur != nullptr` visits every node; the condition `cur->next != nullptr` stops on the last node instead, which is what you want when you must edit that node (append, or look one ahead)." },
          { kind: "pitfall", title: "Dereferencing nullptr", text: "`cur->next` when `cur` is `nullptr` is undefined behaviour, usually a crash. Every time you write `a->next->val`, ask what happens when the list is empty, has one node, or ends there. Guard the empty list first." },
        ],
      },
      {
        title: "Reversal: save, point back, move on",
        blocks: [
          { kind: "text", text: "To reverse a list you flip every `next` to point backwards. Keep two cursors: `prev` (the already reversed part, starting empty) and `cur` (the first node not yet handled). For each node: remember `cur->next` (or you lose the rest of the list), point `cur->next` at `prev`, then step both cursors forward. When `cur` falls off the end, `prev` is the new head." },
          { kind: "code", run: true, caption: "Iterative reversal. Time O(n), extra space O(1).", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur != nullptr) {
        ListNode* nxt = cur->next;   // save before we overwrite it
        cur->next = prev;            // flip one link
        prev = cur;
        cur = nxt;
    }
    return prev;                     // the old tail
}

int main() {
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
    head = reverse(head);
    for (ListNode* p = head; p != nullptr; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "Check the edges before you trust it: an empty list returns `nullptr` (the loop never runs and `prev` is `nullptr`), and a one-node list returns that node with `next == nullptr`. The old head ends up as the tail, and its `next` was set to `prev == nullptr` on the first step, so the new list is properly terminated." },
          { kind: "pitfall", title: "Overwriting next too early", text: "If you write `cur->next = prev` before saving `cur->next`, the rest of the list is unreachable and the loop ends after one node. Order matters: save, rewire, advance. Drawing three boxes and their arrows on the whiteboard and re-drawing after every line catches this in seconds." },
          { kind: "interview", text: "Say the invariant while you code: 'prev is the head of the reversed prefix, cur is the head of the untouched suffix'. Then mention that the recursive version is also `O(n)` time but uses `O(n)` stack, which matters for a list of a million nodes." },
        ],
      },
      {
        title: "The dummy node",
        blocks: [
          { kind: "text", text: "Removing a node needs the node before it, so that one `next` can skip it. The head has no node before it, which makes the head a special case: `if (head->val == target) head = head->next;` and then a separate loop. A dummy node removes the special case. Create a throwaway node whose `next` is the head. Now every real node has a predecessor, the code is uniform, and the answer is `dummy.next`." },
          { kind: "code", run: true, caption: "Remove every node with value 2, including at the head. Stack-allocated dummy, one loop.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* removeAll(ListNode* head, int target) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;                 // always the last node we keep
    while (prev->next != nullptr) {
        if (prev->next->val == target) {
            ListNode* gone = prev->next;
            prev->next = gone->next;         // skip it
            delete gone;
        } else {
            prev = prev->next;
        }
    }
    return dummy.next;
}

int main() {
    ListNode* head = new ListNode(2, new ListNode(2, new ListNode(5, new ListNode(2, new ListNode(7)))));
    head = removeAll(head, 2);
    for (ListNode* p = head; p != nullptr; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "Notice that `prev` does not advance after a removal: the new `prev->next` has not been looked at yet. Advancing there would skip a node and fail on two equal values in a row. The dummy node is also the tool for building a result list (keep a `tail`, append, return `dummy.next`) and for any operation that may change which node is first, such as removing the n-th from the end, merging, or reversing a block." },
          { kind: "idiom", title: "Reach for a dummy when the head can change", text: "If the answer's first node might not be the input's first node, start with `ListNode dummy(0, head)` and return `dummy.next`. It costs one line and removes the empty-list and head-removal branches." },
          { kind: "interview", text: "Interviewers often pass an empty list, a single node and a removal at the head on purpose. Walk through those three by hand before you say 'done'." },
        ],
      },
    ],
  },
];
