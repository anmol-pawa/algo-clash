class Solution {
public:
    int longestCalm(string s, int k) {
        // Correct but quadratic: restart from every start index.
        int best = 0;
        const int n = static_cast<int>(s.size());
        for (int i = 0; i < n; ++i) {
            int count[26] = {};
            int distinct = 0;
            for (int j = i; j < n; ++j) {
                if (count[s[j] - 'a']++ == 0) ++distinct;
                if (distinct > k) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
