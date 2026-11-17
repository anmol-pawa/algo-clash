class Solution {
public:
    vector<int> rankCrates(vector<int>& weights) {
        // Repeatedly pick the best unused crate: O(n^2), only used as the checker.
        const int n = static_cast<int>(weights.size());
        vector<bool> used(n, false);
        vector<int> order;
        for (int step = 0; step < n; ++step) {
            int best = -1;
            for (int i = 0; i < n; ++i) {
                if (used[i]) continue;
                if (best == -1 || weights[i] > weights[best]) best = i;
            }
            used[best] = true;
            order.push_back(best);
        }
        return order;
    }
};
