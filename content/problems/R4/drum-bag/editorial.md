## Signals
"O(1) insert, delete and access by position" asks for two structures that each cover the other's weakness: an array is fast by index but slow to search or delete in the middle; a hash map finds by value but has no order. Combine them and keep them in sync.

## Brute force
A single vector with linear search for membership and removal. Insert and erase cost O(n) each, so 200,000 operations on a large drum is O(n²) in the worst case.

## Key insight
Order among the slots does not matter for anything except determinism, so a delete can reorder: swap the victim with the last element and shrink the array. That is O(1) on a vector. The only price is bookkeeping, since one ticket changes slot and the map must follow.

## Optimal
`slots` holds the tickets; `where[ticket]` is its index. `insert` checks `where`, appends, records the index. `erase` finds the hole, writes the last ticket there, sets `where[last] = hole`, pops the back, and finally erases `val` from `where`. `slot(i)` is `slots[i]`. Every operation is expected time O(1); space O(n).

## C++ walkthrough
`unordered_map::find` once and reuse the iterator. The order of the last two lines in `erase` matters: when the erased ticket was last, `last == val`, so `where[last] = hole` re-creates its key and the final `where.erase(val)` removes it again. Doing the erase first re-inserts a dead key. `slots_.back()` on an empty vector is undefined, but `erase` only reaches it after a successful lookup, so the vector is non-empty.

## Common bugs
Forgetting to update the moved ticket's slot (later erases hit the wrong index); the erase-then-move order above; using `vector::erase`, which shifts and costs O(n); returning from `insert` after changing the map but not the vector.

## Follow-ups
The classic version returns a *random* element: pick `rand() % size()` and return `slots[that]`, which is uniform because every ticket occupies exactly one slot. Allow duplicates: the map's value becomes a set of indices (the harder LeetCode 381). Anti-hash inputs: replace `unordered_map` with a map using a randomised hash.

## Similar problems
Insert Delete GetRandom O(1) (LeetCode 380) is this design with a random pick instead of a deterministic `slot(i)`; Insert Delete GetRandom O(1) with duplicates is LeetCode 381.
