## Nudge
Comparing the first bead with the last is easy on an array and impossible to do directly on a singly linked list. What could you do to the back half so that it can be read from its far end?

## Approach
Find the middle with fast and slow runners. Reverse the second half in place. Walk the first half and the reversed second half together and compare values. Stop when the second half runs out.

## Key insight
The reversed second half is never longer than the first half, so the loop only needs to follow it. For an odd length the centre bead is its own mirror and can stay in the first half. Reverse the second half back afterwards so the caller's list is unchanged. Time O(n), space O(1).
