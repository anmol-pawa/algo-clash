class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        long long total = 0;  // 10^5 coins of 2 * 10^9 do not fit in int
        for (const auto& coin : coins) {
            if (coin >= minValue) total += coin;
        }
        return total;
    }
};
