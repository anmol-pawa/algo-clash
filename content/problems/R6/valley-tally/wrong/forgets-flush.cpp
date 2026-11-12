class Solution {
public:
    int valleyTally(vector<int>& depths) {
        constexpr long long MOD = 1'000'000'007;
        const int n = static_cast<int>(depths.size());
        long long total = 0;
        vector<int> stack;
        for (int i = 0; i < n; ++i) {  // Wrong: never flushes, so stretches owned by the survivors are lost
            while (!stack.empty() && depths[stack.back()] >= depths[i]) {
                const int mid = stack.back();
                stack.pop_back();
                const int prev = stack.empty() ? -1 : stack.back();
                total = (total + static_cast<long long>(mid - prev) * (i - mid) % MOD * depths[mid]) % MOD;
            }
            stack.push_back(i);
        }
        return static_cast<int>(total);
    }
};
