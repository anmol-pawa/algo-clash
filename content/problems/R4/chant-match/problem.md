# Chant Match

A choir leader writes a **pattern** of lowercase letters, one letter per word of the chant. The chant is a **sentence**: words made of lowercase letters, separated by single spaces.

The chant **matches** the pattern if each letter stands for exactly one word and each word is stood for by exactly one letter: the same letter always means the same word, and two different letters never mean the same word.

Return `true` if the sentence matches the pattern.

## Examples

- `pattern = "abba"`, `sentence = "ox hen hen ox"` gives `true`.
- `pattern = "abba"`, `sentence = "ox hen hen cat"` gives `false` (the last `a` would be `cat`, but `a` was `ox`).
- `pattern = "ab"`, `sentence = "ox ox"` gives `false` (two letters cannot share one word).
- `pattern = "aaa"`, `sentence = "ox ox"` gives `false` (the counts differ).

## Constraints

- `1 <= pattern.length() <= 50000`
- `1 <= sentence.length() <= 300000`
- `sentence` has no leading, trailing or repeated spaces; each word has length at least 1.
