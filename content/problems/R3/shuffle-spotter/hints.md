## Nudge
Two stretches are shuffles of each other exactly when every letter appears the same number of times in both. How many numbers is that to compare, and how does the next stretch differ from the current one?

## Approach
Count the letters of `word` once. Slide a window of the same length over `text`, keeping its letter counts: one letter enters on the right, one leaves on the left. After each slide, check whether the two count tables are equal.

## Key insight
Comparing 26 counters is O(1), so the whole scan is O(n) however long the word is. Sorting each window (or comparing it as a string) costs O(m log m) per position and times out. Check the window only once it has full length, and mind which index leaves: it is `i - m`, not `i - m - 1`.
