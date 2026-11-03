## Nudge
Which letter has index 0, and how can a character tell you its own index?
## Approach
Keep `vector<int> tally(26, 0)`. For each character, make it lowercase, check that it is between `'a'` and `'z'`, and increment `tally[c - 'a']`.
## Key insight
In C++ a `char` is a small integer, so `c - 'a'` is the letter's position in the alphabet. Always guard the range before indexing: `'['` and `'@'` sit next to the letters in ASCII and would otherwise index outside the 26 buckets. Use `tolower` (cast to `unsigned char` first) instead of writing separate branches for uppercase.
