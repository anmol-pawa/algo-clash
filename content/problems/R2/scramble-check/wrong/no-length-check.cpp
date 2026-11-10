class Solution {
public:
    bool isScramble(string a, string b) {
        int balance[26] = {};
        for (const char c : a) ++balance[c - 'a'];
        for (const char c : b) --balance[c - 'a'];
        for (const int v : balance)
            if (v < 0) return false;  // Wrong: only catches extra letters in b, so a longer a slips through.
        return true;
    }
};
