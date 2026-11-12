class Solution {
public:
    int valleyTally(vector<int>& depths) {
        constexpr long long MOD = 1'000'000'007;
        const int n = static_cast<int>(depths.size());
        // Wrong: both boundaries are "strictly smaller", so with equal depths several steps own the same stretch.
        vector<int> prev(n), next(n);
        vector<int> stack;
        for (int i = 0; i < n; ++i) {
            while (!stack.empty() && depths[stack.back()] >= depths[i]) stack.pop_back();
            prev[i] = stack.empty() ? -1 : stack.back();
            stack.push_back(i);
        }
        stack.clear();
        for (int i = n - 1; i >= 0; --i) {
            while (!stack.empty() && depths[stack.back()] >= depths[i]) stack.pop_back();
            next[i] = stack.empty() ? n : stack.back();
            stack.push_back(i);
        }
        long long total = 0;
        for (int i = 0; i < n; ++i) {
            total = (total + static_cast<long long>(i - prev[i]) * (next[i] - i) % MOD * depths[i]) % MOD;
        }
        return static_cast<int>(total);
    }
};
