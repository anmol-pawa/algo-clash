# Burrow Cache

A burrow keeps only a few treasures near the door. Each treasure has a **key** (its label) and a **value** (how shiny it is). When the burrow is full and a new treasure arrives, the one that was **touched longest ago** is thrown out to make room. A treasure is "touched" whenever it is looked up or stored.

Design `BurrowCache` with these operations, each in **O(1)** average time:

- `BurrowCache(int capacity)`: create an empty burrow that holds at most `capacity` treasures.
- `int get(int key)`: return the value stored for `key`, or `-1` if it is not in the burrow. A successful `get` counts as touching the treasure.
- `void put(int key, int value)`: store `value` under `key`. If `key` is already present, replace its value; either way the treasure is now the most recently touched. If storing a **new** key would exceed `capacity`, first throw out the treasure that was touched longest ago.

## Example

```
BurrowCache(2)
put(1, 10)
put(2, 20)
get(1)      -> 10   (1 is now the freshest)
put(3, 30)          (full: throws out 2, the stalest)
get(2)      -> -1
put(1, 11)          (update, nothing thrown out)
put(4, 40)          (full: throws out 3)
get(3)      -> -1
get(1)      -> 11
get(4)      -> 40
```

## Constraints

- `1 <= capacity <= 100000`
- `0 <= key <= 1000000000`, `0 <= value <= 1000000000`
- Up to `200000` operations in total.
- Keys can be huge, so a plain array indexed by key will not fit.
