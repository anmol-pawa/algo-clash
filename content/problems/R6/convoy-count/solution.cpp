class Solution {
public:
    int convoyCount(int target, vector<int>& position, vector<int>& speed) {
        const int n = static_cast<int>(position.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        // Front of the road first: the truck ahead can only slow the one behind.
        sort(order.begin(), order.end(), [&](int a, int b) { return position[a] > position[b]; });

        int convoys = 0;
        long long leadDist = 0, leadSpeed = 1;  // lone arrival time of the convoy in front = leadDist / leadSpeed
        for (int idx : order) {
            const long long dist = target - position[idx];
            const long long spd = speed[idx];
            // dist / spd > leadDist / leadSpeed, cross-multiplied (both denominators positive, product <= 1e18).
            if (convoys == 0 || dist * leadSpeed > leadDist * spd) {
                ++convoys;
                leadDist = dist;
                leadSpeed = spd;
            }
        }
        return convoys;
    }
};
