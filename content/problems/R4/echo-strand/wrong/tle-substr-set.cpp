class Solution {
public:
    vector<string> echoes(string strand, int k) {
        // Correct but quadratic in practice: compares every block against every later block.
        const int n = static_cast<int>(strand.size());
        set<string> found;
        for (int i = 0; i + k <= n; ++i) {
            for (int j = i + 1; j + k <= n; ++j) {
                if (strand.compare(i, k, strand, j, k) == 0) { found.insert(strand.substr(i, k)); break; }
            }
        }
        return vector<string>(found.begin(), found.end());
    }
};
