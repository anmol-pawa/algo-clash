class Solution {
public:
    long long countKindStretches(vector<int> beads, int k) {
        return atMost(beads, k) - atMost(beads, k - 1);
    }

private:
    static int atMost(const vector<int>& beads, int limit) {  // bug: the running total is an int and overflows
        if (limit <= 0) return 0;
        vector<int> count(100001, 0);
        int kinds = 0;
        int left = 0;
        int total = 0;
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
