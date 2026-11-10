class Solution {
public:
    bool sameLetters(string a, string b) {
        // Wrong: never checks the lengths, and only requires b to fit inside a.
        int count[26] = {};
        for (const char c : a) ++count[c - 'a'];
        for (const char c : b)
            if (--count[c - 'a'] < 0) return false;
        return true;
    }
};
