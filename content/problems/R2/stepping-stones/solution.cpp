class Solution {
public:
    int longestPath(vector<int>& stones) {
        unordered_set<int> present(stones.begin(), stones.end());
        int best = 0;
        for (const int x : present) {
            if (present.count(x - 1)) continue;  // not the start of a run
            int len = 1;
            while (present.count(x + len)) ++len;  // x+len <= 10^9 + 1e5, fits in int
            best = max(best, len);
        }
        return best;
    }
};
