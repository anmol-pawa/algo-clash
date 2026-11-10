class Solution {
public:
    long long bestStretch(vector<int> gains) {
        long long endingHere = 0, best = 0;  // Wrong: starting best at 0 allows an empty stretch.
        for (const int g : gains) {
            endingHere = max<long long>(0, endingHere + g);
            best = max(best, endingHere);
        }
        return best;
    }
};
