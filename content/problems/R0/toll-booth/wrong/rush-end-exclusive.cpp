class Solution {
public:
    int tollFee(int hour, int axles) {
        // Wrong: the morning rush stops at hour 8, but hour 9 is still rush.
        int rate = 4;
        if (hour <= 5) rate = 2;
        else if ((hour >= 7 && hour < 9) || (hour >= 16 && hour <= 18)) rate = 6;
        int fee = rate * axles;
        if (axles >= 5) fee += 10;
        return fee;
    }
};
