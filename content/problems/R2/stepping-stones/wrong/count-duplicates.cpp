class Solution {
public:
    int longestPath(vector<int>& stones) {
        // Wrong: sorts but counts a repeated position as a step forward.
        vector<int> v = stones;
        sort(v.begin(), v.end());
        int best = 0, run = 0;
        for (size_t i = 0; i < v.size(); ++i) {
            run = (i > 0 && v[i] - v[i - 1] <= 1) ? run + 1 : 1;
            best = max(best, run);
        }
        return best;
    }
};
