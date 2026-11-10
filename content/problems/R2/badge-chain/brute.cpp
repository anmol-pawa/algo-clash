class Solution {
public:
    int longestChain(vector<int> badges) {
        sort(badges.begin(), badges.end());
        badges.erase(unique(badges.begin(), badges.end()), badges.end());
        int best = 0, run = 0;
        for (int i = 0; i < static_cast<int>(badges.size()); ++i) {
            run = (i > 0 && badges[i] == badges[i - 1] + 1) ? run + 1 : 1;
            best = max(best, run);
        }
        return best;
    }
};
