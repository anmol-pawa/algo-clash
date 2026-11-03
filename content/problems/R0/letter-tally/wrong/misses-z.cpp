class Solution {
public:
    vector<int> letterTally(string s) {
        // Wrong: off-by-one bound, 'z' is never counted.
        vector<int> tally(26, 0);
        for (const char raw : s) {
            const char c = static_cast<char>(tolower(static_cast<unsigned char>(raw)));
            if (c >= 'a' && c < 'z') ++tally[c - 'a'];
        }
        return tally;
    }
};
