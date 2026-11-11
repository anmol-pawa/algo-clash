## Signals
"The best value in every window of a fixed width", with output size about `n`. Re-scanning each window is O(n * width); a heap handles it in O(n log n) but needs lazy deletion. The shape "candidates that can never win again can be thrown away the moment a better, later one arrives" is the cue for a monotonic deque.

## Brute force
For each frame start, loop over the `width` panes and take the maximum. O(n * width) time, O(1) extra space besides the answer. At `n = 100000` and `width = 50000` that is about 2.5 * 10^9 comparisons, well over the time limit.

## Key insight
Take two panes `a < b` (indices) in the same frame. If `heat[a] <= heat[b]`, then `a` leaves the frame before `b` does and is never hotter, so `a` can be discarded forever. The panes worth remembering are therefore a sequence whose readings strictly decrease as the index grows. The front is the oldest and hottest; it is the frame maximum.

## Optimal
Keep a `deque<int>` of indices with strictly decreasing `heat`. For each new index `i`: pop from the back while the back is not hotter than `heat[i]`; push `i`; pop the front if it is `<= i - width` (at most one index expires per step); once `i >= width - 1`, append `heat[front]`. Each index enters and leaves once: O(n) time, space O(k) where k = `width`.

## C++ walkthrough
Store indices because the expiry test needs positions, and the value is one lookup away. `<=` when popping keeps the deque strictly decreasing, so ties keep the newest pane, which leaves last. `answer.reserve(n - width + 1)` avoids reallocations; the number of frames is `n - width + 1`. `std::deque` is fine here; a `vector` plus a head index also works and is slightly faster.

## Common bugs
Forgetting to expire the front (the answer then uses a pane outside the frame); `<` instead of `<=` in the expiry check (off by one); `if` instead of `while` when popping the back; starting to record at `i >= width` and losing the first frame; storing values and then being unable to tell what expired; rescanning each frame and timing out.

## Follow-ups
The minimum of every window (flip the comparison). Both max and min at once for "longest stretch whose max minus min is at most a limit" (two deques plus a window). The same idea as a DP optimisation: best of the previous `k` states. Do it with a heap and lazy deletion, and compare.

## Similar problems
Sliding Window Maximum (LeetCode 239), Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (LeetCode 1438).
