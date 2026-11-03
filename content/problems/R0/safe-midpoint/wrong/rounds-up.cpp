class Solution {
public:
    int midSlot(int lo, int hi) {
        // Wrong: no overflow, but an odd gap rounds toward hi instead of lo.
        return hi - (hi - lo) / 2;
    }
};
