## Signals
"Does this linked list loop?" with a constant-memory requirement is the fast and slow runner pattern (Floyd's tortoise and hare). The wording "tail connects to a previous node" is the giveaway.

## Brute force
Store every visited node's **address** in a hash set. The first time you meet a node already in the set, there is a cycle; reaching `nullptr` means there is none. O(n) time and O(n) space. Do not store values: duplicates would produce false positives.

## Key insight
Run two cursors at different speeds. In a cycle the faster cursor closes the gap by one node per step, so it must land on the slower one. In a straight list the faster one reaches the end first.

## Optimal
Set `slow = fast = head`. While `fast` and `fast->next` are non-null, move `slow` one node and `fast` two nodes, then return `true` if they are the same node. If the loop ends, return `false`. Once both cursors are inside the cycle of length L the distance between them changes by one each step, so they meet within L steps. Total time O(n), space O(1).

## C++ walkthrough
Compare **pointers** (`slow == fast`), never `->val`. Check the meeting after moving, not before, because both cursors start on the head. The `fast != nullptr && fast->next != nullptr` order protects against the empty list and against `fast->next->next` on an odd length.

## Common bugs
Comparing values instead of nodes; testing `slow == fast` before the first move (always true for a non-empty list); reading `fast->next->next` without checking `fast->next`; moving the fast cursor by one so it never gains on the slow one.

## Follow-ups
Return the node where the cycle begins (Loop Gate); return the cycle length; solve it on an implicit list such as the sequence `x -> f(x)`.

## Similar problems
Linked List Cycle (LeetCode 141) is this problem. Linked List Cycle II (LeetCode 142), Find the Duplicate Number (LeetCode 287) and Happy Number (LeetCode 202) reuse the same two-speed idea.
