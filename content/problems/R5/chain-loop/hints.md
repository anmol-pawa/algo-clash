## Nudge
If you only remember values you have seen, equal values will fool you. What can you compare that is unique to each node? And can you detect a loop without remembering anything at all?

## Approach
Two cursors start at the head. One moves one node per step, the other two nodes per step. If the list ends, there is no cycle. If the cursors ever stand on the same node, there is one.

## Key insight
Inside a loop the fast cursor gains exactly one node on the slow cursor per step, so the gap shrinks by one and must hit zero. On a list with no loop the fast cursor simply reaches `nullptr` first.
