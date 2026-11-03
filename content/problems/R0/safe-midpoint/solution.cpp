class Solution {
public:
    int midSlot(int lo, int hi) {
        // lo + hi can reach 2 * (2^31 - 1) and overflow int; hi - lo cannot.
        return lo + (hi - lo) / 2;
    }
};
