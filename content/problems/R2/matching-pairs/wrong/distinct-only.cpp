class Solution {
public:
    long long countMatches(vector<int> nums, int target) {
        unordered_set<int> seen;
        long long pairs = 0;
        for (const int x : nums) {
            if (seen.count(target - x)) ++pairs;  // Wrong: counts one match per coin, not one per earlier partner.
            seen.insert(x);
        }
        return pairs;
    }
};
