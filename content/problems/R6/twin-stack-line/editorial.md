## Signals
"Make a queue (FIFO) from stacks (LIFO)" works because reversing twice restores the original order. Two reversals, one per stack, hand customers to the front in arrival order.

## Brute force
Hold everything in one vector and erase from the front on `dequeue`. Each dequeue shifts the rest: O(n) time per call, so 100000 enqueues followed by 100000 dequeues cost billions of moves.

## Key insight
Pouring stack A into stack B reverses it. A customer who has been poured once is in serving order, and is never poured again. If you only pour when B is empty, every customer is moved at most once, so any `m` operations do O(m) total work even though a single `dequeue` can cost O(n).

## Optimal
`inbox` takes every `enqueue`. `dequeue` and `front` first call `refill()`, which does nothing if `outbox` has customers, otherwise moves all of `inbox` over. Then read or pop `outbox.back()`. `empty()` is true only if both stacks are empty. Time O(1) amortised per operation (each customer moves at most once); space O(n).

## C++ walkthrough
`vector<int>` with `push_back`, `back` and `pop_back` is a stack. `front()` is not `const` here because it may refill; `empty()` stays `const`. The guard `if (!outbox_.empty()) return;` is the whole correctness argument, so keep it first and comment it.

## Common bugs
Refilling while the outbox is non-empty (wrong order); `empty()` that only checks one stack; refilling inside `enqueue` (O(n) every time); forgetting that `front()` also needs the refill.

## Follow-ups
Build a stack from two queues. Build a queue from **one** stack using recursion (the call stack is the second stack). Give worst-case O(1) operations with incremental transfer (a de-amortised queue). Combine with Gauge Stack to get a queue that reports its minimum.

## Similar problems
Implement Queue using Stacks (LeetCode 232) is this problem. Implement Stack using Queues (LeetCode 225) is the mirror image.
