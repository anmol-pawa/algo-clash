# Locker Board

A hall has lockers numbered by arbitrary non-negative integers (up to a billion), far too many to give each its own hook. Build the board yourself **without** `unordered_map`, `map`, `set` or any other library associative container (`vector`, `list` and `forward_list` are fine).

Design `LockerBoard` with these operations, each in **average O(1)** time:

- `void put(int key, int val)`: store `val` in locker `key`. If the locker already holds a value, replace it.
- `int get(int key)`: return the value in locker `key`, or `-1` if the locker is empty.
- `void remove(int key)`: empty locker `key`. Does nothing if it is already empty.
- `int count()`: return how many lockers currently hold a value.

## Example

```
put(7, 70)    get(7) -> 70
put(7, 71)    get(7) -> 71     (replaced, not duplicated)
put(1000007, 5)               count() -> 2
remove(7)     get(7) -> -1     count() -> 1
remove(7)                      count() -> 1
```

## Constraints

- Up to `200000` operations in total.
- `0 <= key <= 1000000000`, `0 <= val <= 1000000000`.
