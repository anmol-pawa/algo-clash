class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // Index loop with a 128-bit sum, then narrow: cannot overflow, so it proves the 64-bit answer exact.
        __int128 total = 0;
        for (size_t i = 0; i < coins.size(); ++i) {
            if (coins[i] >= minValue) total += coins[i];
        }
        return static_cast<long long>(total);
    }
};
