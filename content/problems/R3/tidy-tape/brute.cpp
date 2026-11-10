class Solution {
public:
    int longestTidy(string tape, int m) {
        const int n = static_cast<int>(tape.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = i; j < n; ++j) {
                int count[26] = {};
                bool ok = true;
                for (int x = i; x <= j; ++x) {
                    if (++count[tape[x] - 'a'] > m) ok = false;
                }
                if (ok) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
