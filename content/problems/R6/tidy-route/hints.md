## Nudge
Split the route into names. Which names undo something, and what exactly do they undo?

## Approach
Walk the route, collecting one name at a time between slashes. Ignore empty names and `.`. A `..` removes the most recent kept name, if there is one. Any other name (including `...`) is pushed. At the end join the kept names with `/` in front of each; if none are left the answer is `/`.

## Key insight
`..` always cancels the most recently kept name, which is a stack pop; at the top level the stack is empty and `..` is simply ignored. Only the exact strings `.` and `..` are special.
