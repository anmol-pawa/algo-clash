class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // Wrong: adds every coin, then removes the refused ones, but refuses with <= instead of <.
        long long total = 0;
        for (const auto& coin : coins) total += coin;
        for (const auto& coin : coins) {
            if (coin <= minValue) total -= coin;
        }
        return total;
    }
};
