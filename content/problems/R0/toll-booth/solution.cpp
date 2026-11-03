class Solution {
public:
    int tollFee(int hour, int axles) {
        int rate = 4;  // day price unless a range below matches
        if (hour <= 5) {
            rate = 2;
        } else if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
            rate = 6;
        }
        int fee = rate * axles;
        if (axles >= 5) fee += 10;  // flat fee, added once
        return fee;
    }
};
