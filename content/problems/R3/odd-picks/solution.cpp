class Solution {
public:
    long long countExactOdds(vector<int> nums, int k) {
        // "exactly k" is the difference of two monotone questions.
        return atMost(nums, k) - atMost(nums, k - 1);
    }

private:
    // Number of stretches with at most `limit` odd numbers.
    static long long atMost(const vector<int>& nums, int limit) {
        if (limit < 0) return 0;
        long long total = 0;
        int odds = 0;  // odd numbers inside the window [left, right]
        int left = 0;
        for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
            odds += nums[right] & 1;
            while (odds > limit) odds -= nums[left++] & 1;
            total += right - left + 1;  // every start in [left, right] gives a valid stretch ending here
        }
        return total;
    }
};
