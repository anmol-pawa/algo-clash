class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        unordered_map<long long, long long> seen;  // Wrong: the empty prefix (total 0) is never seeded.
        long long prefix = 0, count = 0;
        for (const int x : nums) {
            prefix += x;
            const auto it = seen.find(prefix - target);
            if (it != seen.end()) count += it->second;
            ++seen[prefix];
        }
        return count;
    }
};
