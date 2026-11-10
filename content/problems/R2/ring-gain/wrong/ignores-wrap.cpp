class Solution {
public:
    long long bestRingStretch(vector<int> gains) {
        long long endingHere = gains[0], best = gains[0];  // Wrong: plain Kadane never wraps around.
        for (size_t i = 1; i < gains.size(); ++i) {
            endingHere = max<long long>(gains[i], endingHere + gains[i]);
            best = max(best, endingHere);
        }
        return best;
    }
};
