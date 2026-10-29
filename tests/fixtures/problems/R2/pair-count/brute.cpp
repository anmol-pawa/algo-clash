class Solution {
public:
    long long countPairs(vector<int>& nums, int target) {
        long long pairs = 0;
        for (size_t i = 0; i < nums.size(); ++i)
            for (size_t j = i + 1; j < nums.size(); ++j)
                if (nums[i] + nums[j] == target) ++pairs;
        return pairs;
    }
};
