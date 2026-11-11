## Nudge
Removing from the middle of an array is slow because everything after it shifts. Which element can you remove from an array in O(1)? And how could you make the hole disappear without shifting?

## Approach
Store tickets in a vector (the slots) and keep a hash map from ticket to its slot. To erase, copy the last ticket into the erased ticket's slot, update the map for that moved ticket, then `pop_back` and remove the erased key.

## Key insight
The map must always say where each ticket really is, so every move updates it. The special case is erasing the last ticket itself: it "moves onto itself", so remove its key *after* the move, or it will reappear in the map.
