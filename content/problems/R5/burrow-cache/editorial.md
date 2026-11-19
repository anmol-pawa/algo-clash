## Signals
"Evict the least recently used", "every operation O(1)" and "an item in the middle becomes the newest". You need two things at once: find an item by key (a hash map), and keep all items ordered by recency with cheap removal from the middle and from the end (a doubly linked list). A vector or a plain array cannot move an item to the front in O(1).

## Brute force
Keep a vector ordered stalest-first. Every `get` and `put` scans for the key, erases it from the middle and appends it to the back; eviction erases the front. Correct, but each operation costs O(k) for capacity k. With k = 50000 and 200000 operations that is billions of element moves.

## Key insight
Split the work between two structures that point at each other.

1. A **doubly linked list** holds the treasures from freshest (front) to stalest (back). Unlinking a node and relinking it at the front is O(1) when you hold the node.
2. A **hash map** from key to list node gives that node in O(1).

Each node stores its **key** as well as its value. When the back node is evicted, its key is how you erase the map entry. Forgetting this is the classic bug: the map keeps a dangling iterator.

## Optimal
`get(key)`: find the node; if missing return -1; move it to the front; return its value.
`put(key, value)`: if the key exists, overwrite the value and move the node to the front, with **no eviction** (the size does not change). Otherwise, if `size == capacity`, erase `items.back().first` from the map and `pop_back()`; then `emplace_front` and record `items.begin()` in the map.

Time O(1) average per operation (hash map), space O(k).

## C++ walkthrough
`std::list::splice(pos, other, it)` relinks one node in O(1) and, unlike erase-then-insert, **keeps every iterator valid**, so the `unordered_map<int, list<pair<int,int>>::iterator>` never goes stale. `splice(items_.begin(), items_, it)` with the same list on both sides is allowed and moves a single element. Update the value through the iterator before or after the splice; both work. Keep `touch` as one small helper so `get` and `put` cannot drift apart. Write the node by hand (`prev`, `next`, sentinel head and tail) when an interviewer asks you not to use `std::list`: two dummy nodes remove every empty-list special case.

## Common bugs
`get` that does not refresh recency; `put` on an existing key that updates the value but does not refresh it; evicting before checking whether the key already exists (a full cache loses an entry on a pure update); evicting the front instead of the back; a list node without the key, so the map entry of the evicted node cannot be erased; the O(k) vector scan.

## Follow-ups
Make it thread-safe: one mutex is correct, then discuss lock striping and why `get` is a write here. Add a time-to-live per item. LFU cache (evict the least frequently used, ties by recency) needs a frequency-bucket list per count. Discuss why real systems approximate LRU (clock algorithm, sampled eviction) to avoid touching shared state on every read.

## Similar problems
LRU Cache (LeetCode 146) is this problem. LFU Cache (LeetCode 460) and Design Browser History (LeetCode 1472) reuse the same ideas.
