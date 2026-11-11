## Nudge
Order inside a chain does not matter, only how many times each word appears. If you already know where one word of the chain starts, where do the others start?

## Approach
Every word of a chain starts at the same remainder mod `w`. So handle each alignment `0..w-1` on its own: slide a window over the aligned words, one word at a time, keeping a map of word counts inside the window. When a word shows up more often than the list allows, move the left edge forward until it fits; when the window holds `k` words, its left edge is an answer.

## Key insight
Fixing the alignment turns a character-level problem into a word-level sliding window with a count map, exactly like "at most K of each kind". A word that is not in the list resets the window. Each alignment is one pass, so the whole thing is `w` passes of `n / w` steps. Collect the answers from all alignments and sort them at the end.
