class Solution {
    static constexpr long long MOD = 1000000007LL;
    // Wrong (too deep): one recursive call per bounce. With 10^18 bounces the call stack overflows long before the answer.
    static long long power(long long base, long long e) {
        if (e == 0) return 1;
        return base * power(base, e - 1) % MOD;
    }

public:
    int echoStrength(long long base, long long bounces) {
        return static_cast<int>(power(base % MOD, bounces));
    }
};
