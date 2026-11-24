import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R5 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const FLIP = `#include <initializer_list>
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v, ListNode* n = nullptr) : val(v), next(n) {}
};

class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        ListNode* reversed = nullptr;  // the already-flipped prefix, newest node first
        while (head != nullptr) {
            ListNode* rest = head->next;  // save the way forward before overwriting it
            head->next = reversed;
            reversed = head;
            head = rest;
        }
        return reversed;
    }
};

ListNode* build(initializer_list<int> vals) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (const int v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy.next;
}

void show(const ListNode* head) {
    cout << "[";
    for (const ListNode* cur = head; cur != nullptr; cur = cur->next) cout << (cur == head ? "" : ", ") << cur->val;
    cout << "]\\n";
}
`;

const LRU = `#include <iostream>
#include <list>
#include <unordered_map>
#include <utility>
using namespace std;

class BurrowCache {
public:
    explicit BurrowCache(int capacity) : capacity_(capacity) {}

    int get(int key) {
        const auto found = index_.find(key);
        if (found == index_.end()) return -1;
        touch(found->second);
        return found->second->second;
    }

    void put(int key, int value) {
        const auto found = index_.find(key);
        if (found != index_.end()) {  // update: no eviction, just refresh
            found->second->second = value;
            touch(found->second);
            return;
        }
        if (static_cast<int>(items_.size()) == capacity_) {
            index_.erase(items_.back().first);  // the node carries its key for exactly this
            items_.pop_back();
        }
        items_.emplace_front(key, value);
        index_[key] = items_.begin();
    }

private:
    using Item = pair<int, int>;  // key, value

    // Moves one node to the front in O(1); iterators stay valid after splice.
    void touch(list<Item>::iterator it) { items_.splice(items_.begin(), items_, it); }

    int capacity_;
    list<Item> items_;  // freshest at the front, stalest at the back
    unordered_map<int, list<Item>::iterator> index_;
};
`;

const tag = (scroll: string) => ["forge", scroll, "trace"];

