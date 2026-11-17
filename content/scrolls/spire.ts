import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #6 "monotonic stack (next greater)". Template equals content/problems/R6/heat-wave/solution.cpp (tested). */
export const nextGreaterScroll: Scroll = {
  id: "next-greater",
  cur: 6,
  title: "Scroll of the Waiting Stack",
  region: "R6",
  blurb: "Keep a stack of items still waiting for something bigger; each newcomer settles the ones it beats.",
  problemId: "heat-wave",
  template: `class Solution {
public:
    vector<int> waitDays(vector<int>& temps) {
        const int n = static_cast<int>(temps.size());
        vector<int> wait(n, 0);
        vector<int> pending;  // indices still waiting for a hotter day; their temps never increase
        for (int i = 0; i < n; ++i) {
            while (!pending.empty() && temps[pending.back()] < temps[i]) {
                wait[pending.back()] = i - pending.back();
                pending.pop_back();
            }
            pending.push_back(i);
        }
        return wait;
    }
};
`,
  annotations: [
    { line: 4, note: "Take the size once, as an int, so the loop compares like with like and never mixes signed and unsigned." },
    { line: 5, note: "Zero is the answer for a day nobody ever beats, so every slot starts at 0 and only the settled days are overwritten." },
    { line: 6, note: "Indices, not values: a value alone could not tell us how far away the day is. Invariant: the temperatures at these indices never increase from bottom to top." },
    { line: 8, note: "Strict less-than: an equal reading is not hotter, so it stays waiting. Test the stack for empty first, or back() is undefined behaviour." },
    { line: 9, note: "The top day has just met its first hotter day, i, so its wait is the distance i - top." },
    { line: 10, note: "Pop only after reading back(); each index is pushed once and popped at most once, which is why the whole sweep is O(n) despite the nested loop." },
    { line: 12, note: "Push today after settling everyone it beats; today now waits for its own hotter day, and the order of the stack stays non-increasing." },
    { line: 14, note: "Days still on the stack never met a hotter day, and their slots already hold the required 0." },
  ],
  traceCardIds: [
    "forge-next-greater-trace-basic",
    "forge-next-greater-trace-equal",
    "forge-next-greater-trace-dip",
    "forge-next-greater-trace-empty",
    "forge-next-greater-trace-rising",
  ],
  commonBugs: [
    "Using <= in the while condition settles equal readings, but equal is not hotter.",
    "Storing values on the stack loses the index, so the distance cannot be computed.",
    "Calling pending.back() on an empty stack is undefined behaviour; test empty() first, in that order.",
    "Popping before reading back() writes the answer for the wrong day.",
    "Scanning forward from every day for a hotter one is O(n^2) and times out on a long falling run.",
  ],
};

/** CUR §4 #6 variant: the zero-sentinel sweep for histograms. Template equals content/problems/R6/skyline-hall/solution.cpp (tested). */
export const sentinelSweepScroll: Scroll = {
  id: "sentinel-sweep",
  cur: 6,
  title: "Scroll of the Zero Sentinel",
  region: "R6",
  blurb: "Sweep one step past the end with a height of zero so the stack flushes and every bar gets its widest rectangle.",
  problemId: "skyline-hall",
  template: `class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        vector<int> stack;  // indices with non-decreasing heights
        long long best = 0;
        for (int i = 0; i <= n; ++i) {
            const long long cur = (i == n) ? 0 : heights[i];  // height 0 sentinel flushes the stack
            while (!stack.empty() && heights[stack.back()] > cur) {
                const long long h = heights[stack.back()];
                stack.pop_back();
                const int left = stack.empty() ? -1 : stack.back();  // nearest shorter-or-equal on the left
                best = max(best, h * (i - left - 1));
            }
            stack.push_back(i);
        }
        return best;
    }
};
`,
  annotations: [
    { line: 4, note: "Cast the size once. The loop below runs to n inclusive, so the type has to be signed." },
    { line: 5, note: "Indices of bars whose heights never decrease from bottom to top: a bar stays here while it can still stretch to the right." },
    { line: 6, note: "long long: a 2e9-high bar of width 3 is 6e9, which overflows a 32-bit int." },
    { line: 7, note: "i <= n on purpose: step n is a virtual bar that is not in the array." },
    { line: 8, note: "The sentinel has height 0, lower than any real bar, so it pops everything left. This replaces a second cleanup loop after the sweep." },
    { line: 9, note: "Pop while the top is strictly taller than the newcomer; that newcomer is the first bar on the right that is shorter, so it is the top's right wall." },
    { line: 10, note: "Read the height before popping; afterwards the top is a different bar." },
    { line: 12, note: "After the pop, the new top (or -1 if none) is the nearest bar on the left that is not taller: the left wall of the rectangle." },
    { line: 13, note: "Width is the open gap between the two walls, i - left - 1; the rectangle is as tall as the popped bar. Keep the maximum." },
    { line: 15, note: "Push the newcomer after the pops, keeping the stack non-decreasing. Equal heights stay: the older equal bar still gives the same, wider rectangle." },
  ],
  traceCardIds: [
    "forge-sentinel-sweep-trace-basic",
    "forge-sentinel-sweep-trace-empty",
    "forge-sentinel-sweep-trace-flat",
    "forge-sentinel-sweep-trace-rising",
    "forge-sentinel-sweep-trace-big",
  ],
  commonBugs: [
    "Forgetting the sentinel leaves bars on the stack unprocessed, so a rising histogram returns 0 or too little.",
    "Computing width as i - left instead of i - left - 1 counts the wall itself.",
    "Treating an empty stack's left wall as 0 instead of -1 loses one column of width.",
    "int for the area overflows for tall, wide histograms.",
    "Trying every pair of bars with a running minimum is O(n^2) and times out.",
  ],
};
