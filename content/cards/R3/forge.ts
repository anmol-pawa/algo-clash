import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R3 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const COVER = `#include <array>
#include <iostream>
#include <string>
using namespace std;

class Solution {
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
`;

export const forgeR3Cards: Card[] = [
  {
    id: "forge-variable-window-trace-basic", kind: "trace", region: "R3", tags: ["forge", "variable-window", "trace"],
    prompt: "What does this program print (note the quotes)?",
    code: `${COVER}
int main() {
    const string r = Solution().smallestCover("xaybzacb", "abc");
    cout << '"' << r << '"' << "\\n";
}
`,
    explanation: "Windows that cover a, b and c: \"xaybzac\" (7), then shrinking gives \"aybzac\", \"bzac\" (4) and finally \"acb\" (3). Nothing shorter covers, so \"acb\".",
  },
  {
    id: "forge-variable-window-trace-ties", kind: "trace", region: "R3", tags: ["forge", "variable-window", "trace"],
    prompt: "Two letters needed, only one cover. What is printed?",
    code: `${COVER}
int main() {
    const string r = Solution().smallestCover("aab", "ab");
    cout << '"' << r << '"' << "\\n";
}
`,
    explanation: "The first window to cover is \"aab\"; shrinking drops the leading a and keeps coverage, giving \"ab\" (length 2). This is why the shrink is a while loop.",
  },
  {
    id: "forge-variable-window-trace-repeat", kind: "trace", region: "R3", tags: ["forge", "variable-window", "trace"],
    prompt: "The charms repeat a letter. What is printed?",
    code: `${COVER}
int main() {
    const string r = Solution().smallestCover("abca", "aa");
    cout << '"' << r << '"' << "\\n";
}
`,
    explanation: "Two copies of a are required, and they sit at the ends, so the only cover is the whole tape \"abca\". Counting distinct letters instead of copies would wrongly return \"a\".",
  },
  {
    id: "forge-variable-window-trace-none", kind: "trace", region: "R3", tags: ["forge", "variable-window", "trace"],
    prompt: "No cover exists. What is printed?",
    code: `${COVER}
int main() {
    const string r = Solution().smallestCover("xyz", "w");
    cout << '"' << r << '"' << "\\n";
}
`,
    explanation: "missing never reaches 0, so bestLen keeps the sentinel n + 1 = 4 and the function returns the empty string: the program prints two quote marks with nothing between them.",
  },
  {
    id: "forge-variable-window-trace-case", kind: "trace", region: "R3", tags: ["forge", "variable-window", "trace"],
    prompt: "Upper and lower case are different letters. What is printed?",
    code: `${COVER}
int main() {
    const string r = Solution().smallestCover("abAB", "aB");
    cout << '"' << r << '"' << "\\n";
}
`,
    explanation: "Needs one a and one B. The only a is at index 0 and the only B at index 3, so the cover is the whole tape \"abAB\"; the b and A in between do not count.",
  },
  {
    id: "forge-monotonic-deque-trace-basic", kind: "trace", region: "R3", tags: ["forge", "monotonic-deque", "trace"],
    prompt: "What does this program print?",
    code: `${PEAKS}
int main() {
    for (const int v : Solution().paneMaxima({2, 7, 1, 5, 3}, 3)) cout << v << " ";
    cout << "\\n";
}
`,
    explanation: "Frames [2,7,1], [7,1,5], [1,5,3] have maxima 7, 7, 5. The deque holds indices; 7 stays at the front until it leaves the frame.",
  },
  {
    id: "forge-monotonic-deque-trace-equal", kind: "trace", region: "R3", tags: ["forge", "monotonic-deque", "trace"],
    prompt: "Equal values. What is printed?",
    code: `${PEAKS}
int main() {
    for (const int v : Solution().paneMaxima({4, 4, 4}, 2)) cout << v << " ";
    cout << "\\n";
}
`,
    explanation: "Each frame of two has maximum 4, so the output is \"4 4\". Popping with <= replaces the older 4 by the newer one, which leaves the frame later.",
  },
  {
    id: "forge-monotonic-deque-trace-single", kind: "trace", region: "R3", tags: ["forge", "monotonic-deque", "trace"],
    prompt: "Width 1. What is printed?",
    code: `${PEAKS}
int main() {
    for (const int v : Solution().paneMaxima({-3, -8, -1}, 1)) cout << v << " ";
    cout << "\\n";
}
`,
    explanation: "Each frame is a single pane, so the output is the array itself: -3 -8 -1. The deque never holds more than one index, and negatives need no special handling.",
  },
  {
    id: "forge-monotonic-deque-trace-full", kind: "trace", region: "R3", tags: ["forge", "monotonic-deque", "trace"],
    prompt: "The frame is as wide as the array. What is printed?",
    code: `${PEAKS}
int main() {
    for (const int v : Solution().paneMaxima({9, 1, 2}, 3)) cout << v << " ";
    cout << "\\n";
}
`,
    explanation: "Only one frame exists, so one number is printed: 9. Nothing is reported before i = width - 1 = 2.",
  },
  {
    id: "forge-monotonic-deque-trace-expiry", kind: "trace", region: "R3", tags: ["forge", "monotonic-deque", "trace"],
    prompt: "A hot pane early on, then cold ones. What is printed?",
    code: `${PEAKS}
int main() {
    for (const int v : Solution().paneMaxima({5, 1, 1, 1, 2}, 2)) cout << v << " ";
    cout << "\\n";
}
`,
    explanation: "Frames: [5,1]=5, [1,1]=1, [1,1]=1, [1,2]=2. After the first frame the 5 at index 0 expires (0 <= i - width), so later maxima come from the remaining candidates.",
  },
];
