class Solution {
public:
    int shortestQuota(vector<int> change, long long quota) {
        const int n = static_cast<int>(change.size());
        int best = n + 1;
        long long sum = 0;
        int left = 0;
        for (int right = 0; right < n; ++right) {  // bug: the positive-values window; negatives break its monotonicity
            sum += change[right];
            while (left <= right && sum >= quota) {
                best = min(best, right - left + 1);
                sum -= change[left++];
            }
        }
        return best > n ? -1 : best;
    }
};
