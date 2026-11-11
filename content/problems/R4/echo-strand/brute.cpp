class Solution {
public:
    vector<string> echoes(string strand, int k) {
        const int n = static_cast<int>(strand.size());
        set<string> found;
        for (int i = 0; i + k <= n; ++i) {
            const string block = strand.substr(i, k);
            for (int j = i + 1; j + k <= n; ++j) {
                if (strand.compare(j, k, block) == 0) { found.insert(block); break; }
            }
        }
        return vector<string>(found.begin(), found.end());
    }
};
