class Solution {
    // Exhaustive: the first unplaced rider either rides alone or shares with any one partner that fits.
    int solve(const vector<int>& w, int limit, vector<bool>& used) {
        const int n = static_cast<int>(w.size());
        int first = 0;
        while (first < n && used[first]) ++first;
        if (first == n) return 0;
        used[first] = true;
        int best = 1 + solve(w, limit, used);
        for (int j = first + 1; j < n; ++j) {
            if (used[j] || w[first] + w[j] > limit) continue;
            used[j] = true;
            best = min(best, 1 + solve(w, limit, used));
            used[j] = false;
        }
        used[first] = false;
        return best;
    }
public:
    int minFerries(vector<int> weights, int limit) {
        vector<bool> used(weights.size(), false);
        return solve(weights, limit, used);
    }
};
