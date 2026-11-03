## Nudge
Try `[3,3,1]` with target 3 and erase each match as you walk forward with an index. What happens to the second 3 after the first one is erased?
## Approach
You never have to erase from the middle. Either build a new vector with only the cards you keep, or write the kept cards forward in the same vector and cut the tail once.
## Key insight
`vector::erase` in the middle shifts every later element, so erasing `k` cards one by one costs O(n * k). The erase-remove idiom, `deck.erase(remove(deck.begin(), deck.end(), target), deck.end())`, does one pass and one cut, in O(n). Note that `remove` alone only moves the kept cards to the front; it does not change the size.
