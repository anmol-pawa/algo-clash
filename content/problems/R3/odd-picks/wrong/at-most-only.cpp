class Solution {
public:
    long long countExactOdds(vector<int> nums, int k) {
        long long total = 0;
        int odds = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
            odds += nums[right] & 1;
            while (odds > k) odds -= nums[left++] & 1;
            total += right - left + 1;  // bug: this counts "at most k", not "exactly k"
        }
        return total;
    }
};
