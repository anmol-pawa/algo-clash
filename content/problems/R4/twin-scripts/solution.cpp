class Solution {
public:
    bool areTwins(string a, string b) {
        if (a.size() != b.size()) return false;
        // Last position (+1) where each symbol was seen; 0 means "never".
        // Two symbols are paired exactly when they always first appear together.
        int lastA[128] = {};
        int lastB[128] = {};
        for (int i = 0; i < static_cast<int>(a.size()); ++i) {
            const unsigned char x = a[i];
            const unsigned char y = b[i];
            if (lastA[x] != lastB[y]) return false;
            lastA[x] = lastB[y] = i + 1;
        }
        return true;
    }
};
