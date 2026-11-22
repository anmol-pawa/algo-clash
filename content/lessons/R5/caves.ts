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
  {
    id: "r5-fast-slow", region: "R5", section: "R5",
    title: "Fast and slow pointers",
    summary: "Two cursors that walk at different speeds answer questions a single walk cannot: where the middle is, whether the list loops, where the loop starts, where two lists meet. The speed gap does the counting for you, in O(1) extra space.",
    cardIds: ["r5-fs-signal", "r5-fs-middle-predict", "r5-fs-floyd-trace", "r5-fs-no-skip", "r5-fs-entry-reset", "r5-fs-decl-error", "r5-fs-which-problems", "r5-fs-hascycle-parsons", "r5-fs-middle-cloze", "r5-fs-intersect-why", "r5-fs-intersect-predict", "r5-fs-palindrome-cost"],
    problemIds: ["mid-link", "chain-loop", "loop-gate", "twin-beacon", "fork-point", "mirror-chain", "weave-ends"],
    pages: [
      {
        title: "The middle in one pass",
        blocks: [
          { kind: "text", text: "To find the middle of a list you could count the nodes and walk again, which is two passes. With two cursors you need one. `slow` moves one node per step and `fast` moves two. When `fast` reaches the end, `slow` has covered half the distance, so it stands on the middle." },
          { kind: "code", run: true, caption: "Middle of a list. For an even length this returns the second of the two middle nodes.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* middle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

int main() {
    ListNode* odd = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    ListNode* even = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
    std::cout << middle(odd)->val << ' ' << middle(even)->val << '\\n';
}
` },
          { kind: "text", text: "The loop condition has two parts for a reason. `fast->next->next` needs both `fast` and `fast->next` to exist, and the check `fast != nullptr` must come first so that `fast->next` is never read through a null pointer. With `fast->next != nullptr` alone the loop is wrong for an even length: it would stop one node early and give the first middle. Which middle you want is part of the problem statement; ask, and then pick the condition. For a list of length n, the loop body runs `n / 2` times." },
          { kind: "pitfall", title: "Condition order and the empty list", text: "`while (fast->next && fast)` crashes on an empty list because `fast->next` is read before `fast` is checked. Always test the pointer, then its `next`. Also run your loop by hand on lengths 0, 1, 2 and 3: those four cases catch almost every off-by-one." },
          { kind: "interview", text: "Say what you return for an even length before you write the loop. 'Second middle' is the natural result of `fast && fast->next`. Splitting a list into two halves for merge sort needs the first middle instead, so you start `fast` at `head->next`." },
        ],
      },
      {
        title: "Cycles: Floyd's tortoise and hare",
        blocks: [
          { kind: "text", text: "If a list has a cycle, walking it with a single cursor never ends. Run the same two cursors instead. Without a cycle, `fast` falls off the end and you answer 'no'. With a cycle both cursors end up inside it, and then `fast` closes the gap to `slow` by exactly one node per step (it gains two, slow moves one). A gap that shrinks by one each step cannot jump over zero, so the cursors must land on the same node. That is the whole proof that they meet, and it takes at most about one lap of the cycle." },
          { kind: "text", text: "Finding where the cycle begins needs one more fact. Let `a` be the number of steps from the head to the cycle entry, `b` the steps from the entry to the meeting node, and `c` the length of the cycle. When they meet, slow has walked `a + b` and fast has walked `2(a + b)`, which is `a + b` plus some whole number `k` of laps: `a + b = k * c`. Rearranged, `a = k * c - b = (k - 1) * c + (c - b)`. So walking `a` steps from the head lands on the entry, and walking `a` steps from the meeting node also lands on the entry (it goes the remaining `c - b` to the entry, then whole laps). Start one cursor at the head, keep the other at the meeting node, move both one step at a time, and they meet exactly on the entry node." },
          { kind: "code", run: true, caption: "Cycle entry. Nodes 0..6; node 6 links back to node 2. Time O(n), extra space O(1).", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
};

ListNode* cycleEntry(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {                  // phase 1: they met inside the cycle
            ListNode* p = head;              // phase 2: head and meeting point
            while (p != slow) {              // move at the same speed
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return nullptr;                          // fast fell off the end: no cycle
}

int main() {
    ListNode node[7];
    for (int i = 0; i < 7; ++i) node[i] = {i, i + 1 < 7 ? &node[i + 1] : &node[2]};
    ListNode* entry = cycleEntry(&node[0]);
    std::cout << (entry ? entry->val : -1) << '\\n';
    node[6].next = nullptr;                  // cut the loop
    entry = cycleEntry(&node[0]);
    std::cout << (entry ? entry->val : -1) << '\\n';
}
` },
          { kind: "text", text: "The same idea works on any 'follow the pointer' structure. In an array of `n + 1` values from `1` to `n`, treat `i -> a[i]` as a next pointer. Two indexes cannot map to the same value without creating a node with two predecessors, so the duplicated value is exactly where the walk enters a cycle, and Floyd finds it with no extra memory and without modifying the array." },
          { kind: "idiom", title: "Name the three distances", text: "When you explain Floyd, say `a`, `b` and `c` out loud and write `a + b = k * c` on the board. Interviewers do not want 'I memorised it'; they want to hear why the second phase works." },
        ],
      },
      {
        title: "Meeting lists, palindromes and reordering",
        blocks: [
          { kind: "text", text: "Intersection: two lists may share a tail (the same nodes, not equal values). Walk `pa` along list A and `pb` along list B; when a cursor falls off the end, send it to the head of the other list. Each cursor then walks `lenA + lenB` nodes in total, so both arrive at the shared node at the same step. If the lists share nothing, both reach `nullptr` together, the loop ends, and you return `nullptr`. It is the fast/slow idea without speeds: switching lists cancels the length difference." },
          { kind: "text", text: "Palindrome list: find the middle with fast and slow, reverse the second half in place with the reversal loop from the last lesson, then walk both halves together and compare values. That is O(n) time and O(1) extra space, where copying the values into a vector costs O(n) space. A careful answer mentions that the list is now damaged, and says you could reverse the second half back before returning if the caller still needs it." },
          { kind: "code", run: true, caption: "Palindrome check: middle, reverse second half, compare.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

bool isPalindrome(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    ListNode* prev = nullptr;                // reverse from the middle on
    while (slow != nullptr) {
        ListNode* nxt = slow->next;
        slow->next = prev;
        prev = slow;
        slow = nxt;
    }
    for (ListNode* a = head, *b = prev; b != nullptr; a = a->next, b = b->next) {
        if (a->val != b->val) return false;
    }
    return true;
}

int main() {
    ListNode* x = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(2, new ListNode(1)))));
    ListNode* y = new ListNode(1, new ListNode(2, new ListNode(2, new ListNode(3))));
    std::cout << isPalindrome(x) << ' ' << isPalindrome(y) << '\\n';
}
` },
          { kind: "text", text: "The loop compares only until the reversed half ends. For an odd length the middle node belongs to the reversed half and is compared with itself, which is harmless. Reorder-list problems use the same three moves, middle, reverse the second half, then interleave the halves node by node, so once you can write these three helpers you can assemble a whole family of problems from them." },
          { kind: "interview", text: "State the cost before coding: 'O(n) time, O(1) extra space, and it mutates the list; I can restore it if you want.' That one sentence covers the space-versus-mutation trade-off most interviewers probe." },
        ],
      },
    ],
  },
  {
    id: "r5-merge-sort-lists", region: "R5", section: "R5",
    title: "Merge, sort and cache with lists",
    summary: "Merging two sorted lists is the one building block behind adding numbers digit by digit, sorting a list in O(n log n), combining k lists with a heap and keeping a cache in recency order. Learn it once, with a dummy node, and reuse it everywhere.",
    cardIds: ["r5-ms-dummy-why", "r5-ms-merge-predict", "r5-ms-carry-trace", "r5-ms-split-why", "r5-ms-sort-cost", "r5-ms-decl-error", "r5-ms-kway-cost", "r5-ms-merge-parsons", "r5-ms-lru-cloze", "r5-ms-lru-predict", "r5-ms-copy-why", "r5-ms-which-structure"],
    problemIds: ["zipper-merge", "carry-chain", "chain-sort", "tunnel-council", "mirror-twins", "burrow-cache"],
    pages: [
      {
        title: "Merging and carrying with a dummy node",
        blocks: [
          { kind: "text", text: "Two sorted lists become one sorted list by repeating a single decision: compare the two front nodes and relink the smaller one onto the tail of the answer. No values are copied; only `next` pointers change. The awkward part is the very first node, because the answer has no tail yet. A dummy node solves it: start with a stack-allocated `ListNode dummy` and a `tail` pointer to it, and return `dummy.next` at the end. The loop then has no special case for the head." },
          { kind: "code", run: true, caption: "Merge two sorted lists by relinking nodes. Time O(m + n), extra space O(1).", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v = 0, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* merge(ListNode* a, ListNode* b) {
    ListNode dummy;
    ListNode* tail = &dummy;
    while (a != nullptr && b != nullptr) {
        if (b->val < a->val) {               // strict < keeps equal values in a-first order (stable)
            tail->next = b;
            b = b->next;
        } else {
            tail->next = a;
            a = a->next;
        }
        tail = tail->next;
    }
    tail->next = (a != nullptr) ? a : b;     // splice the leftover run in one move
    return dummy.next;
}

int main() {
    ListNode* a = new ListNode(1, new ListNode(4, new ListNode(9)));
    ListNode* b = new ListNode(2, new ListNode(4, new ListNode(5, new ListNode(11))));
    for (ListNode* cur = merge(a, b); cur != nullptr; cur = cur->next) std::cout << cur->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "The leftover run needs no loop: when one list is empty, the other is already sorted and already linked, so one assignment attaches all of it. Adding two numbers stored as digit lists uses the same skeleton. Walk both lists together, and at each step add the two digits (a missing digit counts as 0) plus a `carry`, write `sum % 10` into a new node on the tail and keep `sum / 10` as the next carry. The loop condition is `a || b || carry`, so a final carry of 1 still produces a node, which is the case most first attempts forget." },
          { kind: "pitfall", title: "The dummy lives on the stack", text: "`ListNode dummy;` is fine here because you return `dummy.next`, a heap node, never the address of `dummy`. Returning `&dummy` would hand back a dangling pointer. Also write `ListNode* tail = &dummy;`: declaring `ListNode* tail = dummy;` does not compile because `dummy` is an object, not a pointer." },
          { kind: "interview", text: "Name the invariant out loud: 'everything before tail is final and sorted, and both remaining lists are sorted'. It shows why the leftover splice is correct and lets you handle empty inputs without extra branches." },
        ],
      },
      {
        title: "Sorting a list and merging k lists",
        blocks: [
          { kind: "text", text: "Arrays are sorted with random access, which a list lacks, so heap sort and quicksort partitioning are awkward. Merge sort fits perfectly: split the list in half, sort each half recursively, merge the halves with the function above. The split uses fast and slow pointers. To cut the list into a first half and a second half you need the first middle, so start `fast` at `head->next`; with the second middle a list of two nodes would split into the whole list and an empty one, and the recursion would never shrink." },
          { kind: "code", run: true, caption: "Merge sort on a singly linked list. Time O(n log n), extra space O(log n) for the recursion.", code: `#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int v = 0, ListNode* n = nullptr) : val(v), next(n) {}
};

ListNode* merge(ListNode* a, ListNode* b) {
    ListNode dummy;
    ListNode* tail = &dummy;
    while (a != nullptr && b != nullptr) {
        ListNode*& smaller = (b->val < a->val) ? b : a;
        tail->next = smaller;
        smaller = smaller->next;
        tail = tail->next;
    }
    tail->next = (a != nullptr) ? a : b;
    return dummy.next;
}

ListNode* sortList(ListNode* head) {
    if (head == nullptr || head->next == nullptr) return head;
    ListNode* slow = head;
    ListNode* fast = head->next;             // first middle: slow ends on the last node of the left half
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    ListNode* right = slow->next;
    slow->next = nullptr;                    // cut the list in two
    return merge(sortList(head), sortList(right));
}

int main() {
    ListNode* head = new ListNode(5, new ListNode(1, new ListNode(4, new ListNode(2, new ListNode(3, new ListNode(1))))));
    for (ListNode* cur = sortList(head); cur != nullptr; cur = cur->next) std::cout << cur->val << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "The recursion depth is log n and every level touches each node once, so the time is O(n log n) and the extra space is O(log n) for the call stack. A bottom-up version merges runs of length 1, 2, 4, and so on, and reaches O(1) extra space; mention it when the interviewer asks for constant space." },
          { kind: "text", text: "Now k sorted lists with N nodes in total. Merging them one after another into a growing answer re-walks the answer every time and costs O(N * k). Two better ways cost O(N log k). Keep a min-heap holding the current front node of every list: pop the smallest, append it, push its successor. Or merge the lists pairwise in rounds, which is the merge sort recursion over the list of lists. The heap holds at most k nodes, so its operations cost log k, and each of the N nodes passes through it once. With `std::priority_queue` you need a comparator that makes the smallest value the top, because the default is a max-heap." },
          { kind: "idiom", title: "Heap of fronts", text: "Push only non-null nodes. A comparator `[](ListNode* x, ListNode* y) { return x->val > y->val; }` gives a min-heap; flipping the sign is the single most common bug in this problem." },
        ],
      },
      {
        title: "Caches and copies: lists plus a hash map",
        blocks: [
          { kind: "text", text: "A least-recently-used cache needs two operations in O(1): find an entry by key, and move an entry to the front of the recency order. A hash map alone finds in O(1) but has no order; a list alone keeps order and moves in O(1) once you hold the node, but finding it costs O(n). Together they give both: the list stores (key, value) pairs from most to least recent, and the map stores, for each key, an iterator to its list node. In C++ `std::list::splice` moves a node to the front without invalidating iterators or copying, so a hit is a map lookup plus one splice. When the cache is full, evict `list.back()` and erase its key from the map, which is why the list must keep the key as well as the value." },
          { kind: "code", run: true, caption: "LRU cache with std::list and an unordered_map of iterators. get and put are O(1) on average.", code: `#include <iostream>
#include <list>
#include <unordered_map>
#include <utility>

class LRUCache {
public:
    explicit LRUCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        auto it = index_.find(key);
        if (it == index_.end()) return -1;
        order_.splice(order_.begin(), order_, it->second);   // mark as most recent
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = index_.find(key);
        if (it != index_.end()) {
            it->second->second = value;
            order_.splice(order_.begin(), order_, it->second);
            return;
        }
        if (static_cast<int>(order_.size()) == capacity_) {
            index_.erase(order_.back().first);               // evict the least recent
            order_.pop_back();
        }
        order_.emplace_front(key, value);
        index_[key] = order_.begin();
    }

private:
    int capacity_;
    std::list<std::pair<int, int>> order_;                   // front = most recent
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> index_;
};

int main() {
    LRUCache cache(2);
    cache.put(1, 10);
    cache.put(2, 20);
    cache.get(1);                                            // 1 is now fresher than 2
    cache.put(3, 30);                                        // evicts 2
    std::cout << cache.get(2) << ' ' << cache.get(1) << ' ' << cache.get(3) << '\\n';
}
` },
          { kind: "text", text: "The same pairing idea copies a list whose nodes also carry a `random` pointer to any node. A hash map from each original node pointer to its clone lets you build all clones in one pass and wire `next` and `random` in a second pass: the map answers 'which clone corresponds to this original?' in O(1). Key the map by node pointer, never by value, because values repeat. The O(1)-space alternative weaves each clone between its original and the next original, sets each clone's random through `orig->random->next`, and then unzips the two lists; it is trickier, so offer the map first and the weave as the follow-up." },
          { kind: "interview", text: "For the cache, say the invariant: 'the map and the list always contain exactly the same keys'. Every bug in this problem breaks it: forgetting to erase the evicted key from the map, or updating a key without refreshing its position." },
        ],
      },
    ],
  },
];
