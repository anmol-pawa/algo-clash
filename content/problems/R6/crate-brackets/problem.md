# Crate Brackets

A dock worker labels stacked crates with brackets: `(` `)` `[` `]` `{` `}`. A label is **balanced** when every opening bracket is closed by a bracket of the same kind, and brackets close in the reverse order they opened (the most recently opened one closes first).

Given the label `s`, return `true` if it is balanced and `false` otherwise.

## Examples

- `s = "([]{})"` gives `true`.
- `s = "([)]"` gives `false`: the `)` arrives while `[` is the latest open bracket.
- `s = "(("` gives `false`: nothing closes the openers.

## Constraints

- `0 <= s.length() <= 100000`
- `s` contains only the six bracket characters.
- The empty label is balanced.
