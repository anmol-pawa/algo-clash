class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        long long sum = 0, count = 0;
        size_t left = 0;
        for (size_t right = 0; right < nums.size(); ++right) {
            sum += nums[right];
            while (left <= right && sum > target) sum -= nums[left++];  // Wrong: shrinking is only valid when all values are non-negative.
            if (left <= right && sum == target) ++count;
        }
        return count;
    }
};
