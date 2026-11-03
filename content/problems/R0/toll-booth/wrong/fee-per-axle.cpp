class Solution {
public:
    int tollFee(int hour, int axles) {
        // Wrong: the heavy-load fee is flat, but here it is charged on every axle.
        int rate = 4;
        if (hour <= 5) rate = 2;
        else if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) rate = 6;
        if (axles >= 5) rate += 2;
        return rate * axles;
    }
};
