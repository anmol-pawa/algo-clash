## Nudge
The `next` links are easy to copy. The hard part is the shortcut: when you create the twin of lantern `a`, the twin of the lantern it points to may not exist yet. How can you look up "the twin of lantern X" quickly, without comparing values (they repeat)?

## Approach
Do it in two phases. First create all the twins, remembering for each original lantern which twin belongs to it. Second, go through the originals again and set `twin->random` to the twin of `orig->random`. A hash map from original pointer to twin pointer does the remembering with O(n) extra memory. Can you store the pairing *inside the list* instead?

## Key insight
Weave each twin directly after its original: `a -> a' -> b -> b' -> c -> c'`. Now the twin of any original `x` is simply `x->next`. For a shortcut: `a'->random = a->random->next`. Finish by unzipping the two chains and putting every original `next` back, since the original must end up unchanged.
