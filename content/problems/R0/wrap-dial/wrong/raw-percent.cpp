class Solution {
public:
    int wrapSlot(int pos, int m) {
        // Wrong: negative positions give negative slots.
        return pos % m;
    }
};
