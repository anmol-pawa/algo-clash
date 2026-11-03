class Solution {
public:
    vector<int> letterTally(string s) {
        // Wrong: treats the whole 'A'..'z' code range as letters, so '[', '_' and '`' land in other buckets.
        vector<int> tally(26, 0);
        for (const char c : s) {
            if (c >= 'A' && c <= 'z') ++tally[(c - (c >= 'a' ? 'a' : 'A')) % 26];
        }
        return tally;
    }
};
