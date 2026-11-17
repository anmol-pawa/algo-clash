## Signals
Two **sorted** sequences that must become one sorted sequence is the merge step of merge sort. Linked lists make it even nicer: you can splice nodes instead of copying them.

## Brute force
Dump both lists into a `vector`, sort it, and rebuild a list. It is correct, but it costs O((n + m) log(n + m)) time and O(n + m) extra space, and it ignores the fact that both inputs are already sorted.

## Key insight
The smallest unmerged value is always at the front of one of the two lists, so a two-pointer walk finds the next output node in O(1). A dummy head removes the "is this the first node?" branch.

## Optimal
Create `anchor`, a stack-allocated dummy node, and `tail = &anchor`. While both lists are non-empty, link the node with the smaller value (`a` on ties) after `tail` and advance. Finally attach whichever list still has nodes. Invariant: everything reachable from `anchor.next` up to `tail` is sorted and no larger than any unmerged node. Time is O(n + m), extra space O(1).

## C++ walkthrough
A local `ListNode anchor;` is fine because it is never returned, only `anchor.next` is, and it points at nodes owned by the caller. Taking from `a` on ties (comparing `b->val < a->val`) keeps equal values in their original relative order. The leftover attach `(a != nullptr) ? a : b` also covers the cases where one or both lists start empty.

## Common bugs
Forgetting to attach the leftover list; returning `anchor` instead of `anchor.next`; dereferencing a null list in the comparison; creating new nodes and leaking the old ones; losing the order of equal values (matters when nodes carry more data).

## Follow-ups
Merge `k` sorted lists with a min-heap or by pairwise merging in rounds; merge in descending order; do it recursively and state the stack depth; merge without a dummy node by choosing the head first.

## Similar problems
Merge Two Sorted Lists (LeetCode 21) is this problem. Sort List (LeetCode 148) uses it as its merge step, and Merge k Sorted Lists (LeetCode 23) generalises it.
