## Signals
A large array that never changes, a long list of queries about it, and a "sorted" promise in the constraints. Sorted data plus many lookups means binary search; many calls on a big container means you must not copy it.

## Brute force
For each query, scan all shelves and count the lower ones. That is O(n * m) = 10^10 steps at the limits, far too slow, but it makes a trustworthy checker on small inputs.

## Key insight
Strictly lower than `h` is exactly the elements before the first element that is `>= h`. That position is what `lower_bound` finds, in O(log n). The second lesson is about calls: a helper declared `int f(vector<int> v, int h)` copies the vector every time it is called, so an O(log n) search silently becomes O(n) per query and the program times out even though the algorithm is right.

## Optimal
For each query, one `lower_bound` on the shelves passed by const reference. Time O(m log n), space O(m) for the answer.

## C++ walkthrough
`const vector<int>&` binds to the caller's vector without copying and forbids modifying it. `lower_bound(begin, end, h) - begin` subtracts two random-access iterators to get an index. `static` on the helper means it is a function of the class, not of an object: it has no `this`, which is right for a pure helper. `answer.reserve(queries.size())` avoids reallocations; it is an optimisation, not a requirement.

## Common bugs
`upper_bound` (counts shelves equal to the query too); passing the vector by value into a helper; scanning linearly; using `int` for iterator differences without a cast, which warns on some compilers.

## Follow-ups
Count shelves lower than or equal to `h`. Count shelves in a half-open range `[a, b)`. Handle an unsorted shelf list by sorting a copy once.

## Similar problems
Search Insert Position (LeetCode 35).
