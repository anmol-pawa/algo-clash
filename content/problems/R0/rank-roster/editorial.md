## Signals
A custom ordering over records that carry several fields. In C++ that is `operator<` (or a comparator) on a small struct.

## Brute force
Repeatedly scan for the best remaining player, append it and mark it used. O(n^2). It is the checker; it times out at the upper limit.

## Key insight
Encode the rule once, as the struct's `operator<`: higher score first, then smaller id. `std::sort` then uses it everywhere and needs no extra arguments. Ids are unique, so the order is total and the result is fully determined.

## Optimal
Build the structs, `sort`, read out the ids. Time O(n log n), space O(n).

## C++ walkthrough
The constructor uses a member initialiser list (`: id(id), score(score)`), which constructs the members directly instead of default-constructing and assigning. `operator<` is `const` because sorting compares through const references. `emplace_back(a, b)` builds the `Player` in place from the constructor arguments. `sort` uses `operator<` for ordering, so comparing with `>` on the score is how you say "bigger first".

## Common bugs
Writing `<` on the score (lowest first). Forgetting the tie-break, so equal scores come out in an unspecified order. Tie-breaking by larger id. Returning `true` for equal elements (`<=`), which breaks the strict weak ordering that `sort` requires and can crash it. Forgetting `const` on the operator.

## Follow-ups
Rank by two keys and report each player's position. Keep only the top k with `partial_sort` or a heap. Use a lambda comparator instead of `operator<`.

## Similar problems
Relative Ranks (LeetCode 506).
