## Signals
"Remove while keeping order" on a vector. When many elements go, do not erase them one at a time; compact in one pass (erase-remove idiom).

## Brute force
Copy an element into a new vector whenever it is the first or differs from its predecessor. O(n) time and extra O(n) space. It is correct and fast; it is the checker because it is obviously right.

## Key insight
The real lesson is the cost of `vector::erase`: removing element `i` moves every later element one slot left, O(n - i). Erasing inside a loop therefore turns a linear task into a quadratic one, and the 10^5 equal labels in the perf group make that visible. The standard answer is the erase-remove idiom: an algorithm (`unique`, `remove`, `remove_if`) moves the survivors to the front and returns the new logical end, and a single `erase(newEnd, end)` trims the tail.

## Optimal
`erase(unique(...), end())`. Time O(n), space O(1) extra (the parameter is a copy the function is free to modify).

## C++ walkthrough
`unique` compares each element with the last kept one and only removes adjacent equals, so it also works on unsorted input for this task. It does not shrink the vector: the elements after the returned iterator are unspecified, so you must erase them. The parameter is taken by value on purpose, so we may modify it and return it.

## Common bugs
Incrementing the index after an `erase` (the next element slid into the current slot and gets skipped); deduplicating globally with a `set` (changes the meaning); calling `unique` and forgetting the final `erase`; erasing while iterating with a stale iterator.

## Follow-ups
Remove every occurrence of a given value (`remove`). Remove runs longer than two. Do the same on a linked list.

## Similar problems
Remove Duplicates from Sorted Array (LeetCode 26), Remove Element (LeetCode 27).
