class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        unordered_map<long long, int> seen;
        seen[0] = 1;
        long long prefix = 0;
        int count = 0;  // Wrong: the count reaches ~5 * 10^9 and overflows int.
        for (const int x : nums) {
            prefix += x;
            const auto it = seen.find(prefix - target);
            if (it != seen.end()) count += it->second;
            ++seen[prefix];
        }
        return count;
    }
};
