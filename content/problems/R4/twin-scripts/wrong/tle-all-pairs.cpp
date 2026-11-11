class Solution {
public:
    bool areTwins(string a, string b) {
        // Correct but quadratic: compare every pair of positions.
        const int n = static_cast<int>(a.size());
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                if ((a[i] == a[j]) != (b[i] == b[j])) return false;
        return true;
    }
};
