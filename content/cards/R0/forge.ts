import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const POUCH = `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        long long total = 0;
        for (const auto& coin : coins) {
            if (coin >= minValue) total += coin;
        }
        return total;
    }
};
`;

export const forgeCards: Card[] = [
  {
    id: "forge-accumulate-trace-basic", kind: "trace", region: "R0", tags: ["forge", "accumulate", "trace"],
    prompt: "What does this program print?",
    code: `${POUCH}
int main() {
    cout << Solution().pouchSum({5, 1, 7, 3}, 4) << "\\n";
}
`,
    explanation: "The 5 and the 7 pass the filter (>= 4); the 1 and the 3 are skipped. 5 + 7 = 12.",
  },
  {
    id: "forge-accumulate-trace-boundary", kind: "trace", region: "R0", tags: ["forge", "accumulate", "boundary"],
    prompt: "Every coin equals minValue. What is printed?",
    code: `${POUCH}
int main() {
    cout << Solution().pouchSum({4, 4, 4}, 4) << "\\n";
}
`,
    explanation: "\"At least\" means >=, so a coin exactly equal to minValue is accepted: 4 + 4 + 4 = 12. With a strict > the answer would be 0.",
  },
  {
    id: "forge-accumulate-trace-wide", kind: "trace", region: "R0", tags: ["forge", "accumulate", "long-long"],
    prompt: "Two heavy coins. What is printed?",
    code: `${POUCH}
int main() {
    cout << Solution().pouchSum({2000000000, 2000000000}, 1) << "\\n";
}
`,
    explanation: "The total 4,000,000,000 is more than an int can hold (about 2.1 billion), but `total` is a long long, so the sum is exact. An `int total` would overflow.",
  },
  {
    id: "forge-accumulate-trace-adds", kind: "trace", region: "R0", tags: ["forge", "accumulate", "loop"],
    prompt: "The loop is instrumented with two counters. Which pair of numbers is printed (looked at, added)?",
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> coins = {5, 1, 7, 3, 4};
    int minValue = 4;
    long long total = 0;
    int looked = 0, added = 0;
    for (const auto& coin : coins) {
        ++looked;
        if (coin >= minValue) {
            total += coin;
            ++added;
        }
    }
    cout << looked << " " << added << "\\n";
}
`,
    explanation: "The loop looks at all 5 coins. The 5, the 7 and the 4 pass (>= 4), the 1 and the 3 do not, so the addition runs 3 times.",
  },
  {
    id: "forge-accumulate-trace-empty", kind: "trace", region: "R0", tags: ["forge", "accumulate", "edge"],
    prompt: "No coin reaches minValue. What is printed?",
    code: `${POUCH}
int main() {
    cout << Solution().pouchSum({1, 2, 3}, 10) << " " << Solution().pouchSum({}, 0) << "\\n";
}
`,
    explanation: "Nothing passes the filter and an empty pouch has nothing to loop over, so `total` keeps its initial 0 both times. Initialising the accumulator to 0 is what makes the empty case free.",
  },
];
