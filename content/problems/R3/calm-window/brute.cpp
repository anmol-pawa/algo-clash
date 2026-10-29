class Solution {
public:
    int longestCalm(string s, int k) {
        int best = 0;
        const int n = static_cast<int>(s.size());
        for (int i = 0; i < n; ++i) {
            for (int j = i; j < n; ++j) {
                set<char> letters(s.begin() + i, s.begin() + j + 1);
                if (static_cast<int>(letters.size()) <= k) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
