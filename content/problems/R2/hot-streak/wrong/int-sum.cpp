class Solution {
public:
    long long bestStretch(vector<int> gains) {
        int endingHere = gains[0];  // Wrong: running totals reach 10^14 and overflow int.
        int best = gains[0];
        for (size_t i = 1; i < gains.size(); ++i) {
            endingHere = max(gains[i], endingHere + gains[i]);
            best = max(best, endingHere);
        }
        return best;
    }
};
