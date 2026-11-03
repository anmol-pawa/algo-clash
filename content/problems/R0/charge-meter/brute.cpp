class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        // Build every charge value first, then search them, so the stop-early logic is not shared with the reference.
        vector<__int128> after(readings.size());
        __int128 charge = 0;
        for (size_t i = 0; i < readings.size(); ++i) {
            if (readings[i] > 0) charge += readings[i];
            after[i] = charge;
        }
        for (size_t i = 0; i < after.size(); ++i) {
            if (after[i] >= limit) return static_cast<int>(i);
        }
        return -1;
    }
};
