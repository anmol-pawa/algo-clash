## Nudge
Negative numbers break the usual "grow and shrink a window" idea. Think in terms of running totals instead: when does a stretch from `i` to `j` sum to `target`?

## Approach
Let `prefix[j]` be the total of the first `j` numbers. A stretch `(i, j]` sums to `target` exactly when `prefix[j] - prefix[i] == target`. While scanning, you need to know how many earlier prefixes equal `prefix[j] - target`.

## Key insight
Keep a hash map from prefix total to how many times it has occurred, seeded with `{0: 1}` for the empty prefix. At each step add `seen[prefix - target]` to the answer, then record the current prefix. Use `long long` for the prefix and the count.
