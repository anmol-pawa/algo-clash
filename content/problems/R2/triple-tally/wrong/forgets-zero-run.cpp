class Solution {
public:
    int countTriples(vector<int> nums) {
        sort(nums.begin(), nums.end());
        const int n = static_cast<int>(nums.size());
        int count = 0;
        for (int i = 0; i + 2 < n; ++i) {
            if (nums[i] >= 0) break;  // Wrong: the triple 0, 0, 0 needs a smallest value of 0.
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                const int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) ++lo;
                else if (sum > 0) --hi;
                else {
                    ++count;
                    const int a = nums[lo], b = nums[hi];
                    while (lo < hi && nums[lo] == a) ++lo;
                    while (lo < hi && nums[hi] == b) --hi;
                }
            }
        }
        return count;
    }
};
