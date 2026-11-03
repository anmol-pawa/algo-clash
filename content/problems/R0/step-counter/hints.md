## Nudge
The object has to remember three things between calls. Which three? Put each in a private member.
## Approach
Store `limit`, `start` and the current `total` as members. Set them in the constructor with a member initialiser list: `StepCounter(int limit, int start) : limit(limit), start(start), current(start) {}`. In `add`, add the amount to `current`, clamp it with `max(0, min(current, limit))`, and return it. `reset` copies `start` back into `current`.
## Key insight
In `limit(limit)` the member is on the left and the parameter on the right, and C++ reads that correctly. But inside the body, `limit = limit;` assigns the parameter to itself and leaves the member untouched. Use the initialiser list, or write `this->limit = limit;`.
