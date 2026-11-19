## Nudge
At any moment, which nodes could possibly be the next node of the answer? How many candidates are there, and how do you find the smallest one quickly?

## Approach
Only the front node of each tunnel is a candidate. Keep those fronts in a min-heap ordered by `val`. Repeatedly pop the smallest, link it after a `tail`, and push its successor if it has one. Start `tail` on a dummy node.

## Key insight
The heap never holds more than `k` nodes, so each of the `N` nodes costs one pop and at most one push of O(log k): O(N log k) total with O(k) extra space. Skip empty tunnels when you seed the heap. The alternative with the same bound: merge tunnels in pairs, round after round, like a tournament.
