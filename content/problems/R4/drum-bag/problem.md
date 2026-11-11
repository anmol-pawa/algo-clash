# Drum Bag

A raffle drum holds distinct tickets, each with an integer number. A drawer picks a ticket by *slot*, so the drum must keep its tickets in a packed row of slots `0, 1, ..., size-1` and answer "what is in slot `i`?" instantly.

Design `DrumBag` with these operations, each in **average O(1)** time:

- `bool insert(int val)`: if ticket `val` is already in the drum, do nothing and return `false`. Otherwise put it in the **next free slot** (the end of the row) and return `true`.
- `bool erase(int val)`: if `val` is not in the drum, return `false`. Otherwise remove it, and close the gap by **moving the ticket from the last slot into the freed slot** (if the removed ticket was itself last, nothing moves). Return `true`.
- `int slot(int i)`: return the ticket in slot `i`. Always called with `0 <= i < size()`.
- `int size()`: return the number of tickets.

Because the slot rules are fixed, the contents of every slot are fully determined by the sequence of operations.

## Example

```
insert(5) -> true     slots: [5]
insert(8) -> true     slots: [5, 8]
insert(5) -> false
insert(2) -> true     slots: [5, 8, 2]
erase(5)  -> true     slots: [2, 8]      (2 moved into slot 0)
slot(0)   -> 2
size()    -> 2
```

## Constraints

- Up to `200000` operations in total.
- `-1000000000 <= val <= 1000000000`.
