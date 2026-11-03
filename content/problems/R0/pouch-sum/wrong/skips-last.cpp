class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // Wrong: off-by-one, the last coin is never considered.
        long long total = 0;
        for (size_t i = 0; i + 1 < coins.size(); ++i) {
            if (coins[i] >= minValue) total += coins[i];
        }
        return total;
    }
};
