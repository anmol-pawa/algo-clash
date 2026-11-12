## Signals
"Fixed-size buffer, oldest item leaves first, freed space is reused." That is a ring buffer: the storage never moves, the indices do. It shows up in streaming, logging and producer-consumer code.

## Brute force
Store the queue in a vector and `erase(begin())` on every `poll`. Each poll shifts up to `capacity` elements: O(capacity) per call, about 10^10 total moves when the lane holds 100000 cars and 100000 polls follow. It is correct but too slow.

## Key insight
Leave the elements where they are and move the *window*: `head` is the index of the front and `size` is how many cars are in the lane. The slot after the last car is `(head + size) % capacity`. Tracking `size` explicitly resolves the empty-versus-full ambiguity that `head == tail` has.

## Optimal
Allocate `vector<int> slots(capacity)`. `offer`: if `size == capacity` return false; write `slots[(head + size) % capacity] = val`, increment `size`. `poll`: if `size == 0` return false; `head = (head + 1) % capacity`, decrement `size`. `front`: `size == 0 ? -1 : slots[head]`. `back`: `size == 0 ? -1 : slots[(head + size - 1) % capacity]`. Every operation is O(1); the space is O(k) for capacity k.

## C++ walkthrough
Use `size_t` or `int` consistently; `head + size` is at most `2 * capacity`, so `int` is safe here. Mark the read-only methods `const`. The `%` is cheaper to get right than the alternative `if (++head == capacity) head = 0`, but both are fine in an interview; say why you chose one.

## Common bugs
Using `head == tail` for both empty and full; computing `back` as `slots[tail]` (one past the last car) instead of one before it; forgetting to wrap `head` after a poll; letting `offer` succeed when the lane is full and overwriting the front car; returning `0` instead of `-1` for an empty lane.

## Follow-ups
The same lane for a *deque* (add and remove at both ends: decrement `head` with a wrap). A ring buffer that overwrites the oldest on overflow. A thread-safe single-producer single-consumer queue using two atomic indices.

## Similar problems
Design Circular Queue (LeetCode 622) is this problem. Design Circular Deque (LeetCode 641) extends it, and Moving Average from Data Stream (LeetCode 346) uses a ring window.
