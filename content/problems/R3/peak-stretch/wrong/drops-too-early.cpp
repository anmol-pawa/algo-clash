class Solution {
public:
    long long peakStretch(vector<int> readings, int k) {
        const int n = static_cast<int>(readings.size());
        long long window = 0;
        long long best = LLONG_MIN;
        for (int i = 0; i < n; ++i) {
            window += readings[i];
            if (i >= k - 1) {
                best = max(best, window);
                window -= readings[i - k + 2 > i ? i : i - k + 2];  // wrong: drops the second-oldest, not the oldest
            }
        }
        return best;
    }
};
