# Scramble Check

Two words are a **scramble** of each other if one can be rearranged into the other using every letter exactly once.

Given lowercase words `a` and `b`, return `true` if they are scrambles of each other.

## Examples

- `a = "listen"`, `b = "silent"` gives `true`.
- `a = "aab"`, `b = "abb"` gives `false`.
- `a = ""`, `b = ""` gives `true`.

## Constraints

- `0 <= a.length(), b.length() <= 100000`
- Both words contain only `a` to `z`.
