## Signals
"Longest block that appears twice" asks for a maximum length with a yes/no test per length, and the test is monotone: a repeat of length L contains a repeat of length L-1. Whenever the answer is a number with a monotone predicate, binary search on the answer is the shape. The second signal is the predicate itself: "does any block of length L occur twice?" needs a key per block, and a rolling hash gives that key in O(1) per slide.

## Brute force
For every length from n-1 down, compare every pair of start positions: O(n²) pairs per length, O(n³) comparisons overall (more with the O(L) compare). Even the better version, putting every `substr` in an `unordered_set<string>` for each length, costs O(n·L) per length and O(n²) for the whole descent, which is far too slow at n = 100,000.

## Key insight
Two ideas compose. First, monotonicity lets you binary search L in [0, n): O(log n) checks instead of n. Second, one check is a single pass with a rolling hash: `h = h·B + next − out·B^L` (mod a prime), so each block's key costs O(1). Total O(n log n) time. The hash is a fingerprint, not an identity: two different blocks can share a hash, and an adversary can aim for it (a mod-2^64 hash breaks on a Thue–Morse strand). So use two moduli packed into one key, and on a match compare the actual letters before returning. The verification costs O(L) but only runs when the hashes already agree.

## Optimal
`lo = 0` (always achievable), `hi = n` (never achievable, a block of length n occurs once). While `hi - lo > 1`: test `mid`; if some start has a repeat, record that start and set `lo = mid`, else set `hi = mid`. In the check, keep `firstSeen[hash] = earliest start`. Scanning left to right, the first position whose block was seen before is the repeat that completes earliest, which is exactly the tie-break in the statement. Time O(n log n), space O(n).

## C++ walkthrough
`long long` for the arithmetic: `h·B` is about 10^18, so reduce after every multiply and add `M` before the final `%` when subtracting. `p = B^len` is rebuilt per check in O(len). Pack the two hashes as `h1·M2 + h2` (below 2^63). Reserve the map. Compare with `s.compare(a, len, s, b, len)` which avoids copying substrings. Return `substr(bestStart, lo)` only once, at the end.

## Common bugs
Setting `hi = n - 1` and so never testing length n-1 (`"aaaa"` has the echo `"aaa"`); an unverified hash match; a hash modulo 2^64 with natural overflow (Thue–Morse kills it); forgetting to subtract the outgoing letter, or taking a negative remainder; counting only non-overlapping occurrences; reporting the first occurrence instead of the repeat that completes earliest; rebuilding substrings per window (O(n·L)).

## Follow-ups
Return all longest echoes; a suffix array plus LCP array gives the length in O(n log n) with no hashing risk (and a suffix automaton in O(n)); the same binary-search-plus-hash skeleton solves "longest common substring of two strings". Streaming input: a suffix automaton extends online, rolling hash does not.

## Similar problems
Longest Duplicate Substring (LeetCode 1044). Repeated DNA Sequences (LeetCode 187) is the fixed-length version (see Echo Strand in this region).
