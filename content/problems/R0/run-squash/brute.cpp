class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        vector<int> kept;
        for (size_t i = 0; i < nums.size(); ++i) {
            if (i == 0 || nums[i] != nums[i - 1]) kept.push_back(nums[i]);
        }
        return kept;
    }
};
