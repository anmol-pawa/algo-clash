## Signals
"Middle of a linked list" with no stored length is the fast and slow runner pattern. The same idea finds cycles and the split point for merge sort on lists.

## Brute force
Walk once to count the nodes, then walk `length / 2` steps. Two passes, O(n) time and O(1) space. It is perfectly valid, and worth mentioning, but the runner version needs only one pass.

## Key insight
If one cursor moves twice as fast as the other, the fast one finishes the list exactly when the slow one is halfway. No counting is needed.

## Optimal
Set `slow = fast = head`. While `fast` and `fast->next` are both non-null: `slow = slow->next`, `fast = fast->next->next`. Return `slow`. Invariant: `fast` has moved exactly twice as many steps as `slow`. On an odd length `fast` stops on the last node, on an even length it falls off the end, and in both cases `slow` is the middle (the second middle for even lengths). Time O(n), space O(1).

## C++ walkthrough
Check `fast` before `fast->next` (the `&&` short-circuits) so the empty list returns `nullptr` without a crash, and so `fast->next->next` is only read when `fast->next` is non-null. Using `fast->next != nullptr` in the loop, rather than `fast->next->next`, is what selects the second middle.

## Common bugs
Reading `fast->next` when `fast` is null; stopping one step early and returning the first middle; moving both cursors at the same speed; counting the length with an `int` and dividing incorrectly for even lengths (`n / 2`, not `(n - 1) / 2`, gives the second middle).

## Follow-ups
Return the first middle instead; split the list into two halves (cut the link before the middle); use the middle to check for a palindrome list or to merge-sort a list.

## Similar problems
Middle of the Linked List (LeetCode 876) is this problem. Palindrome Linked List (LeetCode 234), Reorder List (LeetCode 143) and Sort List (LeetCode 148) all start by finding and cutting at the middle.
