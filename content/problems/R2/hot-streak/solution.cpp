class Solution {
public:
    long long bestStretch(vector<int> gains) {
        // endingHere = best total of a stretch that must finish at the current day.
        long long endingHere = gains[0];
        long long best = gains[0];
        for (size_t i = 1; i < gains.size(); ++i) {
            // Extend the previous stretch only if it helps; otherwise restart at today.
            endingHere = max<long long>(gains[i], endingHere + gains[i]);
            best = max(best, endingHere);
        }
        return best;
    }
};
