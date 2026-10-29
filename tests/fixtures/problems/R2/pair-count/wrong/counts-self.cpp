class Solution {
public:
    long long countPairs(vector<int>& nums, int target) {
        unordered_map<int, long long> seen;
        long long pairs = 0;
        for (const int x : nums) {
            ++seen[x];  // bug: inserted before the lookup, so x pairs with itself
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;
        }
        return pairs;
    }
};
