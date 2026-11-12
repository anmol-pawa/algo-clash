## Nudge
When a car leaves the front of a plain array, you do not have to move everyone. What if the array's end simply joined back up to its start, like a ring?

## Approach
Keep a vector of `capacity` slots, a `head` index (the front car) and a `size` count. The back car lives at `(head + size - 1) % capacity`. `offer` writes at `(head + size) % capacity` and grows `size`; `poll` moves `head` forward by one (wrapping) and shrinks `size`.

## Key insight
With only `head` and `tail` indices, "empty" and "full" look the same (`head == tail`). Store the **count** (or keep one slot unused) so the two states are distinguishable. Wrapping is just `% capacity`.
