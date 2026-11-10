class Solution {
public:
    int longestChain(vector<int> badges) {
        sort(badges.begin(), badges.end());
        int best = 0, run = 0;
        for (int i = 0; i < static_cast<int>(badges.size()); ++i) {
            // Wrong: an equal neighbour resets the run instead of being skipped.
            run = (i > 0 && badges[i] == badges[i - 1] + 1) ? run + 1 : 1;
            best = max(best, run);
        }
        return best;
    }
};
