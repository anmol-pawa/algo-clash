import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R6 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const HEAT = `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
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

void show(const vector<int>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) cout << (i ? ", " : "") << v[i];
    cout << "]\\n";
}
`;

const HALL = `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
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

`;

const tag = (scroll: string) => ["forge", scroll, "trace"];

export const forgeR6Cards: Card[] = [
  {
    id: "forge-next-greater-trace-basic", kind: "trace", region: "R6", tags: tag("next-greater"),
    prompt: "What does this program print?",
    code: `${HEAT}
int main() {
    vector<int> t = {30, 40, 35, 50, 45}; show(Solution().waitDays(t));
}
`,
    explanation: "Day 0 (30) is beaten by day 1: 1. Day 1 (40) is first beaten by day 3 (50): 2. Day 2 (35) is beaten by day 3: 1. Days 3 and 4 never meet a hotter day: 0, 0.",
  },
  {
    id: "forge-next-greater-trace-equal", kind: "trace", region: "R6", tags: tag("next-greater"),
    prompt: "Equal readings. What is printed?",
    code: `${HEAT}
int main() {
    vector<int> t = {60, 60, 60}; show(Solution().waitDays(t));
}
`,
    explanation: "The test is strictly less-than, so an equal reading never pops anything. All three days stay on the stack and keep their initial 0.",
  },
  {
    id: "forge-next-greater-trace-dip", kind: "trace", region: "R6", tags: tag("next-greater"),
    prompt: "A falling run, then a spike. What is printed?",
    code: `${HEAT}
int main() {
    vector<int> t = {9, 8, 7, 10}; show(Solution().waitDays(t));
}
`,
    explanation: "The stack grows to indices 0, 1, 2. Day 3 (10) pops all three at once, writing 3 - 0, 3 - 1 and 3 - 2: 3, 2, 1, then 0 for day 3.",
  },
  {
    id: "forge-next-greater-trace-empty", kind: "trace", region: "R6", tags: tag("next-greater"),
    prompt: "An empty list. What is printed?",
    code: `${HEAT}
int main() {
    vector<int> t; show(Solution().waitDays(t));
}
`,
    explanation: "n = 0, the loop never runs and the empty vector is returned, so show prints [].",
  },
  {
    id: "forge-next-greater-trace-rising", kind: "trace", region: "R6", tags: tag("next-greater"),
    prompt: "Every day hotter than the last. What is printed?",
    code: `${HEAT}
int main() {
    vector<int> t = {1, 2, 3, 4}; show(Solution().waitDays(t));
}
`,
    explanation: "Each new day pops the single day before it, so the stack never holds more than one index: 1, 1, 1, and 0 for the last day.",
  },
  {
    id: "forge-sentinel-sweep-trace-basic", kind: "trace", region: "R6", tags: tag("sentinel-sweep"),
    prompt: "What does this program print?",
    code: `${HALL}
int main() {
    vector<int> h = {2, 1, 5, 6, 2, 3}; cout << Solution().largestHall(h) << "\\n";
}
`,
    explanation: "The 2 at index 4 pops the 6 (area 6) and then the 5, whose walls are the 1 and the 2: width 2, area 10. The later areas (3, 8 and 6 from the flush) are all smaller: 10.",
  },
  {
    id: "forge-sentinel-sweep-trace-empty", kind: "trace", region: "R6", tags: tag("sentinel-sweep"),
    prompt: "An empty histogram. What is printed?",
    code: `${HALL}
int main() {
    vector<int> h; cout << Solution().largestHall(h) << "\\n";
}
`,
    explanation: "n = 0, so the loop runs once for the sentinel at i = 0. The stack is empty so nothing is popped and best stays 0.",
  },
  {
    id: "forge-sentinel-sweep-trace-flat", kind: "trace", region: "R6", tags: tag("sentinel-sweep"),
    prompt: "Three equal bars. What is printed?",
    code: `${HALL}
int main() {
    vector<int> h = {4, 4, 4}; cout << Solution().largestHall(h) << "\\n";
}
`,
    explanation: "Equal heights are never popped by each other, so all three wait for the sentinel. The last pop has an empty stack (left = -1) and width 3 - (-1) - 1 = 3, so the area is 4 * 3 = 12.",
  },
  {
    id: "forge-sentinel-sweep-trace-rising", kind: "trace", region: "R6", tags: tag("sentinel-sweep"),
    prompt: "Strictly rising bars. What is printed?",
    code: `${HALL}
int main() {
    vector<int> h = {1, 2, 3, 4, 5}; cout << Solution().largestHall(h) << "\\n";
}
`,
    explanation: "Nothing pops until the sentinel, which flushes 5, 4, 3, 2, 1 with widths 1, 2, 3, 4, 5: areas 5, 8, 9, 8, 5. The best is 9 (the bar of height 3, width 3).",
  },
  {
    id: "forge-sentinel-sweep-trace-big", kind: "trace", region: "R6", tags: tag("sentinel-sweep"),
    prompt: "Tall, wide bars. What is printed?",
    code: `${HALL}
int main() {
    vector<int> h = {2000000000, 2000000000, 2000000000}; cout << Solution().largestHall(h) << "\\n";
}
`,
    explanation: "The area is 2e9 * 3 = 6e9. best and the height h are long long, so the product is exact; with int it would overflow.",
  },
]
