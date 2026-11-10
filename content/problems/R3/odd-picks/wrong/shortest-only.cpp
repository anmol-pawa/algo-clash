class Solution {
public:
    long long countExactOdds(vector<int> nums, int k) {
        long long total = 0;
        int odds = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
            odds += nums[right] & 1;
            while (odds > k) odds -= nums[left++] & 1;
            if (odds == k) ++total;  // bug: counts one stretch per right end, ignoring the even cards before left
        }
        return total;
    }
};
