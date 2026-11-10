## Signals
"Reads the same from both ends" is a palindrome test. The decoration to ignore tells you not to compare raw positions: you need to skip characters while comparing outermost-first.

## Brute force
Copy only the letters and digits, lowercased, into a new string, reverse it and compare. O(n) time and O(n) extra space. It is correct; the interviewer will usually ask whether you can avoid the copy.

## Key insight
A palindrome is symmetric about its centre, so the outermost counting characters must match each other, then the next pair inward, and so on. Two indices walking toward each other visit exactly those pairs.

## Optimal
Set `left = 0`, `right = n - 1`. While `left < right`: if `line[left]` does not count, advance `left`; else if `line[right]` does not count, retreat `right`; else compare them case-insensitively, return `false` on a mismatch and move both inward. Invariant: every counting character outside `[left, right]` has been matched with its mirror. Each step moves an index, so time is O(n) and extra space O(1).

## C++ walkthrough
`isalnum` and `tolower` take an `int` that must be representable as `unsigned char` (or `EOF`), so cast the `char` first: `static_cast<unsigned char>(c)`. Passing a negative `char` is undefined behaviour. Taking `line` by value is fine here; use `const string&` when you do not need a copy.

## Common bugs
Comparing spaces and punctuation; forgetting case folding; skipping only one end; using `left <= right` (harmless, but a sign you did not reason about the middle character); passing `char` straight to `isalnum`.

## Follow-ups
Allow deleting at most one character (Valid Palindrome II). Find the longest palindromic substring (expand around centres). Do it on a linked list.

## Similar problems
Valid Palindrome (LeetCode 125).
