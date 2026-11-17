## Signals
Items on a one-way line that cannot pass each other, where the slower one ahead dictates the pace behind it. This is a "next greater" relation in disguise: a train is held up by the nearest train ahead whose arrival time is later than or equal to its own.

## Brute force
A train starts a new convoy exactly when it would arrive strictly later than every train ahead of it. Checking that for each train against all trains ahead is O(n²) time, too slow for 100,000 trains.

## Key insight
Process trains from the front of the line backwards. The convoy a train joins is decided only by the convoy directly ahead, whose arrival time is the maximum of all the empty-track times in front. So scanning in that order, a train either arrives later than that maximum (a new convoy) or not (absorbed, nothing changes).

## Optimal
Sort train indices by `start` descending. Keep a stack of convoys, each stored as its remaining distance `d` and speed `s`. For the next train with `(d, s)`: if the stack is empty, or its time is strictly later than the top convoy's (`d * s_top > d_top * s`), push it. Otherwise it merges and nothing is pushed. The answer is the stack size. Sorting dominates: O(n log n) time and O(n) space.

## C++ walkthrough
Avoid floating point: two different times can be as close as 10^-12 apart and a tie must be detected exactly, because a catch-up at the depot counts as joining. Cross-multiplying keeps everything in `long long` (at most 10^9 · 10^6 = 10^15). Sort an index array with a comparator on `start`, rather than sorting two arrays separately. The strict `>` is what makes an exact tie merge.

## Common bugs
Counting distinct arrival times without sorting by position first; comparing with `>=` so a tie at the depot makes a new convoy; computing the time in `float` or in `int` products; forgetting that the empty input has zero convoys.

## Follow-ups
How many convoys exist after exactly `T` hours? Allow trains to join mid-journey at different speeds. What changes if overtaking is allowed on a two-lane track?

## Similar problems
Car Fleet (LeetCode 853) is this problem.
