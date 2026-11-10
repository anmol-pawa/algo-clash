class Solution {
public:
    int tightPatch(vector<int> power, long long need) {
        const int n = static_cast<int>(power.size());
        int best = n + 1;  // n + 1 means "no patch found yet"
        long long sum = 0;  // total of power[left..right]
        int left = 0;
        for (int right = 0; right < n; ++right) {
            sum += power[right];
            while (sum >= need) {  // as short as possible: drop from the left while it still works
                best = min(best, right - left + 1);
                sum -= power[left];
                ++left;
            }
        }
        return best == n + 1 ? 0 : best;
    }
};
