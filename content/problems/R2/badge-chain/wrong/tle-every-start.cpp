class Solution {
public:
    int longestChain(vector<int> badges) {
        const unordered_set<int> present(badges.begin(), badges.end());
        int best = 0;
        for (const int start : present) {  // Wrong: walks from every number, so a long chain is re-walked n times (O(n^2)).
            int length = 1;
            while (present.count(start + length)) ++length;
            best = max(best, length);
        }
        return best;
    }
};
