class Solution {
public:
    int tollFee(int hour, int axles) {
        // Spell out the price of every hour in a table, so there are no ranges to get wrong.
        const int rate[24] = {2, 2, 2, 2, 2, 2, 4, 6, 6, 6, 4, 4, 4, 4, 4, 4, 6, 6, 6, 4, 4, 4, 4, 4};
        int fee = 0;
        for (int i = 0; i < axles; ++i) fee += rate[hour];
        if (axles > 4) fee += 10;
        return fee;
    }
};
