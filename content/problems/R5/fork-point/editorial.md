## Signals
"Where do two lists merge?" with a constant-memory requirement. Look for node identity (the shared tail is the same objects, not equal values) and for two walkers whose lengths differ.

## Brute force
Put every node address of `a` in a hash set, then walk `b` and return the first node that is in the set. O(n + m) time, O(n) space; correct and a good first answer. The nested-loop version (compare every pair of nodes) is O(n·m) and times out at 100000 nodes each.

## Key insight
Write `x` for the nodes only `a` owns, `y` for the nodes only `b` owns and `z` for the shared nodes. If `a` and `b` have different lengths, two walkers started together reach the fork at different times. Making each walker continue into the *other* list when it falls off its own end fixes that: walker one walks `x + z` and then `y` more nodes to reach the fork, walker two walks `y + z` and then `x`. Both have taken `x + y` steps from the start of the second pass, so they stand on the fork together. If the lists are disjoint (`z = 0`), both walkers step to `nullptr` after exactly `x + y` steps and the loop ends with `p == q == nullptr`.

An alternative with the same cost: measure both lengths, skip the difference at the head of the longer list, then walk both in lock step.

## Optimal
`p = a`, `q = b`; while `p != q`: `p = p ? p->next : b`, `q = q ? q->next : a`. Return `p`. Time O(n + m): each walker takes at most `n + m + 1` steps. Space O(1).

## C++ walkthrough
The switch happens when the pointer is `nullptr` (one step *after* the last node), not when `p->next` is null. That extra null step is what makes disjoint lists end together. Compare pointers; `p->val == q->val` is wrong because the tests contain many equal values. Empty lists work with no special case: if either is empty, the walkers still line up on `nullptr` or on the other list's head.

## Common bugs
Comparing values instead of nodes; jumping to the other list at the last node instead of at `nullptr` (disjoint lists loop forever); returning the shared tail's last node instead of the first shared one; skipping nodes of the shorter list when aligning lengths; an O(n·m) double loop.

## Follow-ups
Do it with length counting instead of the two-pass trick; detect the intersection when one list may also contain a cycle (find each cycle entry first, as in Loop Gate); find the intersection of `k` lists; or solve it when the nodes have `parent` pointers (the same idea on a tree: lowest common ancestor).

## Similar problems
Intersection of Two Linked Lists (LeetCode 160) is this problem. Linked List Cycle II (LeetCode 142), Lowest Common Ancestor of a Binary Tree III (LeetCode 1650) and Merge Two Sorted Lists (LeetCode 21) are close relatives.
