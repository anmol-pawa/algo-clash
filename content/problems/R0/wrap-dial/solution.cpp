class Solution {
public:
    int wrapSlot(int pos, int m) {
        const int r = pos % m;        // in (-m, m): C++ keeps the sign of pos
        return r < 0 ? r + m : r;     // shift negatives into [0, m)
    }
};
