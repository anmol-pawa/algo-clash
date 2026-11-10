class Solution {
public:
    long long countMatches(vector<int> nums, int target) {
        long long pairs = 0;
        const int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                if (nums[i] + nums[j] == target) ++pairs;
        return pairs;
    }
};
