class Solution {
public:
    long long countMatches(vector<int> nums, int target) {
        unordered_map<int, int> seen;  // value -> how many earlier coins carry it
        long long pairs = 0;
        for (const int x : nums) {
            const auto it = seen.find(target - x);
            if (it != seen.end()) pairs += it->second;  // look up before inserting: no self-pairing
            ++seen[x];
        }
        return pairs;
    }
};
