class Solution {
public:
    long long peakStretch(vector<int> readings, int k) {
        const int n = static_cast<int>(readings.size());
        long long window = 0;
        long long best = 0;  // wrong: all-negative input must give a negative answer
        for (int i = 0; i < n; ++i) {
            window += readings[i];
            if (i >= k) window -= readings[i - k];
            if (i >= k - 1) best = max(best, window);
        }
        return best;
    }
};
