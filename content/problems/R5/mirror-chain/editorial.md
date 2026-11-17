## Signals
"Reads the same in both directions" on a **singly** linked list with an O(1) memory follow-up. A list cannot be walked backwards, so one half has to be flipped. This is the same split-and-reverse toolkit as Weave Ends, ending in a comparison instead of a merge.

## Brute force
Copy the values into a `vector` and compare it with its reverse, or use two indices from both ends. O(n) time, O(n) memory. It is the right answer when the interviewer does not ask for constant space, and a good first sentence to say out loud. A quadratic variant walks from the head to node `n-1-i` for every `i`: O(n^2) and too slow for 100000 nodes.

## Key insight
Mirror means `a[i] == a[n-1-i]` for every `i`. If the second half is reversed in place, then the pair (`i`, `n-1-i`) is simply the i-th node of each half, and both halves can be walked forwards at the same time.

## Optimal
1. Runners: `while (fast->next && fast->next->next)` leaves `slow` on the last node of the first half. An odd middle stays in the first half.
2. Reverse the list that starts at `slow->next` with the three-pointer loop.
3. Walk `left` from `head` and `right` from the reversed half, comparing values. The reversed half is the shorter or equal one, so loop on `right`.
4. Reverse the second half again and reattach it to `slow->next`. The function now leaves the list exactly as it was found.

Time O(n), space O(1).

## C++ walkthrough
Lists of length 0 and 1 return early, which also makes `fast->next` safe to read. Remember the verdict in a `bool` and break out of the comparison loop, but do not `return` from inside it: the restore step must still run. A `static` helper `reverse` keeps the main function short and reads well in an interview.

## Common bugs
Reversing without a restore step (mutates the caller's list, which many interviewers consider a defect); the wrong runner condition (`fast && fast->next` leaves `slow` on the second middle of an even list, so a pair is skipped); comparing the second half without reversing it; comparing sums or multisets instead of order; returning from the middle of the loop before restoring.

## Follow-ups
Do it recursively with a pointer that advances while the call stack unwinds, and discuss stack depth at 100000 nodes. Solve it for a doubly linked list with two pointers walking inwards. Ask how you would check a palindrome in a stream, and when a rolling hash helps.

## Similar problems
Palindrome Linked List (LeetCode 234) is this problem. Valid Palindrome (LeetCode 125) is the array version. Reorder List (LeetCode 143) uses the same split and reverse, and Reverse Linked List (LeetCode 206) is the building block.
