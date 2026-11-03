class Solution {
public:
    int tollFee(int hour, int axles) {
        // Wrong: "5 or more" written as "more than 5", so exactly 5 axles skip the fee.
        int rate = 4;
        if (hour <= 5) rate = 2;
        else if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) rate = 6;
        int fee = rate * axles;
        if (axles > 5) fee += 10;
        return fee;
    }
};
