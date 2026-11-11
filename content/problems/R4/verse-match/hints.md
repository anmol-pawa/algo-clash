## Nudge
When you reach line `i`, what do you need to remember about the letter `pattern[i]` and about the word `words[i]` from earlier lines?

## Approach
Keep two hash maps: letter to word, and word to letter. Walk the first `min(pattern length, word count)` lines. If either map already holds a different partner for this line, line `i` breaks the fit, so return `i`. Otherwise record the pair. If you finish, return that minimum length.

## Key insight
A one-way map accepts two letters standing for the same word. Both directions must be checked. Words are the keys of one map, so each lookup costs the word's length, which is why the bound is O(n · w) rather than O(n).
