## Nudge
Which group do you finish first: the outermost one or the innermost one? What do you need to remember about each open group while you work inside it?

## Approach
Walk the characters. Build the count digit by digit (counts can have several digits). Keep one output string. On `[`, remember where the group's body starts in the output, and its count, on a stack. On `]`, the body is everything written since that start: append it `count - 1` more times. Letters just append.

## Key insight
The stack holds one entry per currently open bracket. Closing a bracket repeats a tail of the output, and tails of tails compose correctly because inner groups are finished before outer ones. No character of the input is revisited, so the work is proportional to the output size.
