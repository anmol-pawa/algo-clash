class Solution {
public:
    int shortestQuota(vector<int> change, long long quota) {
        const int n = static_cast<int>(change.size());
        int best = n + 1;
        for (int start = 0; start < n; ++start) {  // correct but O(n^2) when no run reaches the quota
            long long sum = 0;
            for (int end = start; end < n; ++end) {
                sum += change[end];
                if (sum >= quota) {
                    best = min(best, end - start + 1);
                    break;
                }
            }
        }
        return best > n ? -1 : best;
    }
};
