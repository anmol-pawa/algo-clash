## Nudge
Comparing every pair of words is too slow. Is there one value, computed from a single word, that is identical for every word in its clan and different across clans?

## Approach
Sort the letters of each word to get a canonical key. Count how many words share each key in a hash map and take the largest count.

## Key insight
The sorted spelling is a **canonical form**: it is the same for all rearrangements and different otherwise. Sorting one short word is cheap, so the cost is n times a tiny sort, not n squared.
