import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #4 "variable sliding window with a count map". Template equals content/problems/R3/cover-strip/solution.cpp (tested). */
export const variableWindowScroll: Scroll = {
  id: "variable-window",
  cur: 4,
  title: "Scroll of the Breathing Frame",
  region: "R3",
  blurb: "Grow the right edge until the window is valid, then shrink the left edge while it stays valid.",
  problemId: "cover-strip",
  template: `class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};  // need[c] > 0: copies of c the window still lacks; <= 0: spare copies
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        int missing = static_cast<int>(charms.size());  // charm copies not yet covered
        int bestStart = 0;
        int bestLen = n + 1;  // n + 1 means "no cover found"
        int left = 0;
        for (int right = 0; right < n; ++right) {
            if (need[static_cast<unsigned char>(tape[right])]-- > 0) --missing;
            while (missing == 0) {  // window [left, right] covers: record it, then try to shrink
                if (right - left + 1 < bestLen) {  // strict '<' keeps the leftmost on ties
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                if (++need[static_cast<unsigned char>(tape[left])] > 0) ++missing;  // we dropped a needed copy
                ++left;
            }
        }
        return bestLen > n ? "" : tape.substr(bestStart, bestLen);
    }
};
`,
  annotations: [
    { line: 5, note: "One counter per letter. need[c] > 0 means the window still lacks copies of c; <= 0 means it holds spare ones. Index through unsigned char so the cast is never negative." },
    { line: 7, note: "missing counts charm copies not yet covered. The window is valid exactly when it reaches 0, so validity is an O(1) check." },
    { line: 9, note: "n + 1 is an impossible length: a sentinel for \"no cover found\", so no separate flag is needed." },
    { line: 11, note: "The right edge only moves forward: each letter enters the window once." },
    { line: 12, note: "Post-decrement: test the old value, then take the letter in. Only a copy that was still needed (old need > 0) lowers missing." },
    { line: 13, note: "while, not if: after one valid window, shrinking may keep it valid for several steps." },
    { line: 14, note: "Strict < keeps the leftmost window on ties, which the statement asks for." },
    { line: 18, note: "Release the left letter. If its need goes back above 0 we dropped a required copy, so the window is no longer valid." },
    { line: 19, note: "The left edge only moves forward too, so the whole scan is O(n + m) even with the nested loop." },
    { line: 22, note: "substr(start, length). Compare against n, not 0, to tell \"no cover\" from a real answer." },
  ],
  traceCardIds: [
    "forge-variable-window-trace-basic",
    "forge-variable-window-trace-ties",
    "forge-variable-window-trace-repeat",
    "forge-variable-window-trace-none",
    "forge-variable-window-trace-case",
  ],
  commonBugs: [
    "Using `if` instead of `while` to shrink: the window stays longer than necessary and the shortest cover is missed.",
    "Recording the answer before shrinking (or only after the loop) records a window that is not minimal.",
    "Tracking distinct letters instead of copies: \"aa\" would be satisfied by a single `a`.",
    "`<=` instead of `<` when comparing lengths returns the rightmost shortest window, not the leftmost.",
    "Returning `substr(bestStart, bestLen)` when nothing was found: bestLen is the sentinel, so guard it first.",
  ],
};
