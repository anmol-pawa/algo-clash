class Solution {
public:
    long long bestRingStretch(vector<int> gains) {
        const int n = static_cast<int>(gains.size());
        long long best = gains[0];
        for (int start = 0; start < n; ++start) {
            long long sum = 0;
            for (int len = 1; len <= n; ++len) {
                sum += gains[(start + len - 1) % n];
                best = max(best, sum);
            }
        }
        return best;
    }
};
