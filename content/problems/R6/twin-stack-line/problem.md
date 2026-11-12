# Twin Stack Line

A ticket booth has only two stacks to work with, yet customers must be served **first come, first served**. Build a queue out of two stacks.

Design `TwinStackLine` with these operations, each in **amortised O(1)** time (a single call may be slower, but any run of `m` calls must cost O(m) in total):

- `void enqueue(int val)`: a customer joins the back of the line.
- `int dequeue()`: remove the customer at the front and return their number.
- `int front()`: return the number at the front without removing it.
- `bool empty()`: return `true` if nobody is waiting.

`dequeue` and `front` are only called when the line is not empty. Use two `stack` or `vector` containers as the only storage; do not use `queue` or `deque`.

## Example

```
enqueue(1)
enqueue(2)
front()   -> 1
dequeue() -> 1
enqueue(3)
dequeue() -> 2
dequeue() -> 3
empty()   -> true
```

## Constraints

- Up to `200000` operations in total.
- `-1000000000 <= val <= 1000000000`.
