## Signals
"Remove every element equal to X" with an order guarantee and a large input. The size limit says erasing one element at a time is a trap, and the mention of order rules out swap-with-the-end tricks.

## Brute force
Build a fresh vector: loop over the deck and `push_back` each card that differs from `target`. O(n) time and O(n) space, and obviously correct, so it doubles as the checker. The "brute" in the performance sense is the in-place `erase` loop below.

## Key insight
`erase(it)` moves every element after `it` one slot left, so one call costs O(n) and `k` calls cost O(n * k). Worse, erasing while indexing with `++i` skips the card that slid into the erased slot, which is a correctness bug as well as a speed one. The erase-remove idiom separates the two jobs: `std::remove` compacts the kept cards to the front in one pass and returns the new logical end; a single `erase(newEnd, end)` then cuts the tail.

## Optimal
Erase-remove, or equivalently a write index: for each card that differs from `target`, assign `deck[write++] = card`, then `deck.resize(write)`. Time O(n), extra space O(1) (the parameter is a by-value copy the function may modify). Taking `vector<int> deck` by value is deliberate here: the function wants its own copy to edit.

## C++ walkthrough
`remove(first, last, value)` returns an iterator to the new end but leaves the size unchanged, with unspecified values in the tail. That is why `erase(remove(...), end())` is written as one expression. `resize(write)` after a manual compaction does the same cut. Passing by value costs one O(n) copy, which is acceptable once per call.

## Common bugs
Calling `remove` without `erase` and returning a deck of the wrong length; erasing inside an index loop and skipping the neighbour; erasing inside a range-for, which invalidates the iterators; an O(n^2) erase loop that times out at 200000 cards.

## Follow-ups
Remove cards for which a predicate holds (`remove_if`). Remove consecutive duplicates (`unique`). Remove in place and return the new length, as the LeetCode version asks.

## Similar problems
Remove Element (LeetCode 27).
