## Signals
"Group by **position**, keep relative order" and "in place" on a linked list. Two output chains built by walking once is the classic partition pattern for lists, a cousin of partitioning around a pivot (Partition List) and of merging.

## Brute force
Copy the values into two `vector`s by position, concatenate, and rebuild the list. O(n) time and O(n) memory, and it allocates nodes the statement says not to. Another brute force cuts every even node out and appends it after walking to the tail: it is correct but O(n^2), which fails at 100000 nodes.

## Key insight
The odd-position nodes already appear in the right relative order, and so do the even-position ones. A single pass that splices each node onto the right rail keeps both orders without sorting or extra memory.

## Optimal
1. If the list has fewer than two nodes, return it.
2. `odd = head`, `evenHead = head->next`, `even = evenHead`.
3. While `even` and `even->next` exist: `odd->next = even->next; odd = odd->next; even->next = odd->next; even = even->next;`.
4. `odd->next = evenHead` and return `head`.

Time O(n) with one traversal, space O(1).

## C++ walkthrough
`evenHead` must be saved before the loop because `head->next` is overwritten in the first iteration. The loop tests the **even** pointer: after an iteration `even` is on the last even node or null, and `odd` is on the last odd node. When the length is odd, `even->next` becomes null first; when it is even, `even` itself becomes null. In both cases `odd` is on the last odd node, which is the one to link to `evenHead`.

## Common bugs
Grouping by value parity; forgetting `odd->next = evenHead` (the even wagons disappear); losing `evenHead` (re-reading `head->next` at the end gives the wrong wagon, because the first iteration overwrote it); testing only `even->next` and dereferencing a null `even`; forgetting that the last even node's `next` must be null (this happens automatically here because `even->next = odd->next`).

## Follow-ups
Partition by value (LeetCode 86) with two dummy heads; split a list into `k` interleaved rails; do it on an array with `std::stable_partition` and discuss why the index, not the value, is the key.

## Similar problems
Odd Even Linked List (LeetCode 328) is this problem. Partition List (LeetCode 86) is the same two-rail idea with a value test, and Reorder List (LeetCode 143) combines it with a reversal.
