import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #5 "prefix sum + hash map". Template equals content/problems/R2/exact-stretches/solution.cpp (tested). */
export const prefixHashScroll: Scroll = {
  id: "prefix-hash",
  cur: 5,
  title: "Scroll of the Earlier Prefix",
  region: "R2",
  blurb: "Count stretches with a given sum by looking up an earlier prefix in a hash map.",
  problemId: "exact-stretches",
  template: `class Solution {
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
`,
  annotations: [
    { line: 5, note: "Key = a prefix total, value = how many times it has occurred. long long: prefixes of 10^5 values can pass 2^31." },
    { line: 6, note: "Seed the empty prefix. Without it, stretches that start at index 0 are never counted." },
    { line: 8, note: "Walk left to right; the prefix always describes nums[0..i]." },
    { line: 9, note: "Update the running total before the lookup so the stretch may end at this element." },
    { line: 11, note: "stretch (j, i] sums to target exactly when prefix[j] = prefix[i] - target. Use find, not operator[], so a miss inserts nothing." },
    { line: 12, note: "Add how many earlier prefixes match, not just 1: duplicates are different start points." },
    { line: 13, note: "Record this prefix only after the lookup, so an element never pairs with itself when target is 0." },
  ],
  traceCardIds: [
    "forge-prefix-hash-trace-basic",
    "forge-prefix-hash-trace-zeros",
    "forge-prefix-hash-trace-negative",
    "forge-prefix-hash-trace-none",
    "forge-prefix-hash-trace-wide",
  ],
  commonBugs: [
    "Forgetting `seen[0] = 1` misses every stretch that begins at the first element.",
    "Inserting the current prefix before the lookup makes target 0 count empty stretches.",
    "Using a sliding window here is wrong: negatives break the monotone shrink rule.",
    "`int` prefixes overflow; keep the map and the running total in long long.",
    "`seen[prefix - target]` in the lookup inserts junk keys; use `find`.",
  ],
};
