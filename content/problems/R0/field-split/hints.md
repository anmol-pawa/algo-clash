## Nudge
What should `"x,"` and `""` give? Count the fields by counting the commas.
## Approach
`k` commas make `k + 1` fields. Walk the line with `find(',', start)`: take the text from `start` up to the comma, then move `start` just past the comma. After the last comma, the rest of the line is the final field.
## Key insight
`substr(pos, len)` takes a start and a length, not an end index. The length of a field is `comma - start`. And `getline(ss, part, ',')` looks convenient but never returns a trailing empty field, so it fails the `"x,"` and `""` cases.
