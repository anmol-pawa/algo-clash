class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        unordered_set<long long> seen{0};  // Wrong: a set records that a prefix occurred, not how many times.
        long long prefix = 0, count = 0;
        for (const int x : nums) {
            prefix += x;
            if (seen.count(prefix - target)) ++count;
            seen.insert(prefix);
        }
        return count;
    }
};
