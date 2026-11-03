## Signals
Pointer walking: a position in a list is reached by following `next`, so you must count first.

## Brute force
Copy node pointers into a `vector<ListNode*>` and return `nodes[n / 2]`. O(n) time and O(n) space.

## Key insight
Two passes need no extra memory: one to learn `n`, one to walk `n / 2` steps. The walk never leaves the list because `n / 2 < n` whenever `n >= 1`.

## Optimal
Time O(n), space O(1).

## C++ walkthrough
`for (ListNode* cur = head; cur != nullptr; cur = cur->next) ++n;` counts. The second loop is `for (int i = 0; i < n / 2; ++i) head = head->next;`, which reuses the parameter `head` (it is a local copy of the pointer, so the caller's list is untouched). With `n == 0` the loop body never runs and `head` is already `nullptr`.

## Common bugs
Returning the first middle (index `(n - 1) / 2`) for even lengths. Walking `n / 2 + 1` steps and falling off the end. Returning the value instead of the node. Dereferencing a null `head` before checking it.

## Follow-ups
Do it in one pass with a slow and a fast pointer. Return the first middle for even lengths. Split the list into two halves.

## Similar problems
Middle of the Linked List (LeetCode 876).
