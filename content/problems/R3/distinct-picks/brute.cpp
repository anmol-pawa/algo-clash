class Solution {
public:
    long long countKindStretches(vector<int> beads, int k) {
        const int n = static_cast<int>(beads.size());
        long long total = 0;
        for (int i = 0; i < n; ++i) {
            set<int> colours;
            for (int j = i; j < n; ++j) {
                colours.insert(beads[j]);
                if (static_cast<int>(colours.size()) == k) ++total;
            }
        }
        return total;
    }
};
