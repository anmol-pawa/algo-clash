## Signals
"Split on a separator" and "empty pieces matter". The standard-library shortcut for splitting, `getline` on a `stringstream`, is convenient and quietly wrong for this spec, which is the point of the exercise.

## Brute force
Find the next comma with `find` from the current position, cut out the field with `substr`, and continue. This is already linear, so the brute force here is a different formulation used as a checker: build each field by appending characters one at a time until a comma, pushing a field at each comma and once more at the end.

## Key insight
A line with `k` commas has `k + 1` fields. The loop therefore pushes one field per comma and one more at the end; the end push is what keeps a trailing empty field and what makes `""` produce `[""]`. `getline(ss, field, ',')` stops at the end of the stream without reporting a trailing empty field, so `"a,"` yields only `["a"]`.

## Optimal
One pass. Track `start`, and at each comma push `line.substr(start, i - start)` and set `start = i + 1`; after the loop push `line.substr(start)`. Time O(n) in total because each character is copied into exactly one field. Space O(n) for the answer.

## C++ walkthrough
`substr(pos, len)` copies `len` characters, so its cost is the field length, which is fine when each character is copied once. The slow patterns are re-scanning from the start of the line to locate field k, or `line = line.substr(i + 1)` inside the loop: each repeats O(n) work per field, which makes the total quadratic. `const string&` avoids copying the input. `substr(start)` with `start == size()` is valid and gives an empty string; `start > size()` throws.

## Common bugs
Forgetting the push after the loop; using `getline` and losing the trailing field or turning `""` into `[]`; skipping empty fields; shrinking the string inside the loop; off-by-one in the `substr` length.

## Follow-ups
Return only non-empty fields. Split on any of several separators. Handle quoted fields that contain commas, with a small state machine.

## Similar problems
Split Strings by Separator (LeetCode 2788).
