class Solution {
public:
    bool sameLetters(string a, string b) {
        if (a.size() != b.size()) return false;
        int balance[26] = {};  // +1 per letter of a, -1 per letter of b
        for (size_t i = 0; i < a.size(); ++i) {
            ++balance[a[i] - 'a'];
            --balance[b[i] - 'a'];
        }
        for (const int v : balance)
            if (v != 0) return false;
        return true;
    }
};
