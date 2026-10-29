## Nudge
When a closing bracket shows up, which earlier opener must it pair with?

## Approach
Keep the openers you have not closed yet in the order you met them. A closer is only legal if it matches the most recent one.

## Key insight
That "most recent unclosed opener" is the top of a stack. Push openers, pop on a closer that matches, and fail on a mismatch or an empty stack. At the end the stack must be empty.
