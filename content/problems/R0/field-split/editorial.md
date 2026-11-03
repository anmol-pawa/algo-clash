## Signals
"Split on a delimiter" with a rule about empty pieces. Decide first what an empty piece means; library helpers often decide differently from the statement.

## Brute force
Scan the characters once: a comma starts a new empty field, any other character is appended to the last field. This is O(n) and trivially handles empty fields because the vector starts with one empty field.

## Key insight
The problem is a test of edge semantics. With `k` commas there are exactly `k + 1` fields, including empty ones at the start, middle and end. Tools that split by "reading tokens" (`stringstream` with `getline`, `operator>>`) are built for token streams and quietly drop the final empty field.

## Optimal
The `find`-based loop below is also O(n) and avoids appending character by character. Time O(n), space O(n) for the output.

## C++ walkthrough
`find(',', start)` returns the index of the next comma at or after `start`, or `string::npos` (the largest `size_t`) if none. `substr(start, len)` copies `len` characters starting at `start`: always compute `len = comma - start`. The loop ends in the `npos` branch, which pushes the tail `substr(start)` (to the end), so the empty last field in `"x,"` is produced naturally. Every `substr` copies, so each character is copied once: O(n) total, not O(n^2).

## Common bugs
Treating the second argument of `substr` as an end index; forgetting the final field; using `getline` and losing a trailing empty field (and returning no fields for an empty line); comparing `find`'s result to `-1` through an `int` instead of using `string::npos`.

## Follow-ups
Split on any whitespace and skip empties. Honour quoted fields that may contain commas. Split into integers with `stoi`.

## Similar problems
A basic parsing warm-up, in the spirit of Reverse Words in a String (LeetCode 151).
