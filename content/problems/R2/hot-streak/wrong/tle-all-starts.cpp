class Solution {
public:
    long long bestStretch(vector<int> gains) {
        const int n = static_cast<int>(gains.size());
        long long best = gains[0];
        for (int i = 0; i < n; ++i) {  // Wrong: O(n^2) pairs of endpoints.
            long long sum = 0;
            for (int j = i; j < n; ++j) {
                sum += gains[j];
                best = max(best, sum);
            }
        }
        return best;
    }
};
