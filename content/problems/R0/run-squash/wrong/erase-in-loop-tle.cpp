class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        // Correct but slow: every erase shifts the whole tail left, O(n) each, O(n^2) overall.
        for (size_t i = 1; i < nums.size();) {
            if (nums[i] == nums[i - 1]) nums.erase(nums.begin() + static_cast<long>(i));
            else ++i;
        }
        return nums;
    }
};
