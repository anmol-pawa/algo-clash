## Signals
"Each X stands for exactly one Y, and each Y for exactly one X" is a bijection check. It is the Twin Scripts problem with a bigger alphabet: the symbols on one side are now whole strings.

## Brute force
For every pair of positions `(i, j)`, require that the letters are equal exactly when the words are equal. That compares strings in a double loop: O(w² · L) for w words of length up to L. At 50,000 words it is far too slow.

## Key insight
A bijection is two functions that undo each other. Keep both directions: `wordOf[letter]` and `letterOf[word]`. A conflict in either direction means the sentence does not match.

## Optimal
Split the sentence on spaces. If the word count differs from the pattern length, return `false`. For each index, look up the letter in `wordOf` and the word in `letterOf`. If a side is missing, the other side must be missing too; then record both. If a side is present, it must agree. Time O(n) expected (hashing a word costs its length, total at most the sentence length), space O(n).

## C++ walkthrough
`istringstream` with `>>` splits on whitespace. A `string` key hashes its characters, so lookups cost the word length. A 26-slot array works for the letter side because the alphabet is fixed. To avoid copying words, a `string_view` map is possible as long as the sentence outlives the maps.

## Common bugs
Checking only `letter -> word`; not comparing the counts first (the loop either stops early and says `true`, or reads past the end); treating a word as seen when it was merely inserted by `operator[]` while checking.

## Follow-ups
What if letters are replaced by arbitrary tokens? What if a word may be matched by several letters (a surjection)? How would you check a stream of chants against one pattern?

## Similar problems
Word Pattern (LeetCode 290); Isomorphic Strings (LeetCode 205) is the letter-to-letter case.
