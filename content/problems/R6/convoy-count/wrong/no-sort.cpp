class Solution {
public:
    int convoyCount(int target, vector<int>& position, vector<int>& speed) {
        const int n = static_cast<int>(position.size());
        int convoys = 0;
        long long leadDist = 0, leadSpeed = 1;
        // Wrong: trusts the input order instead of sorting by position.
        for (int i = 0; i < n; ++i) {
            const long long dist = target - position[i];
            const long long spd = speed[i];
            if (convoys == 0 || dist * leadSpeed > leadDist * spd) {
                ++convoys;
                leadDist = dist;
                leadSpeed = spd;
            }
        }
        return convoys;
    }
};
