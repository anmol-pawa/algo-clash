class Solution {
public:
    int valleyTally(vector<int>& depths) {
        constexpr long long MOD = 1'000'000'007;
        const int n = static_cast<int>(depths.size());
        long long total = 0;
        vector<int> stack;
        for (int i = 0; i <= n; ++i) {
            const int now = i == n ? 0 : depths[i];
            while (!stack.empty() && depths[stack.back()] >= now) {
                const int mid = stack.back();
                stack.pop_back();
                const int prev = stack.empty() ? -1 : stack.back();
                const int stretches = (mid - prev) * (i - mid);  // Wrong: up to 2.5e9 overflows int
                total = (total + static_cast<long long>(stretches) % MOD * depths[mid]) % MOD;
            }
            stack.push_back(i);
        }
        return static_cast<int>(total);
    }
};
