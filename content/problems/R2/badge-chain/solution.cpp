class Solution {
public:
    int longestChain(vector<int> badges) {
        const unordered_set<int> present(badges.begin(), badges.end());  // duplicates collapse
        int best = 0;
        for (const int start : present) {
            if (present.count(start - 1)) continue;  // not the beginning of a chain
            int length = 1;
            while (present.count(start + length)) ++length;
            best = max(best, length);
        }
        return best;
    }
};
