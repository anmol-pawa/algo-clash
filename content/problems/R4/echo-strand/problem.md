# Echo Strand

A lab records a strand as a string of the four letters `A`, `C`, `G` and `T`. An **echo** is a block of exactly `k` consecutive letters that occurs at **two or more different starting positions** (the occurrences may overlap).

Return every distinct echo exactly once, sorted in ascending alphabetical (lexicographic) order.

## Example

```
strand = "ACGACGAC", k = 3
blocks:  ACG(0)  CGA(1)  GAC(2)  ACG(3)  CGA(4)  GAC(5)
echoes:  ["ACG", "CGA", "GAC"]

strand = "AAAAAA", k = 2   ->  ["AA"]     (starts 0..4, overlapping)
strand = "ACGT",   k = 2   ->  []
```

## Constraints

- `0 <= strand.length() <= 100000`; every letter is `A`, `C`, `G` or `T`.
- `1 <= k <= 30`.
- If `k > strand.length()` there are no blocks and the answer is empty.
