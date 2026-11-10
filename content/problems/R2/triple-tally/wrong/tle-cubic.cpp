class Solution {
public:
    int countTriples(vector<int> nums) {
        sort(nums.begin(), nums.end());
        const int n = static_cast<int>(nums.size());
        int count = 0;
        for (int i = 0; i < n; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            for (int j = i + 1; j < n; ++j) {
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;
                for (int k = j + 1; k < n; ++k) {  // Wrong: O(n^3) triple loop.
                    if (k > j + 1 && nums[k] == nums[k - 1]) continue;
                    if (nums[i] + nums[j] + nums[k] == 0) ++count;
                }
            }
        }
        return count;
    }
};
