class Solution {
public:
    long long countKindStretches(vector<int> beads, int k) {
        if (k <= 0) return 0;
        vector<int> count(100001, 0);
        int kinds = 0;
        int left = 0;
        long long total = 0;
        for (int right = 0; right < static_cast<int>(beads.size()); ++right) {
            if (count[beads[right]]++ == 0) ++kinds;
            while (kinds > k) {
                if (--count[beads[left]] == 0) --kinds;
                ++left;
            }
            total += right - left + 1;  // bug: counts stretches with at most k colours, not exactly k
        }
        return total;
    }
};
