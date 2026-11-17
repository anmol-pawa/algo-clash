## Signals
A number stored one digit per node, least significant first, and a request for the sum. The reversed order is a gift: it is exactly the order in which addition by hand proceeds, so a single forward walk does the job.

## Brute force
Rebuild each number as an integer, add, and split the result back into digits. This only works while the values fit a machine word (about 18 decimal digits for `long long`); with 100000-digit inputs it overflows silently. A second option, reversing both lists and adding from the head, also works but costs extra passes you do not need.

## Key insight
Column addition needs only the two digits and a single carry that is always 0 or 1, because `9 + 9 + 1 = 19`. A missing digit counts as 0, and the process ends only when both chains are exhausted **and** the carry is 0.

## Optimal
Use a dummy head and a `tail` pointer. Loop `while (a || b || carry)`: `sum = carry + (a ? a->val : 0) + (b ? b->val : 0)`, append `new ListNode(sum % 10)`, set `carry = sum / 10`, advance the chains that were used. Return `anchor.next`. Time O(max(n, m)); the output is the only memory allocated, so extra space beyond the answer is O(1).

## C++ walkthrough
`ListNode anchor;` on the stack plus `tail = &anchor` avoids a first-node branch; only `anchor.next` is returned. Reading `a->val` only after the null check avoids undefined behaviour on the shorter chain. The result nodes are new, so the inputs stay untouched; reusing the longer input chain in place is a valid follow-up that saves allocation.

## Common bugs
Losing the final carry (`999 + 1`); stopping when the shorter list ends and copying the rest without propagating the carry (`1999 + 1`); converting to `long long` (overflow after 18 digits); appending by walking to the tail each time, which is O(n^2); returning `anchor` instead of `anchor.next`.

## Follow-ups
The digits are stored most significant first (use a stack, or reverse first); add k numbers; multiply two chains; do it with no new allocation by reusing the longer list.

## Similar problems
Add Two Numbers (LeetCode 2) is this problem. Add Two Numbers II (LeetCode 445) stores the digits most significant first, and Plus One Linked List (LeetCode 369) adds a single carry.
