## Signals
A singly linked list that must be changed in place, with a `ListNode*` argument and return value.

## Brute force
Copy the values into a `vector`, then build a new chain from the back. O(n) time but O(n) extra space and `n` new allocations; it also does not reuse the nodes as the statement requires. It is the checker.

## Key insight
Each bead needs exactly one change: its `next` should point to the bead before it. Walking forward with two pointers (`prev`, `cur`) and a saved `next` does all the relinking in one pass.

## Optimal
Iterative three-pointer reversal. Time O(n), extra space O(1). A recursive version is also O(n) time but uses O(n) call stack, which is a risk at 10^5 nodes.

## C++ walkthrough
`ListNode*` is a pointer, so `cur->next` reads through it and `nullptr` marks the end. We compare with `!= nullptr` explicitly for clarity. `ListNode* next = cur->next;` is a copy of the pointer, not of the node, so it stays valid after we rewrite `cur->next`. We never call `new` or `delete`: the nodes already exist, and the judge owns their memory (in interviews it is normal not to free LeetCode list nodes).

## Common bugs
Overwriting `cur->next` before saving it (the rest of the chain is lost); returning `head` (now the tail) instead of `prev`; stopping the loop one bead early; dereferencing `cur->next` when `cur` is `nullptr` on an empty chain.

## Follow-ups
Reverse only the beads between positions `left` and `right`. Reverse in groups of `k`. Reverse recursively and explain the stack cost.

## Similar problems
Reverse Linked List (LeetCode 206).
