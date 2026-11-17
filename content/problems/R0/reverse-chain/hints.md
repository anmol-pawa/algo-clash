## Nudge
Draw `1 -> 2 -> 3`. To make bead 2 point back at bead 1, what do you lose if you overwrite `2->next` first?
## Approach
Walk the chain with `cur`, keeping `prev` (the head of the part already reversed, starting at `nullptr`). For each bead: save `cur->next`, point `cur->next` at `prev`, move `prev` to `cur`, move `cur` to the saved next. Return `prev`.
## Key insight
Always save the next pointer before you overwrite it. When the loop ends `cur` is `nullptr` and `prev` is the old last bead, which is the new head. The empty chain needs no special case: the loop never runs and `prev` is `nullptr`.
