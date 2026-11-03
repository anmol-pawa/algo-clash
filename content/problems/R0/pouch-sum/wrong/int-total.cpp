class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // Wrong: the accumulator is an int, so large totals overflow before the widening return.
        int total = 0;
        for (const auto& coin : coins) {
            if (coin >= minValue) total += coin;
        }
        return total;
    }
};
