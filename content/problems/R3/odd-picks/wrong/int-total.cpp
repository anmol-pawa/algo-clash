class Solution {
public:
    long long countExactOdds(vector<int> nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }

private:
    static int atMost(const vector<int>& nums, int limit) {  // bug: the running total is an int and overflows
        if (limit < 0) return 0;
        int total = 0;
        int odds = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
            odds += nums[right] & 1;
            while (odds > limit) odds -= nums[left++] & 1;
            total += right - left + 1;
        }
        return total;
    }
};
