class Solution {
public:
    long long countMatches(vector<int> nums, int target) {
        unordered_map<int, int> seen;
        long long pairs = 0;
        for (const int x : nums) {
            ++seen[x];  // Wrong: the coin is inserted before the lookup, so it can pair with itself.
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;
        }
        return pairs;
    }
};
