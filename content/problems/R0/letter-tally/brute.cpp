class Solution {
public:
    vector<int> letterTally(string s) {
        vector<int> tally(26, 0);
        for (int k = 0; k < 26; ++k) {
            const char lower = static_cast<char>('a' + k);
            const char upper = static_cast<char>('A' + k);
            for (const char c : s) {
                if (c == lower || c == upper) ++tally[k];
            }
        }
        return tally;
    }
};
