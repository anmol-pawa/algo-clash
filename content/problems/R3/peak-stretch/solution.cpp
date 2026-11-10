class Solution {
public:
    long long peakStretch(vector<int> readings, int k) {
        const int n = static_cast<int>(readings.size());
        long long window = 0;  // total of the k readings ending at index i
        for (int i = 0; i < k; ++i) window += readings[i];
        long long best = window;
        for (int i = k; i < n; ++i) {
            window += readings[i] - readings[i - k];  // slide: add the newcomer, drop the oldest
            best = max(best, window);
        }
        return best;
    }
};
