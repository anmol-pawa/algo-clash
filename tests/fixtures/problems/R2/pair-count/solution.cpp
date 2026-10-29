class Solution {
public:
    long long countPairs(vector<int>& nums, int target) {
        unordered_map<int, long long> seen;  // value -> how many earlier elements have it
        long long pairs = 0;                 // can exceed 32 bits: n*(n-1)/2
        for (const int x : nums) {
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;
            ++seen[x];
        }
        return pairs;
    }
};
