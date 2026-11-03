class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        // Wrong: increments i even right after an erase, so the element that slid into slot i is skipped.
        for (size_t i = 1; i < nums.size(); ++i) {
            if (nums[i] == nums[i - 1]) nums.erase(nums.begin() + static_cast<long>(i));
        }
        return nums;
    }
};
