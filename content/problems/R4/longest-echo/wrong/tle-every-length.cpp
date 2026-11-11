class Solution {
public:
    string longestEcho(string strand) {
        // Wrong: tries every length from the top and re-hashes whole blocks as strings (no monotone search, no rolling key).
        const int n = static_cast<int>(strand.size());
        for (int len = n - 1; len >= 1; --len) {
            unordered_set<string> seen;
            for (int j = 0; j + len <= n; ++j) {
                if (!seen.insert(strand.substr(j, len)).second) return strand.substr(j, len);
            }
        }
        return "";
    }
};
