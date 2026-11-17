## Nudge
You can already tell *whether* a list loops with two runners. After they meet, that meeting point is somewhere inside the loop. How far is it from the gate, compared with how far the head is from the gate?

## Approach
Run slow (one step) and fast (two steps) until they meet. If fast falls off the end, return `nullptr`. Then put one pointer back on the head and leave the other at the meeting point. Move both one step at a time until they are the same node.

## Key insight
Let the tail before the gate have `a` nodes, the meeting point lie `b` nodes past the gate, and the cycle have length `L`. The slow runner walked `a + b`, the fast one twice that, so `a + b` is a whole number of laps: `a + b = k·L`. Then `a = k·L - b`: walking `a` steps from the meeting point lands exactly on the gate, which is also where a walker from the head arrives after `a` steps.
