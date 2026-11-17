## Nudge
The odd-position wagons keep their order and so do the even-position ones. Imagine two separate rails being built while you walk the list once. What do you need to remember to join them at the end?

## Approach
Keep `odd` and `even` tail pointers, plus `evenHead`. In each step let the odd tail skip over the even wagon to the next odd wagon, then let the even tail skip to the next even wagon. When the walk ends, link the odd tail to `evenHead`.

## Key insight
Rewire in place, one pass, no new nodes. The loop condition `even != nullptr && even->next != nullptr` is the heart of it: it works for both even and odd lengths because the even rail always reaches the end first or at the same time. Time O(n), space O(1).
