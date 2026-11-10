class Solution {
public:
    int tightPatch(vector<int> power, long long need) {
        const int n = static_cast<int>(power.size());
        int best = n + 1;
        long long sum = 0;
        int left = 0;
        for (int right = 0; right < n; ++right) {
            sum += power[right];
            while (sum > need) {  // wrong: "at least" includes equality
                best = min(best, right - left + 1);
                sum -= power[left];
                ++left;
            }
        }
        return best == n + 1 ? 0 : best;
    }
};
