## Signals
"Rotate by k" where `k` is not bounded by the length. The two things to notice are that `k % n` is the only part of `k` that matters and that a linked list rotation is a pointer surgery, not data movement.

## Brute force
Simulate one spin at a time: find the node before the last, move the last node to the front, repeat `k` times. Even after reducing `k` modulo `n` this is O(n * (k mod n)), up to about 10^10 steps at 100000 nodes. Without the reduction it is hopeless for `k` near 2 * 10^9. Copying values into an array and writing them back to `(i + k) % n` is O(n) time and O(n) memory and is a good baseline.

## Key insight
Closing the list into a ring and re-cutting it needs no data movement. After `spins` right spins, the last `spins` nodes lead the list, so the new tail is the node at index `n - spins - 1` and the new head is the one after it.

## Optimal
1. Handle `head == nullptr`, a single node and `k == 0`.
2. Walk once to get `n` and the tail.
3. `spins = k % n`; if it is zero, return `head`.
4. Walk `n - spins - 1` steps from `head` to reach `newTail`.
5. `newHead = newTail->next; newTail->next = nullptr; tail->next = head;` and return `newHead`.

Time O(n) (about 2n pointer hops in the worst case), space O(1).

## C++ walkthrough
`k` is an `int` up to 2 * 10^9, which fits in 32 bits, and `k % n` keeps everything in `int`. The order of the last three statements matters: read `newTail->next` **before** you cut, and link the old tail to the old head only after the cut has been made, or the new tail would still point into the rest of the chain.

## Common bugs
Rotating left instead of right (`spins` from the front rather than `n - spins` from the back); clamping `k` to `n` instead of reducing it (`k = n + 1` must behave like `k = 1`); cutting one node too early or too late; forgetting the early return for `spins == 0`, which would cut the chain at its own tail and form a cycle; dereferencing `head->next` on an empty list.

## Follow-ups
Rotate left instead (same code with `spins = n - k % n`); rotate a doubly linked circular list in O(1) by moving the head pointer; rotate an array in place with three reversals; discuss the cost when the list length is not known in advance.

## Similar problems
Rotate List (LeetCode 61) is this problem. Remove Nth Node From End of List (LeetCode 19) uses the same "n from the back" arithmetic. Rotate Array (LeetCode 189) is the array version.
