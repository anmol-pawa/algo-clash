class Solution {
public:
    int minFerries(vector<int> weights, int limit) {
        sort(weights.begin(), weights.end());
        const int n = static_cast<int>(weights.size());
        vector<bool> used(n, false);
        int ferries = 0;
        for (int i = n - 1; i >= 0; --i) {
            if (used[i]) continue;
            used[i] = true;
            ++ferries;
            // Wrong: scans downward for the heaviest partner that fits, O(n) per rider.
            for (int j = i - 1; j >= 0; --j) {
                if (!used[j] && weights[i] + weights[j] <= limit) { used[j] = true; break; }
            }
        }
        return ferries;
    }
};
