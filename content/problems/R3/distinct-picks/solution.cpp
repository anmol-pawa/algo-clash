class Solution {
public:
    long long countKindStretches(vector<int> beads, int k) {
        return atMost(beads, k) - atMost(beads, k - 1);
    }

private:
    // Stretches with at most `limit` different colours. Shrinking such a stretch keeps it valid,
    // so one window is enough: every start from `left` to `right` works for this right end.
    static long long atMost(const vector<int>& beads, int limit) {
        if (limit <= 0) return 0;
        vector<int> count(100001, 0);  // count[c]: copies of colour c inside the window
        int kinds = 0;
        int left = 0;
        long long total = 0;
        for (int right = 0; right < static_cast<int>(beads.size()); ++right) {
            if (count[beads[right]]++ == 0) ++kinds;
            while (kinds > limit) {
                if (--count[beads[left]] == 0) --kinds;
                ++left;
            }
            total += right - left + 1;
        }
        return total;
    }
};
