class Solution {
public:
    int minFerries(vector<int> weights, int limit) {
        sort(weights.begin(), weights.end());
        int ferries = 0;
        const int n = static_cast<int>(weights.size());
        for (int i = 0; i < n; ++i) {
            ++ferries;
            // Wrong: only the next rider in sorted order is tried as a partner.
            if (i + 1 < n && weights[i] + weights[i + 1] <= limit) ++i;
        }
        return ferries;
    }
};
