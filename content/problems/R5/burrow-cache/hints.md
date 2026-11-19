## Nudge
Two jobs fight each other: finding a treasure by key must be instant, and knowing which treasure is the stalest must also be instant, even after a treasure in the middle gets touched. What structure keeps things in order and lets you pull one out of the middle in O(1)? What structure finds it by key in O(1)?

## Approach
Keep the treasures in a **doubly linked list** ordered from freshest (front) to stalest (back), plus a **hash map** from key to the list node. `get`: look up the node, move it to the front, return its value. `put`: if the key exists, update the value and move it to the front; otherwise, if the burrow is full, remove the back node (and erase its key from the map), then push the new node to the front and record it in the map.

## Key insight
To evict the back node you need its **key** to erase it from the map, so each list node must store the key as well as the value. In C++ `std::list` plus `splice(begin, list, it)` moves an element to the front in O(1) **without invalidating any iterator**, so the map can hold `list::iterator` values safely.
