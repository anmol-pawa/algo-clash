## Nudge
In `"aaaa"` the phrase `"aa"` starts at positions 0, 1 and 2. After you find one match, where should the next search begin?
## Approach
Use `text.find(pat, from)` in a loop. Each time it returns a position `pos`, count it and continue from `pos + 1`. Stop when it returns `string::npos`.
## Key insight
Searching from `pos + pat.size()` skips overlapping matches. Also avoid `text.substr(i)` inside the loop: `substr` copies, and copying a suffix at every position is O(n^2) work. Pass a start position to `find` instead, which copies nothing.
