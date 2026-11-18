## Signals
"Deep copy" of a linked structure that has a second pointer which can go anywhere, forward or backward. Copying by walking `next` once fails because the twin of the shortcut target may not exist yet, and values repeat, so you cannot use a value as the identity of a node. You need a way to answer "which twin belongs to this original?" for any original node.

## Brute force
For every lantern, scan the whole original chain to find the index its shortcut points at, then link the twin at that index. It is correct but O(n^2): about 10^10 steps for 100000 lanterns when the shortcuts point far away.

## Key insight
Two clean answers, both O(n) time.

1. **Hash map** from original node pointer to twin pointer. Pass one creates every twin and records it; pass two wires `next` and `random` through the map. O(n) extra space. Key by pointer, never by value.
2. **Weave and unzip**, O(1) extra space beyond the output. Insert each twin right after its original. Now the twin of any original `x` is `x->next`, so `twin->random = x->random->next` needs no lookup. Then split the chain back into two, restoring every original `next`.

## Optimal
The weave version, three passes:
1. For each original `cur`: create `twin(cur->val)`, set `twin->next = cur->next`, `cur->next = twin`; continue from `twin->next` (the next original).
2. For each original `cur`: if `cur->random` exists, `cur->next->random = cur->random->next`.
3. Unzip: for each original `cur`, `twin = cur->next`; `cur->next = twin->next`; if that is not null, `twin->next = twin->next->next`.

Time O(n), space O(1) not counting the n new nodes you must return.

## C++ walkthrough
Pass two must run completely before pass three starts. If you unzip while wiring shortcuts, a shortcut target may already have lost its twin link. In pass three read `twin->next` before you overwrite `cur->next`, and guard the last node, whose twin has no successor. The empty chain returns `nullptr` before any of this. Allocating `n` nodes with `new` is expected here; ownership of the twin chain passes to the caller.

## Common bugs
Copying `random` as is, so twins point into the original chain; weaving but not unzipping, which leaves the original corrupted; keying a hash map by value (equal values collapse twins together and create cycles); the quadratic rescan per shortcut.

## Follow-ups
Do the same for a graph (Clone Graph: map original to clone, BFS or DFS); copy a list where each node also has a `child` list pointer; deep-copy a binary tree with a `random` pointer. Explain the trade-off between the O(n) map (simple, never touches the input) and the O(1) weave (temporarily mutates the input, so it is unsafe if other threads read the list).

## Similar problems
Copy List with Random Pointer (LeetCode 138) is this problem. Clone Graph (LeetCode 133) uses the same old-to-new map idea.
