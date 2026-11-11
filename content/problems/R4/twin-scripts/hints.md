## Nudge
If `a[i]` and `a[j]` are the same symbol, what must be true of `b[i]` and `b[j]`? And the other way round?

## Approach
Walk both strings together. Remember, for each symbol of `a` and each symbol of `b`, the last position where it appeared. A pairing is valid at index `i` exactly when both symbols were last seen at the same place.

## Key insight
Checking only `a → b` misses two symbols that collapse onto one (`"ab"` vs `"cc"`). The mapping must be checked in both directions, and the "last seen" trick does both in one pass with two small arrays.
