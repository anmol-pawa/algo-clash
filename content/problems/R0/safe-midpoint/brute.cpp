class Solution {
public:
    int midSlot(int lo, int hi) {
        // Widen to 64 bits so the plain average is safe.
        return static_cast<int>((static_cast<long long>(lo) + hi) / 2);
    }
};
