class Solution {
public:
    string longestEcho(string strand) {
        const int n = static_cast<int>(strand.size());
        for (int len = n - 1; len >= 1; --len) {
            for (int j = 1; j + len <= n; ++j) {
                for (int i = 0; i < j; ++i) {
                    if (strand.compare(i, len, strand, j, len) == 0) return strand.substr(j, len);
                }
            }
        }
        return "";
    }
};
