# Gauge Stack

A workshop keeps a stack of pressure readings. A foreman wants to know, at any moment, the **lowest reading currently on the stack**, without scanning it.

Design `GaugeStack` with these operations, each in **O(1)** time:

- `void push(int val)`: put a reading on top.
- `void pop()`: remove the top reading.
- `int top()`: return the top reading without removing it.
- `int low()`: return the smallest reading currently on the stack.

`pop`, `top` and `low` are only called when the stack is not empty.

## Example

```
push(5)
push(3)
push(3)
push(8)
low() -> 3
pop()            removes 8
pop()            removes a 3
low() -> 3       (the other 3 is still there)
pop()            removes the last 3
low() -> 5
top() -> 5
```

## Constraints

- Up to `200000` operations in total.
- `-1000000000 <= val <= 1000000000`.
