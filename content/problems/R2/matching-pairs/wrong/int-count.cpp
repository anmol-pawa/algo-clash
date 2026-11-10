class Solution {
public:
    long long countMatches(vector<int> nums, int target) {
        unordered_map<int, int> seen;
        int pairs = 0;  // Wrong: the count can pass 2^31 when many coins share a value.
        for (const int x : nums) {
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;
            ++seen[x];
        }
        return pairs;
    }
};
