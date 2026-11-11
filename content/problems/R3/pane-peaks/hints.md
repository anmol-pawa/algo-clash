## Nudge
When the frame slides, one pane leaves on the left and one arrives on the right. If a pane is hotter than an older pane that is still in the frame, can the older pane ever be the answer again?

## Approach
Keep a deque of pane indices whose readings go from hottest (front) to coolest (back). Before adding pane `i`, pop every cooler pane off the back. Then add `i`. If the front index has slid out of the frame, pop it. Once the first frame is complete, the front is the answer for that frame.

## Key insight
An older pane that is not hotter than a newer one is useless: the newer one stays in every frame the older one does, and is at least as hot. So the deque stays sorted and every index is pushed and popped at most once, giving O(n) instead of O(n * width). Store indices, not values, so you can tell when the front has expired.
