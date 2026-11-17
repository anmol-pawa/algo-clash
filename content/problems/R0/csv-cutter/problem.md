# Comma Cutter

A ledger line stores its fields separated by commas. A field may be empty, and the empty fields matter: `a,,b` has three fields.

Return the fields of `line` in order. A line with `k` commas always has exactly `k + 1` fields, so the empty line has one (empty) field, and a trailing comma means the last field is empty.

## Examples

- `line = "ant,bee,cat"` gives `["ant","bee","cat"]`.
- `line = "a,,b,"` gives `["a","","b",""]`.
- `line = ""` gives `[""]`.
- `line = ","` gives `["",""]`.

## Constraints

- `0 <= line.size() <= 200000`
- `line` contains lowercase letters, digits, spaces and commas only (no quotes).
