class Solution {
public:
    int midSlot(int lo, int hi) {
        // Wrong: lo + hi overflows int for large positions.
        return (lo + hi) / 2;
    }
};
