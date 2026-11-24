import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #25 "linked-list reversal". Template equals content/problems/R5/flip-chain/solution.cpp (tested). */
export const listReversalScroll: Scroll = {
  id: "list-reversal",
  cur: 25,
  title: "Scroll of the Turned Chain",
  region: "R5",
  blurb: "Walk the list once with three pointers, saving the way forward before turning each link around.",
  problemId: "flip-chain",
  template: `class Solution {
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
`,
  annotations: [
    { line: 4, note: "reversed is the part already turned around. It starts empty (nullptr), which is also what the old head must point to at the end." },
    { line: 5, note: "Loop while there is a node left to turn. An empty list never enters, and nullptr is returned, which is the correct empty answer." },
    { line: 6, note: "Save head->next first. The next line overwrites it, and without this copy the rest of the list is lost for good." },
    { line: 7, note: "The one real rewiring: point the current node back at the turned prefix." },
    { line: 8, note: "The current node is now the front of the turned prefix." },
    { line: 9, note: "Step forward using the saved pointer, not head->next, which now points backwards." },
    { line: 11, note: "When head falls off the end, reversed holds the old tail: the new head. Returning head here would return nullptr." },
  ],
  traceCardIds: [
    "forge-list-reversal-trace-basic",
    "forge-list-reversal-trace-single",
    "forge-list-reversal-trace-old-head",
    "forge-list-reversal-trace-twice",
    "forge-list-reversal-trace-prefix",
  ],
  commonBugs: [
    "Overwriting head->next before saving it cuts the list after the first node.",
    "Returning head instead of reversed returns nullptr, because head has walked off the end.",
    "Starting reversed at head instead of nullptr makes the old head point at itself: a one-node cycle.",
    "Stepping with head = head->next after the rewiring follows the new backward link (nullptr on the first pass), so only one node is returned.",
    "Copying the values into a vector and writing them back works but is not the in-place rewiring the interview asks for, and uses O(n) space.",
  ],
};

/** CUR §4 #27 "LRU cache". Template equals content/problems/R5/burrow-cache/solution.cpp (tested). */
export const lruCacheScroll: Scroll = {
  id: "lru-cache",
  cur: 27,
  title: "Scroll of the Fresh Front",
  region: "R5",
  blurb: "Keep items in a list with the freshest at the front and a hash map of iterators, so lookup, refresh and eviction are all O(1).",
  problemId: "burrow-cache",
  template: `class BurrowCache {
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
`,
  annotations: [
    { line: 3, note: "explicit stops an int from silently converting into a cache. The capacity is fixed for the cache's lifetime." },
    { line: 6, note: "One hash lookup finds the key and, through the stored iterator, the list node itself: no list walk." },
    { line: 7, note: "A miss returns -1 and must not change the order: nothing was touched." },
    { line: 8, note: "A hit counts as a touch, so move the node to the front before answering. Forgetting this is the most common LRU bug." },
    { line: 14, note: "Updating an existing key never evicts: the size does not grow." },
    { line: 16, note: "An update is also a touch, so the node moves to the front." },
    { line: 19, note: "Evict only when a new key would push the size past capacity. The stalest item is at the back." },
    { line: 20, note: "Erase from the map first, using the key stored in the node. This is why the list holds (key, value) and not just the value." },
    { line: 21, note: "Then drop the node itself. Doing it in the other order would read back() after it is gone." },
    { line: 23, note: "A new item is the freshest, so it goes to the front." },
    { line: 24, note: "Store the iterator to the new front node. std::list iterators stay valid while other nodes are inserted, erased or spliced." },
    { line: 31, note: "splice relinks one node to the front in O(1) without copying or invalidating its iterator, so the map entry stays correct." },
    { line: 34, note: "Invariant: front = most recently touched, back = least recently touched." },
  ],
  traceCardIds: [
    "forge-lru-cache-trace-basic",
    "forge-lru-cache-trace-get-refresh",
    "forge-lru-cache-trace-update",
    "forge-lru-cache-trace-cap-one",
    "forge-lru-cache-trace-miss",
  ],
  commonBugs: [
    "get returns the value but does not move the node to the front, so a hot key is evicted.",
    "put on an existing key updates the value but does not refresh it.",
    "Evicting before checking whether the key already exists throws out an item on a plain update.",
    "Storing only values in the list means eviction cannot find the key to erase from the map.",
    "Scanning a vector for the stalest key is O(capacity) per operation and times out on large caches.",
  ],
};
