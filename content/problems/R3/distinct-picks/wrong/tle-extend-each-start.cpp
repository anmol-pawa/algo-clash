class Solution {
public:
    long long countKindStretches(vector<int> beads, int k) {
        const int n = static_cast<int>(beads.size());
        vector<char> seen(100001, 0);
        long long total = 0;
        for (int i = 0; i < n; ++i) {  // correct but O(n^2): extends from every start
            int kinds = 0;
            for (int j = i; j < n; ++j) {
                if (!seen[beads[j]]) { seen[beads[j]] = 1; ++kinds; }
                if (kinds > k) break;
                if (kinds == k) ++total;
            }
            for (int j = i; j < n && seen[beads[j]]; ++j) seen[beads[j]] = 0;
        }
        return total;
    }
};
