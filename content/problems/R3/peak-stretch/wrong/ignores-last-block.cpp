class Solution {
public:
    long long peakStretch(vector<int> readings, int k) {
        const int n = static_cast<int>(readings.size());
        long long window = 0;
        for (int i = 0; i < k; ++i) window += readings[i];
        long long best = window;
        for (int i = k; i + 1 < n; ++i) {  // wrong: stops one block early
            window += readings[i] - readings[i - k];
            best = max(best, window);
        }
        return best;
    }
};
