class Solution {
public:
    int valleyTally(vector<int>& depths) {
        constexpr long long MOD = 1'000'000'007;
        const int n = static_cast<int>(depths.size());
        long long total = 0;
        vector<int> stack;  // indices; depths strictly increase from bottom to top
        for (int i = 0; i <= n; ++i) {
            const int now = i == n ? 0 : depths[i];  // sentinel 0 flushes the stack
            while (!stack.empty() && depths[stack.back()] >= now) {
                const int mid = stack.back();
                stack.pop_back();
                const int prev = stack.empty() ? -1 : stack.back();  // previous strictly smaller
                // mid owns the stretches that start in (prev, mid] and end in [mid, i): i is the next smaller-or-equal.
                const long long stretches = static_cast<long long>(mid - prev) * (i - mid) % MOD;
                total = (total + stretches * depths[mid]) % MOD;
            }
            stack.push_back(i);
        }
        return static_cast<int>(total);
    }
};