export const forgeR5Cards: Card[] = [
  {
    id: "forge-list-reversal-trace-basic", kind: "trace", region: "R5", tags: tag("list-reversal"),
    prompt: "What does this program print?",
    code: `${FLIP}
int main() {
    show(Solution().flipChain(build({3, 8, 5, 1})));
}
`,
    explanation: "Each pass turns one link around, so after four passes the old tail 1 is the new head and the old head 3 is last: [1, 5, 8, 3].",
  },
  {
    id: "forge-list-reversal-trace-single", kind: "trace", region: "R5", tags: tag("list-reversal"),
    prompt: "One node, then none. What is printed?",
    code: `${FLIP}
int main() {
    show(Solution().flipChain(build({42})));
    show(Solution().flipChain(nullptr));
}
`,
    explanation: "One node: the loop runs once, pointing 42 at nullptr, and returns it: [42]. Empty: the loop never runs and reversed is still nullptr: [].",
  },
  {
    id: "forge-list-reversal-trace-old-head", kind: "trace", region: "R5", tags: tag("list-reversal"),
    prompt: "Keep a pointer to the old head. What is printed?",
    code: `${FLIP}
int main() {
    ListNode* first = build({1, 2, 3});
    ListNode* front = Solution().flipChain(first);
    cout << first->val << ' ' << (first->next == nullptr ? "end" : "more") << ' ' << front->val << '\\n';
}
`,
    explanation: "Reversal rewires links, it does not move values. The old head node still holds 1, and it is now the tail, so its next is nullptr (end). The new front is the old tail, 3: 1 end 3.",
  },
  {
    id: "forge-list-reversal-trace-twice", kind: "trace", region: "R5", tags: tag("list-reversal"),
    prompt: "Reverse twice. What is printed?",
    code: `${FLIP}
int main() {
    Solution s;
    show(s.flipChain(s.flipChain(build({6, 2, 9}))));
}
`,
    explanation: "Reversing twice restores the original order, and the original head is the head again: [6, 2, 9].",
  },
  {
    id: "forge-list-reversal-trace-prefix", kind: "trace", region: "R5", tags: tag("list-reversal"),
    prompt: "Reverse only the first two nodes. What is printed?",
    code: `${FLIP}
int main() {
    ListNode* head = build({1, 2, 3, 4, 5});
    ListNode* rest = head->next->next;
    head->next->next = nullptr;  // cut after the second node
    ListNode* front = Solution().flipChain(head);
    head->next = rest;  // the old head is now the tail of the flipped part
    show(front);
}
`,
    explanation: "Cutting after node 2 leaves the list 1 -> 2. Reversing gives 2 -> 1, and the old head (1) is its tail, so re-attaching rest there gives [2, 1, 3, 4, 5]. This cut, flip, re-attach step is the building block of reversing in groups of k.",
  },
  {
    id: "forge-lru-cache-trace-basic", kind: "trace", region: "R5", tags: tag("lru-cache"),
    prompt: "What does this program print?",
    code: `${LRU}
int main() {
    BurrowCache c(2);
    c.put(1, 1);
    c.put(2, 2);
    cout << c.get(1) << ' ';
    c.put(3, 3);
    cout << c.get(2) << ' ' << c.get(3) << '\\n';
}
`,
    explanation: "get(1) hits (1) and makes 1 the freshest, so 2 is the stalest. put(3) on a full cache evicts 2: get(2) is -1 and get(3) is 3. Output: 1 -1 3.",
  },
  {
    id: "forge-lru-cache-trace-get-refresh", kind: "trace", region: "R5", tags: tag("lru-cache"),
    prompt: "A get counts as a touch. What is printed?",
    code: `${LRU}
int main() {
    BurrowCache c(2);
    c.put(5, 50);
    c.put(6, 60);
    cout << c.get(5) << ' ';
    c.put(7, 70);
    cout << c.get(6) << ' ' << c.get(5) << ' ' << c.get(7) << '\\n';
}
`,
    explanation: "Key 5 was stored first, but get(5) moves it to the front, so 6 is now the stalest and is evicted by put(7). Output: 50 -1 50 70.",
  },
  {
    id: "forge-lru-cache-trace-update", kind: "trace", region: "R5", tags: tag("lru-cache"),
    prompt: "Updating a key. What is printed?",
    code: `${LRU}
int main() {
    BurrowCache c(2);
    c.put(1, 10);
    c.put(2, 20);
    c.put(1, 15);  // update
    c.put(3, 30);
    cout << c.get(1) << ' ' << c.get(2) << ' ' << c.get(3) << '\\n';
}
`,
    explanation: "put(1, 15) replaces the value without evicting and refreshes key 1, so 2 is the stalest when put(3) needs room. Output: 15 -1 30.",
  },
  {
    id: "forge-lru-cache-trace-cap-one", kind: "trace", region: "R5", tags: tag("lru-cache"),
    prompt: "Capacity 1. What is printed?",
    code: `${LRU}
int main() {
    BurrowCache c(1);
    c.put(4, 4);
    c.put(5, 5);
    cout << c.get(4) << ' ' << c.get(5) << ' ';
    c.put(5, 9);
    cout << c.get(5) << '\\n';
}
`,
    explanation: "With room for one item, put(5) evicts 4: -1 then 5. put(5, 9) is an update of the only key, so nothing is evicted and get(5) returns 9. Output: -1 5 9.",
  },
  {
    id: "forge-lru-cache-trace-miss", kind: "trace", region: "R5", tags: tag("lru-cache"),
    prompt: "A miss touches nothing. What is printed?",
    code: `${LRU}
int main() {
    BurrowCache c(2);
    c.put(1, 1);
    c.put(2, 2);
    cout << c.get(9) << ' ';
    c.put(3, 3);
    cout << c.get(1) << ' ' << c.get(2) << '\\n';
}
`,
    explanation: "get(9) misses, returns -1 and changes nothing: it neither inserts 9 nor refreshes anyone. So 1 is still the stalest and put(3) evicts it. Output: -1 -1 2.",
  },
];
