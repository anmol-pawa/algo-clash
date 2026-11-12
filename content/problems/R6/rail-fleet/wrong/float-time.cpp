class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        const int n = static_cast<int>(start.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return start[a] > start[b]; });
        int convoys = 0;
        float slowest = 0;
        for (const int i : order) {
            // Wrong: a 24-bit float cannot tell apart arrival times that differ by a tiny amount.
            const float t = static_cast<float>(depot - start[i]) / static_cast<float>(speed[i]);
            if (t > slowest) {
                ++convoys;
                slowest = t;
            }
        }
        return convoys;
    }
};
