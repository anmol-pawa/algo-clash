# Field Split

A logbook line stores fields separated by commas, for example `crab,,seal`. Split the line into its fields, in order. Empty fields are real fields and must be kept: `crab,,seal` has three fields, the middle one empty. A line with no commas has exactly one field, and the empty line has one empty field.

## Examples

- `line = "crab,reef,seal"` gives `["crab", "reef", "seal"]`.
- `line = "a,,b"` gives `["a", "", "b"]`.
- `line = "x,"` gives `["x", ""]`.
- `line = ""` gives `[""]`.

## Constraints

- `0 <= line.size() <= 200000`
- `line` contains lowercase letters, digits, spaces and commas only
- fields are not trimmed: spaces belong to the field
