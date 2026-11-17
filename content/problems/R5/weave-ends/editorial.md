## Signals
"Alternate between the two ends" of a **singly** linked list, in place. Anything that asks for the back of the list in reverse order points to reversing the second half. This problem is the capstone of the section: middle, reverse and merge in one function.

## Brute force
Copy the values into a `vector`, pick `lo, hi, lo+1, hi-1, ...` with two indices, and rebuild the list. O(n) time but O(n) extra memory, and it breaks the "rearrange the existing nodes" requirement. Another brute force repeatedly walks to the last node and splices it after the current front node, which is O(n^2) and times out at 100000 nodes.

## Key insight
The target order is the first half interleaved with the **reverse** of the second half. Each half can be produced in O(n) with O(1) memory, and an interleaving merge touches every node once.

## Optimal
1. Fast and slow runners (`while (fast->next && fast->next->next)`) leave `slow` on the last node of the first half; for an odd length the middle belongs to the first half.
2. Detach the second half with `slow->next = nullptr` and reverse it with the usual three-pointer loop.
3. Interleave: `front->next = back; back->next = nextFront;` then advance both. The reversed half is never longer than the first half, so loop on `back`.

Time O(n), space O(1).

## C++ walkthrough
The lists of length 0 and 1 return early, which also guarantees `fast->next` is safe to read. Saving `nextFront` and `nextBack` **before** relinking is the whole discipline of pointer rewiring: after `front->next = back` the old successor is unreachable otherwise. Cutting the list in step 2 is essential: without it the last front node still points into the second half and the merged list loops.

## Common bugs
Not cutting the first half (the result is a cycle); reversing from `slow` instead of `slow->next` (the middle node is used twice); merging without reversing (`1 3 2 4`); an off-by-one split that yields a back half longer than the front half; losing `nextFront` before relinking.

## Follow-ups
Do it recursively and discuss stack depth for 100000 nodes; do it on a doubly linked list (two pointers meeting in the middle, no reversal); check whether a list is a palindrome with the same split-and-reverse trick; undo the weave.

## Similar problems
Reorder List (LeetCode 143) is this problem. Palindrome Linked List (LeetCode 234) reuses the split-and-reverse step, Reverse Linked List (LeetCode 206) and Merge Two Sorted Lists (LeetCode 21) are its two building blocks.
