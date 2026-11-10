import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #3 "two pointers (opposite)". Template equals content/problems/R2/widest-basin/solution.cpp (tested). */
export const oppositePointersScroll: Scroll = {
  id: "opposite-pointers",
  cur: 3,
  title: "Scroll of the Closing Walls",
  region: "R2",
  blurb: "Start at both ends and always discard the weaker end.",
  problemId: "widest-basin",
  template: `class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        long long best = 0;
        while (left < right) {
            const long long width = right - left;
            best = max(best, width * min(heights[left], heights[right]));
            // The shorter wall caps every basin it forms with anything closer, so it can never do better.
            if (heights[left] < heights[right]) ++left;
            else --right;
        }
        return best;
    }
};
`,
  annotations: [
    { line: 4, note: "One pointer per end. The cast keeps size() - 1 signed, so an empty vector gives -1, not a huge number." },
    { line: 5, note: "long long: width times height can pass 2^31." },
    { line: 6, note: "left < right: a basin needs two distinct walls; stop when the pointers meet." },
    { line: 7, note: "Widen to long long before multiplying, otherwise the product overflows in int first." },
    { line: 8, note: "The water level is set by the shorter wall." },
    { line: 9, note: "The invariant that justifies skipping: the shorter wall can only get narrower from here, so no basin using it can beat the current one." },
    { line: 10, note: "Move the shorter side inward. Moving the taller one can never help." },
  ],
  traceCardIds: [
    "forge-opposite-trace-basic",
    "forge-opposite-trace-tie",
    "forge-opposite-trace-single",
    "forge-opposite-trace-valley",
    "forge-opposite-trace-wide",
  ],
  commonBugs: [
    "Moving the taller wall instead of the shorter one can skip the optimal pair.",
    "`left <= right` lets a wall pair with itself (width 0 is harmless, but it hides the real stop condition).",
    "Computing `width * height` in int overflows for 10^5 walls of 10^5.",
    "`size() - 1` on an unsigned size_t wraps for an empty vector.",
  ],
};
