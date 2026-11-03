## Nudge
`sort` needs to know when one element comes before another. How can you give your own type that rule, and what two values must the type carry so the original crate number is not lost?
## Approach
Make `struct Crate { int weight; int id; }` with a constructor, and write `bool operator<(const Crate&) const` so that "less" means "lifted earlier": heavier first, and on equal weight the smaller `id` first. Fill a `vector<Crate>`, call `sort`, then read the ids.
## Key insight
Sorting indices by `weights[a] > weights[b]` alone is not enough: `std::sort` is not stable, so equal weights may land in any order. Put the tie-break inside the comparison itself so the order is fully determined.
