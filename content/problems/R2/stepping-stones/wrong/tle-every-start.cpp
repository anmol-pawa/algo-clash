class Solution {
public:
    int longestPath(vector<int>& stones) {
        // Correct but quadratic: extends from every stone, not only from run starts.
        unordered_set<int> present(stones.begin(), stones.end());
        int best = 0;
        for (const int x : present) {
            int len = 1;
            while (present.count(x + len)) ++len;
            best = max(best, len);
        }
        return best;
    }
};
