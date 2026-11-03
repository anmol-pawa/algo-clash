class Solution {
public:
    vector<int> letterTally(string s) {
        // Wrong: uppercase letters are ignored.
        vector<int> tally(26, 0);
        for (const char c : s) {
            if (c >= 'a' && c <= 'z') ++tally[c - 'a'];
        }
        return tally;
    }
};
