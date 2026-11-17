# Scrambled Tags

A cargo tag `a` was torn and re-stuck as tag `b`. The tags are lowercase words. Say whether `b` could be a rearrangement of the letters of `a`: the same letters, each used the same number of times, in any order.

Return `true` if so, otherwise `false`. Two empty tags match.

## Examples

- `a = "listen"`, `b = "silent"` gives `true`.
- `a = "rat"`, `b = "car"` gives `false`.
- `a = "aab"`, `b = "abb"` gives `false` (same length and same letters, different counts).

## Constraints

- `0 <= a.length(), b.length() <= 100000`
- Both strings contain only `a` to `z`.
