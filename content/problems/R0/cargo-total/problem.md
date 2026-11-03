# Cargo Total

A freighter loads crates one after another. Crate `i` weighs `w[i]` grams. Return the total weight of all crates in grams.

The manifest can hold many heavy crates, so the total may be much larger than a single crate.

## Examples

- `w = [3, 5, 2]` gives `10`.
- `w = [2000000000, 2000000000]` gives `4000000000`.
- `w = []` gives `0`.

## Constraints

- `0 <= w.size() <= 100000`
- `0 <= w[i] <= 2000000000`
