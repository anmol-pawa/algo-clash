class Solution {
public:
    bool areTwins(string a, string b) {
        if (a.size() != b.size()) return false;
        const int n = static_cast<int>(a.size());
        // Every pair of positions must agree on "same symbol or not" in both strings.
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                if ((a[i] == a[j]) != (b[i] == b[j])) return false;
        return true;
    }
};
