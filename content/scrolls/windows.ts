import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #4 "variable sliding window with a count map". Template equals content/problems/R3/tidy-tape/solution.cpp (tested). */
export const variableWindowScroll: Scroll = {
  id: "variable-window",
  cur: 4,
  title: "Scroll of the Elastic Frame",
  region: "R3",
  blurb: "Grow the right edge every step, shrink the left edge only while the window is broken.",
  problemId: "tidy-tape",
  template: `class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};  // occurrences of each letter inside the window [left, right]
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            ++count[c];
            while (count[c] > m) {  // only the new letter can be over the limit
                --count[tape[left] - 'a'];
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
`,
  annotations: [
    { line: 4, note: "The count map: one counter per letter for exactly the letters inside the window. A fixed array beats unordered_map when the alphabet is small." },
    { line: 5, note: "left is the first index inside the window. right is the last. The window is always [left, right]." },
    { line: 7, note: "Every index becomes right exactly once: the right edge only moves forward." },
    { line: 9, note: "Add the new element to the window before checking whether the window is still valid." },
    { line: 10, note: "Shrink while broken. The window was valid before this step, so only the new letter can be over the limit." },
    { line: 11, note: "Remove the element at left from the counts first, then move left past it. Reversing the two lines removes the wrong letter." },
    { line: 12, note: "left only moves forward too, so left and right together make at most 2n moves: O(n) overall, not O(n^2)." },
    { line: 14, note: "Record the answer after the window is valid again. The window [left, right] is the longest valid one ending at right." },
  ],
  traceCardIds: [
    "forge-variable-window-trace-basic",
    "forge-variable-window-trace-limit",
    "forge-variable-window-trace-all-same",
    "forge-variable-window-trace-empty",
    "forge-variable-window-trace-tight",
  ],
  commonBugs: [
    "Using `if` instead of `while` to shrink: one removal may not be enough, so the window stays broken.",
    "Updating `best` before shrinking records a broken window as the answer.",
    "Moving `left` before decrementing `count[tape[left]]` removes the wrong letter.",
    "Re-counting the whole window every step turns O(n) into O(n^2).",
    "A variable window needs a monotone rule (shrinking never makes it worse). With negative numbers and sums it breaks; use prefix sums there.",
  ],
};

/** CUR §4 #7 "monotonic deque (window max)". Template equals content/problems/R3/pane-peaks/solution.cpp (tested). */
export const monotonicDequeScroll: Scroll = {
  id: "monotonic-deque",
  cur: 7,
  title: "Scroll of the Hot Front",
  region: "R3",
  blurb: "Keep a deque of indices whose values fall from front to back; the front is always the window maximum.",
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
    { line: 6, note: "Reserve the exact number of frame positions, n - width + 1, so the vector never reallocates." },
    { line: 7, note: "Store indices, not values: the index tells you both the value (heat[idx]) and when it expires." },
    { line: 9, note: "Dominance: an older value that is not larger than the new one can never win again. It leaves the window sooner and is no bigger." },
    { line: 10, note: "Pop from the back while the back is dominated. Using <= (not <) keeps equal values from piling up." },
    { line: 11, note: "The new index always joins at the back, so indices increase from front to back and values decrease." },
    { line: 13, note: "Expiry: only the front can be out of the frame, because indices increase. One `if` is enough since at most one index leaves per step." },
    { line: 14, note: "The first full frame ends at index width - 1; before that there is no answer to record. The front is the maximum." },
  ],
  traceCardIds: [
    "forge-monotonic-deque-trace-basic",
    "forge-monotonic-deque-trace-equal",
    "forge-monotonic-deque-trace-width-one",
    "forge-monotonic-deque-trace-rising",
    "forge-monotonic-deque-trace-falling",
  ],
  commonBugs: [
    "Storing values instead of indices makes expiry impossible to detect.",
    "Popping with `<` instead of `<=` keeps duplicates; the deque still works but grows, and mistakes appear if you later rely on strict order.",
    "Checking expiry with `front() < i - width` is off by one: the frame is [i - width + 1, i], so index i - width has already left.",
    "Recording answers before `i >= width - 1` emits partial frames.",
    "Scanning the frame for its maximum at each step is O(n * width) and times out on large inputs.",
  ],
};
