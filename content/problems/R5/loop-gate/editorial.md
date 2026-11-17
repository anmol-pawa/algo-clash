## Signals
"Where does the cycle begin?" with constant memory. If you already know how to detect a cycle with two runners (Chain Loop), the question is how to turn the meeting point into the gate.

## Brute force
Walk from the head and store each node's address in a hash set; the first node already in the set is the gate. O(n) time, O(n) space. It is correct and a good first answer, but the constant-memory version is what the interviewer is looking for.

## Key insight
Name three lengths: `a` is the number of nodes before the gate, `b` is how far past the gate the runners meet, and `L` is the cycle length. When they meet, slow has moved `a + b` steps and fast has moved `2(a + b)`. Fast has made some extra whole laps, so `2(a + b) - (a + b) = a + b` is a multiple of `L`, say `k·L`. Rearranged, `a = k·L - b = (k - 1)·L + (L - b)`. Starting at the meeting point (b past the gate), walking `L - b` steps reaches the gate, and `(k - 1)` more laps leave you on the gate again. So `a` steps from the meeting point ends exactly at the gate, and `a` steps from the head also ends at the gate. Two walkers moving one node at a time therefore meet **at** the gate.

## Optimal
Phase 1: `slow` and `fast` start at the head; move 1 and 2 steps until they are equal (return `nullptr` if `fast` or `fast->next` is null). Phase 2: set `finder = head`; while `finder != slow`, advance both by one node. Return `finder`. Time O(n): phase 1 takes at most `a + L` steps, phase 2 takes `a`. Space O(1).

## C++ walkthrough
Phase 2 moves `finder` and `slow` **together by one node**; moving `fast` by two there breaks the equal-distance argument. Compare pointers, never values (duplicates are common in the tests). A self-loop (`[7]@0`) works with no special case: the runners meet at the node, then `finder == slow` immediately.

## Common bugs
Returning the meeting point instead of the gate; restarting `slow` at the head but still moving `fast` by two; comparing values; forgetting the `nullptr` return when there is no cycle; a quadratic "for every node, walk the loop" check that times out on 100000 nodes.

## Follow-ups
Compute the cycle length (keep walking from the meeting point until you return to it); find the length of the tail; solve Find the Duplicate Number, where the list is the implicit sequence `i -> nums[i]`; remove the cycle by cutting the last node's link.

## Similar problems
Linked List Cycle II (LeetCode 142) is this problem. Linked List Cycle (LeetCode 141), Find the Duplicate Number (LeetCode 287) and Happy Number (LeetCode 202) are the closest relatives.
