# Twin Strands

A DNA string uses only the letters `A`, `C`, `G` and `T`. A **strand** is any block of exactly `len` consecutive letters. Two strands at different start positions may overlap.

A strand pattern is a **twin** if it appears at two or more different start positions. Return how many **distinct** twin patterns the DNA contains. A pattern that appears many times counts once.

## Examples

- `dna = "ACGTACGTAC"`, `len = 4` gives `3`. The strands are `ACGT, CGTA, GTAC, TACG, ACGT, CGTA, GTAC`; the first three each appear twice and `TACG` once.
- `dna = "AAAAAA"`, `len = 2` gives `1` (`AA` at five positions, counted once).
- `dna = "ACGT"`, `len = 5` gives `0`.

## Constraints

- `0 <= dna.length() <= 200000`
- `1 <= len <= 31`
- `dna` contains only `A`, `C`, `G`, `T`.
