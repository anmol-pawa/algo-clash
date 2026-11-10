class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        const int n = static_cast<int>(nums.size());
        long long count = 0;
        for (int i = 0; i < n; ++i) {
            long long sum = 0;
            for (int j = i; j < n; ++j) {
                sum += nums[j];
                if (sum == target) ++count;
            }
        }
        return count;
    }
};
