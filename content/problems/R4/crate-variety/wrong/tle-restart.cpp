class Solution {
public:
    int longestVariety(vector<int> kinds, int k) {
        // Correct but quadratic: restart a fresh window from every left end.
        const int n = static_cast<int>(kinds.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            unordered_map<int, int> seen;
            for (int j = i; j < n; ++j) {
                ++seen[kinds[j]];
                if (static_cast<int>(seen.size()) > k) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
