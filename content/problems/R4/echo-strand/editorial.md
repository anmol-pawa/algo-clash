## Signals
"Fixed-length substrings that appear again" means one question per window position: have I seen this block before? Any answer to that needs a key for the block. The fixed length is the hint that the key can be *updated* as the window slides instead of rebuilt.

## Brute force
For every start, compare the block with every later block: O(n²·k) character work, or O(n²) block comparisons at best. With n up to 100,000 that is far too slow. Putting each `substr` in an `unordered_set<string>` is O(n·k) time and memory, which passes here but wastes the structure of the problem.

## Key insight
The alphabet has four letters, so each letter is two bits. A block of k <= 30 letters is a number below 2^60, and different blocks give different numbers: the encoding is exact. Sliding by one letter is `key = ((key << 2) | code(next)) & mask`, where `mask` keeps the low 2k bits. That is a rolling hash with no collisions. For a general alphabet you would use `key = (key * base + next - out * base^k) mod M` (Rabin–Karp) and verify matches, because modular hashes can collide.

## Optimal
Slide the key across the strand once. When the window is full (`i >= k - 1`), bump a counter for the key. Add the block to the answer exactly when its counter reaches 2, so a block seen five times is listed once. Sort at the end. Time O(n + r·k·log r) for r echoes (O(n) hashing plus sorting the output); space O(n).

## C++ walkthrough
Use `long long`: `1 << 60` overflows `int`, and `1LL << (2 * k)` is the safe way to build the mask (2k <= 60 < 63). `seen.reserve(n * 2)` avoids rehashing. The `if (++seen[key] == 2)` form both counts and de-duplicates. Take `substr` only when reporting, never per window.

## Common bugs
A 32-bit key (collides once k > 16); counting `>= 2` instead of `== 2` (duplicates in the output); forgetting to mask (stale high bits make every key unique); treating overlapping occurrences as invalid; returning an unsorted answer; `k > n` underflowing `n - k` when n is unsigned.

## Follow-ups
Larger alphabets or k > 30: polynomial rolling hash with a 64-bit modulus or two moduli, and verify candidates. Longest repeated substring: binary search on k, calling this check each time (the hard version in this region). Streaming: the same key update works one character at a time.

## Similar problems
Repeated DNA Sequences (LeetCode 187) fixes k = 10; Longest Duplicate Substring (LeetCode 1044) adds binary search over k.
