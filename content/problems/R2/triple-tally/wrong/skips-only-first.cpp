class Solution {
public:
    int countTriples(vector<int> nums) {
        sort(nums.begin(), nums.end());
        const int n = static_cast<int>(nums.size());
        int count = 0;
        for (int i = 0; i + 2 < n; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                const int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) ++lo;
                else if (sum > 0) --hi;
                else { ++count; ++lo; --hi; }  // Wrong: the middle and last values are not de-duplicated.
            }
        }
        return count;
    }
};
