class Solution {
public:
    int convoyCount(int target, vector<int>& position, vector<int>& speed) {
        const int n = static_cast<int>(position.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return position[a] > position[b]; });
        int convoys = 0;
        long long leadDist = 0, leadSpeed = 1;
        for (int idx : order) {
            const long long dist = target - position[idx];
            const long long spd = speed[idx];
            // Wrong: >= makes a tie at the depot a separate convoy.
            if (convoys == 0 || dist * leadSpeed >= leadDist * spd) {
                ++convoys;
                leadDist = dist;
                leadSpeed = spd;
            }
        }
        return convoys;
    }
};
