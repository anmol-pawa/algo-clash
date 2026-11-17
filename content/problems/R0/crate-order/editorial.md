## Signals
A custom ordering over items that need to remember where they came from, with a tie-break rule.

## Brute force
Pick the heaviest unused crate (smallest number on a tie), `n` times. Each pick scans all crates, so O(n^2): about 10^10 steps at n = 10^5, far too slow. It is the checker for small cases.

## Key insight
The answer is just the crates sorted by a total order: heavier first, then smaller number. If the comparison breaks every tie, the result is unique, so it does not matter that `std::sort` is unstable. Bundle weight and number in a struct so the number travels with the weight through the sort.

## Optimal
Build `vector<Crate>`, sort with `operator<`, extract ids. Time O(n log n), space O(n).

## C++ walkthrough
The constructor `Crate(int w, int i) : weight(w), id(i) {}` uses a member initialiser list, which initialises the fields directly instead of default-constructing then assigning. `emplace_back(weights[i], i)` builds the crate in place from the constructor arguments. `operator<` is a `const` member function taking `const Crate&`: `sort` calls it on const objects, and it must be a strict weak ordering (never return true for equal elements). `reserve` avoids reallocation while filling. Note `operator<` here deliberately means "comes first", which for descending weight uses `>` on the weight.

## Common bugs
Flipping the weight comparison; reversing the tie-break; sorting only by weight and trusting the tie order; writing `<=` in `operator<`, which breaks the strict weak ordering rule and can crash `sort`; forgetting `const` on the member function, which fails to compile inside `sort`.

## Follow-ups
Return the ranks (position of each crate) instead of the order. Use `stable_sort` with a weight-only comparator. Use a `priority_queue<Crate>` to lift crates one at a time and note which direction `priority_queue` treats as "largest".

## Similar problems
Relative Ranks (LeetCode 506).
