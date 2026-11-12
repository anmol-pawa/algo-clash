# Ring Lane

A drive-through has room for exactly `capacity` cars in a single lane, and a car that is served frees its spot for the next arrival. Build this lane as a **circular queue** backed by one fixed-size array: do not use `queue`, `deque` or `list`, and do not shift elements.

Design `RingLane` with these operations, each in **O(1)** time:

- `RingLane(int capacity)`: create an empty lane.
- `bool offer(int val)`: a car joins the back of the lane. Return `true` if it fit, `false` if the lane was full.
- `bool poll()`: the car at the front leaves. Return `true` if a car was served, `false` if the lane was empty.
- `int front()`: the car number at the front, or `-1` if the lane is empty.
- `int back()`: the car number at the back, or `-1` if the lane is empty.
- `bool empty()`: `true` if no car is waiting.
- `bool full()`: `true` if `capacity` cars are waiting.

## Example

```
RingLane(2)
offer(7)  -> true
offer(8)  -> true
offer(9)  -> false   (full)
front()   -> 7
poll()    -> true
offer(9)  -> true    (reuses the freed slot)
back()    -> 9
front()   -> 8
```

## Constraints

- `1 <= capacity <= 100000`
- `0 <= val <= 1000000000`
- Up to `200000` operations in total.
