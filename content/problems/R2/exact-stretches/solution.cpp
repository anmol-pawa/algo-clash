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
