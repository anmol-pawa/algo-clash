class Solution {
public:
    bool isScramble(string a, string b) {
        if (a.size() != b.size()) return false;
        int balance[26] = {};  // letters of a minus letters of b
        for (const char c : a) ++balance[c - 'a'];
        for (const char c : b) --balance[c - 'a'];
        for (const int v : balance)
            if (v != 0) return false;
        return true;
    }
};
