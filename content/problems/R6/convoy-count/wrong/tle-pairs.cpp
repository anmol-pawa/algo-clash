class Solution {
public:
    int convoyCount(int target, vector<int>& position, vector<int>& speed) {
        const int n = static_cast<int>(position.size());
        int convoys = 0;
        for (int i = 0; i < n; ++i) {
            bool leads = true;
            for (int j = 0; j < n && leads; ++j) {
                if (position[j] <= position[i]) continue;
                // truck j ahead arrives no later than truck i: i is held up by it
                const long long tj = static_cast<long long>(target - position[j]) * speed[i];
                const long long ti = static_cast<long long>(target - position[i]) * speed[j];
                if (tj >= ti) leads = false;
            }
            if (leads) ++convoys;
        }
        return convoys;
    }
};
