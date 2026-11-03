class Solution {
public:
    int wrapSlot(int pos, int m) {
        // Wrong: mirrors negative turns instead of turning backwards (-1 on a ring of 5 gives 1, not 4).
        return (pos < 0 ? -pos : pos) % m;
    }
};
