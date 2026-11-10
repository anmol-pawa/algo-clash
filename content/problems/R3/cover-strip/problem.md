# Cover Strip

A banner is printed as a string of letters, `tape`. A collector needs a set of charms, given as the string `charms`: every letter in `charms` stands for one charm, so `"aab"` means two `a` charms and one `b` charm.

A stretch of consecutive letters of `tape` **covers** the charms when it holds at least as many copies of each letter as `charms` asks for (it may hold extra letters too).

Return the **shortest** covering stretch. If several have the same shortest length, return the one that starts **leftmost**. If no stretch covers the charms, return the empty string.

## Examples

- `tape = "xaybzacb"`, `charms = "abc"` gives `"acb"` (length 3; `"bzac"` also covers but is longer).
- `tape = "aab"`, `charms = "ab"` gives `"ab"`.
- `tape = "abca"`, `charms = "aa"` gives `"abca"` (two `a` are needed).
- `tape = "xyz"`, `charms = "w"` gives `""`.

## Constraints

- `0 <= tape.length() <= 100000`
- `1 <= charms.length() <= 100000`
- Both strings contain only English letters `a` to `z` and `A` to `Z` (upper and lower case are different letters).
