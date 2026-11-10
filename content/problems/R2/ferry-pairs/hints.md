## Nudge
Think about the heaviest rider. Who is the best possible companion for them, if they have one at all?

## Approach
Sort the weights. Keep a pointer at the lightest and one at the heaviest rider. Every trip takes the heaviest; the lightest joins if the two fit within the limit. Count trips until the pointers cross.

## Key insight
If the heaviest rider cannot share with the lightest, they cannot share with anybody, so they ride alone. If they can, pairing them with the lightest wastes nothing a heavier partner would have used better.
