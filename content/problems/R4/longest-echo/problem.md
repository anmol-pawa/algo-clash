# Longest Echo

A strand is a string of lowercase letters. An **echo** is a block (a run of consecutive letters) that occurs at **two or more different starting positions**; the occurrences may overlap.

Return the **longest** echo. If several echoes share the longest length, return the one whose **second occurrence starts earliest**. If the strand has no echo, return the empty string.

## Example

```
strand = "banana"          ->  "ana"     (starts 1 and 3, overlapping)
strand = "abcd"            ->  ""
strand = "xyabcabcz"       ->  "abc"     (starts 2 and 5)
strand = "aabaab"          ->  "aab"     (starts 0 and 3)
strand = "abab" + "cdcd"   ->  "ab"      (length 2: "ab" repeats at 2, "cd" repeats at 6; "ab" completes first)
strand = "abcdcdab"        ->  "cd"      ("ab" and "cd" both have length 2; "cd" repeats at 4, "ab" only at 6)
```

## Constraints

- `0 <= strand.length() <= 100000`; every letter is `a` to `z`.
- Only blocks that occur at two or more *different* starting positions count; a block is never an echo of itself.
