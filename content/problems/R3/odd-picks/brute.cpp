class Solution {
public:
    long long countExactOdds(vector<int> nums, int k) {
        const int n = static_cast<int>(nums.size());
        long long total = 0;
        for (int i = 0; i < n; ++i) {
            int odds = 0;
            for (int j = i; j < n; ++j) {
                odds += nums[j] & 1;
                if (odds == k) ++total;
            }
        }
        return total;
    }
};
