## Signals
"Things that merge and then move together", "the one in front limits the one behind" and no overtaking. The order along the road matters, so sort by position first. After sorting this is a monotonic-stack (or running maximum) question about arrival times.

## Brute force
For each truck, check every truck ahead of it: it leads its own convoy exactly when its lone arrival time is strictly greater than all of theirs. Correct, but a road where nobody ever merges needs every pair checked: O(n²) time, O(1) extra space, about 5 billion comparisons for 100000 trucks.

## Key insight
A truck's lone arrival time is `(target - position) / speed`. The truck in front can only slow someone behind it, never speed them up, so the convoy that truck belongs to arrives at the maximum lone time of everything ahead. A truck forms a new convoy exactly when its lone time is strictly greater than that maximum. Equal times mean it joins at the depot, which the statement counts as one convoy.

## Optimal
Sort indices by position, descending. Keep `leadDist` and `leadSpeed` for the convoy in front (its time is `leadDist / leadSpeed`). For each truck with `dist = target - position` and `spd = speed`: if `dist * leadSpeed > leadDist * spd`, it arrives strictly later, so increment the count and make it the new lead. This is the stack version of the problem with the stack collapsed to its top, since nothing below the top is ever consulted. Sorting dominates: O(n log n) time, O(n) space for the index array.

## C++ walkthrough
Sort an index array (or pairs) rather than the two input vectors separately, so position and speed stay together. Never divide: `dist * leadSpeed` can reach 10^9 · 10^9 = 10^18, which fits in `long long` (about 9.2 · 10^18) but overflows `int`; floating-point division risks wrong ties for large values. Use strict `>`, because a tie is a merge.

## Common bugs
Not sorting (trusting the input order); counting a tie as a separate convoy (`>=` instead of `>`); multiplying in `int`; comparing speeds instead of arrival times; sorting ascending and then merging in the wrong direction.

## Follow-ups
Return the size of the largest convoy. Allow trucks to start at the same mile. Trucks that can overtake (then every truck is its own convoy). Do it without sorting if positions are known to be small integers (counting sort by position).

## Similar problems
Car Fleet (LeetCode 853) is this problem. Daily Temperatures (LeetCode 739) is the stack idea on a different question; Asteroid Collision (LeetCode 735) is the stack of things that merge or destroy each other.
