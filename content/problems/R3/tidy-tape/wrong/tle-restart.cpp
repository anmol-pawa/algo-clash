class Solution {
public:
    int longestTidy(string tape, int m) {
        // Correct but quadratic: restart a fresh count from every start index.
        const int n = static_cast<int>(tape.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            int count[26] = {};
            for (int j = i; j < n; ++j) {
                if (++count[tape[j] - 'a'] > m) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
