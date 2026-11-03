## Nudge
Which elements survive? Think about what an element must be compared with to know whether it is the start of a run.
## Approach
An element survives if it is the first one or differs from its left neighbour. Collect survivors, or let the STL shift them to the front for you.
## Key insight
Calling `erase` once per duplicate inside a loop shifts the whole tail every time: O(n) each, O(n^2) in total, which is too slow for 10^5 equal labels. `nums.erase(unique(nums.begin(), nums.end()), nums.end())` does one pass and one erase.
