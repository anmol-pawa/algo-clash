class Solution {
public:
    long long peakStretch(vector<int> readings, int k) {
        const int n = static_cast<int>(readings.size());
        long long best = LLONG_MIN;
        for (int start = 0; start + k <= n; ++start) {
            long long total = 0;
            for (int i = start; i < start + k; ++i) total += readings[i];
            best = max(best, total);
        }
        return best;
    }
};
