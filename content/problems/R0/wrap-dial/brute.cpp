class Solution {
public:
    int wrapSlot(int pos, int m) {
        // Step the pointer one slot at a time (only used on small inputs).
        long long p = 0;
        const int step = pos < 0 ? -1 : 1;
        for (long long i = 0; i < (pos < 0 ? -(long long)pos : (long long)pos); ++i) {
            p += step;
            if (p == m) p = 0;
            if (p < 0) p = m - 1;
        }
        return static_cast<int>(p);
    }
};
