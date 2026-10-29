## Nudge
Fix one wall as the shortest in the hall. How far left and right can the hall stretch before a shorter wall blocks it?

## Approach
For every wall, find the nearest strictly shorter wall on each side. The area for that wall is its height times the distance between those two blockers minus one.

## Key insight
Process walls left to right with a stack whose heights are increasing. When a new wall is shorter than the top, the top's right blocker is the new wall and its left blocker is the element below it in the stack: pop, compute its area, repeat. Add a height-0 sentinel at the end to flush the stack. Use 64-bit areas.
