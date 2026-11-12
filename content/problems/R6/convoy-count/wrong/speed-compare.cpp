class Solution {
public:
    int convoyCount(int target, vector<int>& position, vector<int>& speed) {
        (void)target;
        const int n = static_cast<int>(position.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return position[a] > position[b]; });
        int convoys = 0;
        int leadSpeed = 0;
        for (int idx : order) {
            // Wrong: a faster truck behind can still be far enough back to arrive later; speed alone is not enough.
            if (convoys == 0 || speed[idx] >= leadSpeed) {
                ++convoys;
                leadSpeed = speed[idx];
            }
        }
        return convoys;
    }
};
