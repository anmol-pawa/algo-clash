# Word Chain Window

You are given a long `text` of lowercase letters and a list of `words`. Every word has the **same length** `w`. Words may repeat in the list.

A **chain** is any way of writing all the words one after another, each used exactly as many times as it appears in the list, in any order. A list of `k` words gives chains of length `k·w`.

Return, in increasing order, every position `i` such that the `k·w` letters of `text` starting at `i` form a chain. Chains may overlap.

## Example

```
text = "xabcdabcdy", words = ["ab", "cd"]   ->  [1, 3, 5] ("abcd" at 1, "cdab" at 3, "abcd" at 5)
text = "aaaaaa",     words = ["aa", "aa"]   ->  [0, 1, 2] ("aaaa" three times, overlapping)
text = "abbaab",     words = ["ab", "ba"]   ->  [0, 2]    ("abba" at 0, "baab" at 2; "bbaa" is not a chain)
text = "abc",        words = ["abcd"]       ->  []
```

## Constraints

- `1 <= text.length() <= 100000`
- `1 <= words.size() <= 20000`, every word has the same length `1 <= w <= 30`, all lowercase.
- If `k·w > text.length()` the answer is empty.
