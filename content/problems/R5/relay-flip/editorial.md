## Signals
"Reverse in blocks", "leave the short tail alone" and "O(1) extra space" together say: iterate block by block with pointer rewiring, and decide whether a full block exists before touching anything.

## Brute force
Copy the values into a `vector`, reverse each full chunk of `k` with `std::reverse`, and rebuild a list. It is O(n) time but needs O(n) extra space and allocates every node again, which breaks the "rewire the existing nodes" requirement. A second slow idea finds each block by walking from the head every time, O(n^2 / k) node visits: with `k = 2` and 100000 nodes that is billions of steps.

## Key insight
Treat one block at a time with a clean contract: given `groupPrev` (the node before the block), either a full block of `k` nodes follows it, or the rest of the list stays untouched. Finding out which costs a walk of `k` steps, and the walk is amortised against the reversal that follows, so the whole pass is linear.

## Optimal
Create `anchor` with `anchor.next = head` and set `groupPrev = &anchor`. Loop:

1. Walk `kth` from `groupPrev` forward `k` times. If `kth` becomes null, the remaining nodes form a short block: return `anchor.next`.
2. Remember `groupNext = kth->next`.
3. Reverse the block with `prev = groupNext` and `cur = groupPrev->next`: while `cur != groupNext`, save `cur->next`, point `cur->next = prev`, then step both forward. This leaves the old first node pointing at `groupNext`.
4. The old first node, `groupPrev->next` before rewiring, becomes the tail of the reversed block. Save it as `blockTail`, set `groupPrev->next = kth` (the new front), then `groupPrev = blockTail`.

Invariant: everything up to and including `groupPrev` is final, and `groupPrev->next` is the start of unprocessed nodes. Time is O(n); extra space is O(1).

## C++ walkthrough
Starting the reversal with `prev = groupNext` is the trick that saves a separate "connect the block to the rest" step. The dummy `anchor` lives on the stack and is never returned, only `anchor.next` is. `k` can be as large as the list or larger, so the first `kth` walk simply returns null and the list comes back unchanged; `k == 1` reverses blocks of one node, which is a no-op and works without a special case.

## Common bugs
Reversing a short last block (the problem says to leave it); losing the link to the next block because the reversal started with `prev = nullptr`; moving `groupPrev` to the wrong node (it must become the old first node of the block, now its tail); checking only `k - 1` nodes ahead; forgetting the dummy and special-casing the head; recomputing the length every block.

## Follow-ups
Reverse the short tail as well (a one-line change to step 1); alternate blocks (reverse, keep, reverse, keep); do it recursively and state the O(n / k) stack depth; reverse from the end instead (compute the length first and offset the first block).

## Similar problems
Reverse Nodes in k-Group (LeetCode 25) is this problem. Reverse Linked List (LeetCode 206) is the inner loop, Reverse Linked List II (LeetCode 92) reverses one block, and Swap Nodes in Pairs (LeetCode 24) is the `k = 2` case.
