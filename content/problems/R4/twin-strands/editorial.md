## Signals
"Repeated blocks of a fixed length" means every window needs a cheap, comparable identity. Strings work but cost `len` per window; an integer code costs O(1) after sliding.

## Brute force
Put every window in a `set<string>` and count those seen twice. That is O(n · len) time and memory for n windows. It passes here (len is at most 31), but it does not scale to long windows, and the pairwise version (compare every two start positions) is O(n² · len).

## Key insight
The alphabet has 4 symbols, so a window is a base-4 number: 2 bits per letter. Sliding one position is `code = ((code << 2) | letter) & mask`, where `mask` has `2 · len` ones. This is the simplest rolling hash and it is exact when `2 · len <= 64` (here `len <= 31`, leaving the top bits free). For larger alphabets or windows, Rabin–Karp uses `code = (code · B + letter) mod M` and must handle collisions.

## Optimal
Build the code for the first `len` letters, then slide. For every full window increment `seen[code]`; when it becomes exactly 2, increment the answer. Time O(n) expected, space O(n) for the map. If `n < len` the answer is 0.

## C++ walkthrough
Use `uint64_t` (or `long long`): `1ULL << (2 * len)` with `len = 31` is `2^62`, fine; with a plain `int` literal `1 << 62` is undefined behaviour. The mask is `(1ULL << (2 * len)) - 1`. `unordered_map<uint64_t, int>` is expected O(1); a sorted vector of codes plus run counting is deterministic O(n log n).

## Common bugs
Using a 32-bit code (breaks for `len > 16`); forgetting the mask so old letters stay in the code; counting every repeat instead of the first time a pattern reaches two; starting the count before the first full window exists.

## Follow-ups
Alphabet of 26 letters and `len` up to 10^5 (binary search on `len` plus a polynomial hash modulo a large prime, with a collision check). Return the patterns instead of the count. Streaming DNA with bounded memory (Bloom filter).

## Similar problems
Repeated DNA Sequences (LeetCode 187); Longest Duplicate Substring (LeetCode 1044) is the hard form with binary search on the length.
