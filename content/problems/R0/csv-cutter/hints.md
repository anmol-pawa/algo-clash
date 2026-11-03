## Nudge
Count the commas in `"a,,b,"` and count the fields you expect. What does that say about the empty line and about a trailing comma?
## Approach
Walk through the line once, remembering where the current field started. At every comma, cut out the field since the last start; after the loop, cut out the final field.
## Key insight
The last field is not ended by a comma, so it needs its own push after the loop. Pull each field with `line.substr(start, i - start)`, where `start` is a position, and never shrink the original string while you scan: re-scanning or re-copying the line for every field makes the work quadratic.
