import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R2 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const STRETCHES = `#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        // seen[p] = how many prefixes so far (including the empty one) have total p.
        unordered_map<long long, long long> seen;
        seen[0] = 1;
        long long prefix = 0, count = 0;
        for (const int x : nums) {
            prefix += x;
            // A stretch ending here sums to target iff an earlier prefix equals prefix - target.
            const auto it = seen.find(prefix - target);
            if (it != seen.end()) count += it->second;
            ++seen[prefix];
        }
        return count;
    }
};
`;

const BASIN = `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
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
`;

export const forgeR2Cards: Card[] = [
  {
    id: "forge-prefix-hash-trace-basic", kind: "trace", region: "R2", tags: ["forge", "prefix-hash", "trace"],
    prompt: "What does this program print?",
    code: `${STRETCHES}
int main() {
    cout << Solution().countStretches({1, 2, 3}, 3) << "\\n";
}
`,
    explanation: "The stretches [1, 2] and [3] add to 3, so the answer is 2. [1, 2, 3] adds to 6.",
  },
  {
    id: "forge-prefix-hash-trace-zeros", kind: "trace", region: "R2", tags: ["forge", "prefix-hash", "trace"],
    prompt: "Every element is zero and the target is zero. What is printed?",
    code: `${STRETCHES}
int main() {
    cout << Solution().countStretches({0, 0, 0}, 0) << "\\n";
}
`,
    explanation: "Every non-empty stretch sums to 0: three of length 1, two of length 2, one of length 3, so 6. The map counts duplicate prefixes (all 0), which is why we add the stored count and not just 1.",
  },
  {
    id: "forge-prefix-hash-trace-negative", kind: "trace", region: "R2", tags: ["forge", "prefix-hash", "trace"],
    prompt: "Negatives are allowed. What is printed?",
    code: `${STRETCHES}
int main() {
    cout << Solution().countStretches({1, -1, 1, -1}, 0) << "\\n";
}
`,
    explanation: "Prefixes are 0, 1, 0, 1, 0. Pairs of equal prefixes are the zero-sum stretches: three 0s give 3 pairs, two 1s give 1 pair, so 4.",
  },
  {
    id: "forge-prefix-hash-trace-none", kind: "trace", region: "R2", tags: ["forge", "prefix-hash", "trace"],
    prompt: "No stretch reaches the target. What is printed?",
    code: `${STRETCHES}
int main() {
    cout << Solution().countStretches({5, 6}, 100) << "\\n";
}
`,
    explanation: "No earlier prefix ever equals prefix - 100, so count stays 0. Using find means the misses do not insert anything into the map.",
  },
  {
    id: "forge-prefix-hash-trace-wide", kind: "trace", region: "R2", tags: ["forge", "prefix-hash", "trace"],
    prompt: "Large values and a long long target. What is printed?",
    code: `${STRETCHES}
int main() {
    cout << Solution().countStretches({2000000000, 2000000000, 2000000000}, 4000000000LL) << "\\n";
}
`,
    explanation: "Prefixes are 2e9, 4e9, 6e9. The stretches [2e9, 2e9] starting at index 0 and at index 1 both sum to 4e9, so 2. The prefixes exceed int range, which is why they are long long.",
  },
  {
    id: "forge-opposite-trace-basic", kind: "trace", region: "R2", tags: ["forge", "opposite", "trace"],
    prompt: "What does this program print?",
    code: `${BASIN}
int main() {
    cout << Solution().bestBasin({1, 8, 6, 2, 5, 4, 8, 3, 7}) << "\\n";
}
`,
    explanation: "The 8 at index 1 with the 7 at index 8 gives width 7 times height min(8, 7) = 7, so 49. The two 8s (indices 1 and 6) only give 5 * 8 = 40.",
  },
  {
    id: "forge-opposite-trace-tie", kind: "trace", region: "R2", tags: ["forge", "opposite", "trace"],
    prompt: "Three equal walls. What is printed?",
    code: `${BASIN}
int main() {
    cout << Solution().bestBasin({5, 5, 5}) << "\\n";
}
`,
    explanation: "The outer pair has width 2 and height 5, so 10. When the walls tie, the else branch moves right inward, and the later pairs only get narrower.",
  },
  {
    id: "forge-opposite-trace-single", kind: "trace", region: "R2", tags: ["forge", "opposite", "trace"],
    prompt: "Only one wall. What is printed?",
    code: `${BASIN}
int main() {
    cout << Solution().bestBasin({7}) << "\\n";
}
`,
    explanation: "left = 0 and right = 0, so the loop never runs and best stays 0. One wall cannot hold water.",
  },
  {
    id: "forge-opposite-trace-valley", kind: "trace", region: "R2", tags: ["forge", "opposite", "trace"],
    prompt: "Tall walls far apart, a low valley between. What is printed?",
    code: `${BASIN}
int main() {
    cout << Solution().bestBasin({9, 1, 1, 1, 9}) << "\\n";
}
`,
    explanation: "The first pair is the two 9s at width 4: 4 * 9 = 36. Nothing narrower can do better.",
  },
  {
    id: "forge-opposite-trace-wide", kind: "trace", region: "R2", tags: ["forge", "opposite", "trace"],
    prompt: "Huge walls. What is printed?",
    code: `${BASIN}
int main() {
    cout << Solution().bestBasin({2000000000, 0, 0, 0, 2000000000}) << "\\n";
}
`,
    explanation: "Width 4 times height 2e9 = 8e9, which needs long long. The width is widened before the multiplication, so nothing overflows.",
  },
];
