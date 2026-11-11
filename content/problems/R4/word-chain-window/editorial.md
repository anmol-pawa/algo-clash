## Signals
The window has a fixed size (`k·w` letters) and the condition is "this multiset of tokens", not "this exact string". Equal-length tokens are the second signal: they cut the text into word-sized cells, and once you know the alignment, the window is a sliding window over cells with a frequency map, the same machinery as Crate Variety.

## Brute force
For each start `i` in `[0, n - k·w]`, cut the next `k·w` letters into `k` words, count them, and compare with the target counts. That is `O(n·k)` word reads, each `O(w)`: with `n = 100,000` and `k = 20,000` (for example the text `aaaa...` with the word `aa`), more than a billion operations.

## Key insight
Words in a chain sit on a grid: the first starts at `i`, the next at `i + w`, and so on. So the starts of its words are all congruent to `i` mod `w`. Split the problem by alignment `offset = 0..w-1`. In one alignment the text is a sequence of cells `text[offset + j·w, +w)`, and a chain is `k` consecutive cells whose word counts equal the target counts. That is a sliding window with a count map: add the incoming cell, and while its count exceeds the allowed multiplicity, drop cells from the left. Two cases reset or shrink: a cell that is not a word at all clears the window; an excess copy shrinks it.

## Optimal
Build `need` (word to multiplicity). For each alignment keep `have`, `inside` and `left`. For each cell: if it is unknown, clear everything and set `left` just past it. Otherwise increment `have`, and shrink from the left while `have[word] > need[word]`. When `inside == k`, no word exceeds its multiplicity and the total is `k`, so every count equals `need`: record `left`, then drop one cell to keep sliding. Total time `O(n·w)` (`w` alignments, `n/w` cells each, `O(w)` to hash a cell), space `O(k·w)` for the maps. Sort the answers, because alignments are processed one after another.

## C++ walkthrough
`unordered_map<string,int>` for `need` and `have`; reuse `it->second` for the cap instead of looking it up again. Guard `k·w > n` with `long long`, since `k·w` is at most 600,000 here but the habit matters. `text.substr(right, w)` allocates once per cell for `w > 15`; if that matters, map each cell to an integer id once per alignment. Do not `have.erase` when a count reaches zero in the shrink loop unless you also compare sizes; leaving zero entries is fine because only `inside` is tested.

## Common bugs
Using a `set` and so ignoring repeated words; only trying alignment `0`; accepting any block made of known words without counting; forgetting to sort; not clearing the window on an unknown word, so cells from before it are counted; after recording an answer, not advancing `left`, so the next cell is counted twice; rebuilding the count map per start (`O(n·k)`).

## Follow-ups
Words of different lengths (use a trie or Aho-Corasick and a DP over positions). Count the chains instead of listing them. Allow one wrong word (track a "mismatch budget"). Streaming text.

## Similar problems
Substring with Concatenation of All Words (LeetCode 30). Longest Substring with At Most K Distinct Characters (LeetCode 340, see Crate Variety in this region) for the count-map window.
