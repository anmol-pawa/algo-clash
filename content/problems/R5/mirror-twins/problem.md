# Mirror Twins

A cave guide keeps a chain of lanterns. Every lantern has a `next` link to the lantern after it, and also a **shortcut** link to any lantern in the chain (possibly itself, possibly one earlier or later), or to nothing.

The guides want a **twin chain**: a brand-new chain with the same number of lanterns, the same values, and the same links, but built from **new nodes only**. The twin's `next` of the i-th lantern is the twin of the (i+1)-th, and the twin's shortcut of a lantern must point to the **twin** of whatever the original's shortcut points to, never to an original lantern.

Given the head of the original chain, return the head of the twin. The original chain must be left exactly as it was.

The node type is provided:

```cpp
class Node {
public:
    int val;
    Node* next;
    Node* random;   // the shortcut
    Node(int _val) : val(_val), next(nullptr), random(nullptr) {}
};
```

## How the chain is written

Each lantern is `[val, i]`, where `i` is the **index** of the lantern its shortcut points to, or `null` for no shortcut. The chain is the list of these pairs in `next` order. The judge prints your twin chain in the same format. It shows a message instead, and the test fails, if your chain reuses an original node, if a shortcut points outside your chain, or if the original chain was changed.

## Examples

- `[[7,null],[13,0],[11,4],[10,2],[1,0]]` gives the same text: five twins, with the shortcuts of lanterns 1 and 4 pointing back to lantern 0 and so on.
- `[[1,1],[2,1]]` gives `[[1,1],[2,1]]`: lantern 0's shortcut points forward, lantern 1's points at itself.
- `[]` gives `[]`.

## Constraints

- `0 <= number of lanterns <= 100000`
- `-1000000000 <= val <= 1000000000`
- Values may repeat, so a value does not identify a lantern.
- A shortcut is `null` or an index in `0 .. n-1`.
