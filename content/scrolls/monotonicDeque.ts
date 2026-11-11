import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #7 "monotonic deque (window max)". Template equals content/problems/R3/pane-peaks/solution.cpp (tested). */
export const monotonicDequeScroll: Scroll = {
  id: "monotonic-deque",
  cur: 7,
  title: "Scroll of the Fading Candidates",
  region: "R3",
  blurb: "Keep a deque of indices whose values only decrease, so the front is always the window maximum.",
  problemId: "pane-peaks",
  template: `class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        answer.reserve(n - width + 1);
        deque<int> window;  // indices; heat[] strictly non-increasing from front to back, front is the max
        for (int i = 0; i < n; ++i) {
            // A smaller pane to the left of i can never be the maximum again: i is hotter and leaves later.
            while (!window.empty() && heat[window.back()] <= heat[i]) window.pop_back();
            window.push_back(i);
            // The front may have slid out of the frame [i - width + 1, i].
            if (window.front() <= i - width) window.pop_front();
            if (i >= width - 1) answer.push_back(heat[window.front()]);
        }
        return answer;
    }
};
`,
  annotations: [
    { line: 6, note: "The answer has exactly n - width + 1 entries; reserving avoids reallocation." },
    { line: 7, note: "Store indices, not values: we need the value to compare and the index to know when it leaves the frame." },
    { line: 10, note: "Pop from the back while the back is <= the newcomer. It is older and no larger, so it can never be a maximum again. Use <=, which also drops duplicates." },
    { line: 11, note: "After the pops the deque is strictly decreasing front to back, and the new index goes at the back." },
    { line: 13, note: "Only the front can expire, and at most one index expires per step, so a single if suffices (a while would also be correct)." },
    { line: 14, note: "Start reporting once the first full frame exists (i = width - 1); the front is then the frame's maximum." },
  ],
  traceCardIds: [
    "forge-monotonic-deque-trace-basic",
    "forge-monotonic-deque-trace-equal",
    "forge-monotonic-deque-trace-single",
    "forge-monotonic-deque-trace-full",
    "forge-monotonic-deque-trace-expiry",
  ],
  commonBugs: [
    "Storing values instead of indices: you cannot tell when the front has slid out of the frame.",
    "Forgetting to expire the front, so a hot pane that left the frame keeps winning.",
    "Reporting before the first full frame, adding width - 1 bogus entries.",
    "Using a priority_queue: O(n log n) and it needs lazy deletion; the deque is O(n) and exact.",
    "Popping the back with `<` and keeping equal values lets the deque grow to the full window on constant input.",
  ],
};
