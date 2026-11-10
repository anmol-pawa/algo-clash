## Nudge
Checking every pair is O(n^2). Start with the widest pair and think about which of its two posts is worth keeping when you shrink the width.

## Approach
Begin with posts at both ends. Record the capacity, then move the pointer at the **shorter** post inward. Repeat until the pointers meet.

## Key insight
The shorter post limits every basin it can form with any closer partner (they are narrower and cannot be taller than the shorter one), so that post has already given its best result and can be discarded safely.
