## Signals
"Many rows, pick one coordinate shared by as many as possible" is frequency counting over a derived key. The key here is the prefix sum, a boundary position.

## Brute force
Collect every interior boundary position that appears in any row, then for each candidate scan every row to see whether it has an edge there. With B total bricks and R rows that is O(B · B) in the worst case (or O(B · R) with a set per row), far too slow at 20,000 bricks and 10,000 rows when positions are all distinct.

## Key insight
A row with an edge at `x` costs the line nothing; every other row costs exactly one brick. So crossings at `x` equal `R - (rows with an edge at x)`, and minimising crossings means maximising the number of rows that share an edge position.

## Optimal
For each row, compute prefix sums of its widths, skipping the last (the right wall). Increment `edges[prefix]` for each. The answer is `R - max(edges)`; when there are no interior edges the maximum is 0 and the answer is `R`. Time O(B), space O(B) for the map.

## C++ walkthrough
Positions are `long long` because a row's total can pass 2^31 even though each brick fits an `int`. Each row has distinct prefix sums (widths are positive), so one row never counts the same edge twice. `unordered_map<long long,int>` with `++edges[pos]` increments and returns in one expression; for adversarial inputs you could use a sorted vector of all positions and count runs instead.

## Common bugs
Including the final prefix sum (the wall itself) so a single column looks free; overflowing `int` on the running sum; returning the best count instead of `R - best`.

## Follow-ups
What if the line may also be diagonal? What if bricks may be removed from the middle of a row? How would you stream rows without storing them?

## Similar problems
Brick Wall (LeetCode 554) is this problem.
