## Nudge
The answer takes one node from the front, then one from the back, over and over. A singly linked list cannot walk backwards. How could the back half be made to come out in reverse order?

## Approach
Split the list in the middle with fast and slow runners. Reverse the second half in place. Then merge: take one node from the first half, then one from the reversed second half, until the second half is used up.

## Key insight
Three solved sub-problems chained together: find the middle (runners), reverse a list (three pointers), merge two lists (alternate instead of compare). Cut the first half off (`slow->next = nullptr`) before merging so the chains never loop back on themselves. Time stays O(n) and extra space O(1).
