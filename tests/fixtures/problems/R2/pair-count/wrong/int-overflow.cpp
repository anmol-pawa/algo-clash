class Solution {
public:
    long long countPairs(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        int pairs = 0;  // bug: overflows when many equal values
        for (const int x : nums) {
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;
            ++seen[x];
        }
        return pairs;
    }
};
