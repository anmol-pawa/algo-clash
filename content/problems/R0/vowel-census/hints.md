## Nudge
A string is a sequence of `char`s you can loop over. How do you decide whether one `char` is a vowel?

## Approach
Normalise the case first (`tolower`), then compare against the five vowels. Count the hits in an `int`.

## Key insight
Lower-casing each character once means you only write five comparisons instead of ten. Cast to `unsigned char` before calling `tolower` so the call is well defined for every character value.
