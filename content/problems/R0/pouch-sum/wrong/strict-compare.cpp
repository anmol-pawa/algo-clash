class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // Wrong: "at least" is >=; a coin worth exactly minValue must be accepted.
        long long total = 0;
        for (const auto& coin : coins) {
            if (coin > minValue) total += coin;
        }
        return total;
    }
};
