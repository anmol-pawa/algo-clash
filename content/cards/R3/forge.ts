import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R3 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const TIDY = `#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

class Solution {
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
`;

const PEAKS = `#include <deque>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
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

void show(const vector<int>& v) {
    for (size_t i = 0; i < v.size(); ++i) cout << (i ? " " : "") << v[i];
    cout << "\\n";
}
`;

const tag = (scroll: string) => ["forge", scroll, "trace"];

export const forgeR3Cards: Card[] = [
  {
    id: "forge-variable-window-trace-basic", kind: "trace", region: "R3", tags: tag("variable-window"),
    prompt: "What does this program print?",
    code: `${TIDY}
int main() {
    cout << Solution().longestTidy("abcabcbb", 1) << "\\n";
}
`,
    explanation: "With m = 1 no letter may repeat. The longest all-different stretch is \"abc\" (or \"bca\", \"cab\"), length 3. When the second a arrives, left moves past the first a.",
  },
  {
    id: "forge-variable-window-trace-limit", kind: "trace", region: "R3", tags: tag("variable-window"),
    prompt: "Each letter may appear twice. What is printed?",
    code: `${TIDY}
int main() {
    cout << Solution().longestTidy("aabaabaa", 2) << "\\n";
}
`,
    explanation: "The best stretch is \"baab\": two b and two a, length 4. Any stretch of 5 holds at least three a, so the window must shrink before best is recorded.",
  },
  {
    id: "forge-variable-window-trace-all-same", kind: "trace", region: "R3", tags: tag("variable-window"),
    prompt: "The limit is larger than the tape. What is printed?",
    code: `${TIDY}
int main() {
    cout << Solution().longestTidy("zzzz", 10) << "\\n";
}
`,
    explanation: "count[z] never exceeds 10, so the while loop never runs, left stays 0 and best becomes 4.",
  },
  {
    id: "forge-variable-window-trace-empty", kind: "trace", region: "R3", tags: tag("variable-window"),
    prompt: "An empty tape. What is printed?",
    code: `${TIDY}
int main() {
    cout << Solution().longestTidy("", 1) << "\\n";
}
`,
    explanation: "The for loop never runs, so best keeps its initial value 0.",
  },
  {
    id: "forge-variable-window-trace-tight", kind: "trace", region: "R3", tags: tag("variable-window"),
    prompt: "One occurrence allowed, but only two letters alternate. What is printed?",
    code: `${TIDY}
int main() {
    cout << Solution().longestTidy("ababab", 1) << "\\n";
}
`,
    explanation: "Each time a letter repeats, the window shrinks until the older copy is gone, so it never holds more than \"ab\" or \"ba\": 2.",
  },
  {
    id: "forge-monotonic-deque-trace-basic", kind: "trace", region: "R3", tags: tag("monotonic-deque"),
    prompt: "What does this program print?",
    code: `${PEAKS}
int main() {
    show(Solution().paneMaxima({2, 7, 1, 5, 3}, 3));
}
`,
    explanation: "Frames are [2 7 1], [7 1 5], [1 5 3] with maxima 7, 7, 5. The 7 stays at the front until index 1 leaves the frame.",
  },
  {
    id: "forge-monotonic-deque-trace-equal", kind: "trace", region: "R3", tags: tag("monotonic-deque"),
    prompt: "All readings are equal. What is printed?",
    code: `${PEAKS}
int main() {
    show(Solution().paneMaxima({4, 4, 4}, 2));
}
`,
    explanation: "Popping with <= removes the older equal value, so the deque keeps only the newest index. Both frames have maximum 4.",
  },
  {
    id: "forge-monotonic-deque-trace-width-one", kind: "trace", region: "R3", tags: tag("monotonic-deque"),
    prompt: "Frame width 1 with negatives. What is printed?",
    code: `${PEAKS}
int main() {
    show(Solution().paneMaxima({-3, -8, -1}, 1));
}
`,
    explanation: "Each frame is a single pane, so the answer is the input itself. The front index expires at every step because i - width equals the previous index.",
  },
  {
    id: "forge-monotonic-deque-trace-rising", kind: "trace", region: "R3", tags: tag("monotonic-deque"),
    prompt: "Readings rise steadily. What is printed?",
    code: `${PEAKS}
int main() {
    show(Solution().paneMaxima({1, 2, 3, 4, 5}, 3));
}
`,
    explanation: "Each new value dominates and pops everything before it, so the deque has size 1 and the maximum is the newest pane: 3 4 5.",
  },
  {
    id: "forge-monotonic-deque-trace-falling", kind: "trace", region: "R3", tags: tag("monotonic-deque"),
    prompt: "Readings fall steadily. What is printed?",
    code: `${PEAKS}
int main() {
    show(Solution().paneMaxima({5, 4, 3, 2, 1}, 3));
}
`,
    explanation: "Nothing is ever popped from the back; the deque holds the whole frame. The front is the oldest pane, which expires one step at a time: 5 4 3.",
  },
];
