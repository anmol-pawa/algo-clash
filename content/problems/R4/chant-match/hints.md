## Nudge
This is the Twin Scripts idea with words instead of letters. What if the number of words is not the number of pattern letters?

## Approach
Split the sentence into words. If the counts differ, the answer is `false`. Then walk letter and word together, keeping one map from letter to word and one from word to letter. A letter or word seen before must map to the same partner; a new one must not already be taken.

## Key insight
A single map `letter -> word` only proves that no letter changes meaning. It cannot see two letters sharing a word, so you need the reverse map too. Split first, because comparing counts early removes a whole class of out-of-range bugs.
