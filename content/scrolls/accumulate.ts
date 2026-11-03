import type { Scroll } from "@/lib/forge/types";

/** CUR §4 "starter scroll": the accumulate-with-a-filter loop. Template equals content/problems/R0/pouch-sum/solution.cpp (tested). */
export const accumulateScroll: Scroll = {
  id: "accumulate",
  cur: 0,
  title: "Scroll of the Running Total",
  region: "R0",
  blurb: "Loop over a vector and accumulate into a long long.",
  problemId: "pouch-sum",
  template: `class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        long long total = 0;  // 10^5 coins of 2 * 10^9 do not fit in int
        for (const auto& coin : coins) {
            if (coin >= minValue) total += coin;
        }
        return total;
    }
};
`,
  annotations: [
    { line: 3, note: "The return type is the accumulator's type: long long, because the sum can pass 2^31." },
    { line: 4, note: "Initialise the accumulator with its final type, at the identity value 0. An empty vector then returns 0 for free." },
    { line: 5, note: "Range-for over const references: read every element once, no copy, no index to get wrong." },
    { line: 6, note: "Filter first, then add. >= is \"at least\"; += promotes the int to long long before adding." },
    { line: 8, note: "Return the accumulator; nothing to narrow, no cast needed." },
  ],
  traceCardIds: [
    "forge-accumulate-trace-basic",
    "forge-accumulate-trace-boundary",
    "forge-accumulate-trace-wide",
    "forge-accumulate-trace-adds",
    "forge-accumulate-trace-empty",
  ],
  commonBugs: [
    "`int total` overflows silently once the sum passes about 2.1 billion.",
    "`std::accumulate(..., 0)` also sums in int: the start value's type decides the sum's type (use `0LL`).",
    "`>` instead of `>=` drops coins that equal the threshold.",
    "Looping to `size() - 1` skips the last element.",
  ],
};
