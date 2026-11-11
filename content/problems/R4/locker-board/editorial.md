## Signals
"Implement the map yourself" is a data-structure-internals question. Interviewers check three things: do you know why keys are reduced to a bucket index, what you do when two keys collide, and what keeps the structure fast as it grows.

## Brute force
One vector of pairs with a linear scan for every operation. Correct, but each operation is O(n), so 200,000 operations on a large board is about 10^10 pair comparisons in the worst case.

## Key insight
A hash function maps a huge key space onto a small array of buckets; collisions are unavoidable, so each bucket holds a short chain. Lookup cost is the chain length, which averages `count / buckets` (the load factor). Keep that near 1 by doubling the bucket array when it is exceeded and re-inserting every entry. One rehash is O(n), but doubling means total rehash work over n inserts is O(n), so `put` is amortised O(1).

## Optimal
`put`: find the bucket (`key % buckets`), scan the chain, overwrite if the key exists, otherwise append and bump the count; grow if `count > buckets`. `get`: scan the chain, return `-1` on a miss. `remove`: find the pair, overwrite it with the chain's last pair and `pop_back` (chain order does not matter), decrement the count. Expected time O(1) per operation; space O(n).

## C++ walkthrough
Use `vector<pair<int,int>>` as the chain: it is cache-friendlier than `list`. `size_t` for indices avoids signed `%` surprises (keys here are non-negative; with negative keys `key % B` can be negative). `buckets_ = move(bigger)` hands over the new array without copying. `constexpr` for the initial size keeps the magic number named. `get` is `const`; note that `operator[]`-style access is not available on a hand-made structure, so a miss must not insert anything.

## Common bugs
`put` appending a second pair for an existing key (two values per key, wrong `count`); using `0` or `-1` as an in-band "empty" marker when `0` is a legal value; never growing, so chains degrade to O(n); forgetting to decrement the count on remove (or counting a replace as new); rehashing with the old modulus; erasing from a vector while an iterator into it is still in use.

## Follow-ups
Open addressing (linear probing) needs tombstones for `remove`, and its load factor must stay below about 0.7. Power-of-two bucket counts replace `%` with a mask but need a mixed hash, or low bits collide. Defend against adversarial keys with a randomised seed. Thread safety: lock striping per bucket.

## Similar problems
Design HashMap (LeetCode 706), Design HashSet (LeetCode 705); LRU Cache (LeetCode 146) combines this map with a list.
