class Solution {
    static constexpr long long MOD = 1000000007LL;
    // Wrong: squares the half but never multiplies the extra base when e is odd.
    static long long power(long long base, long long e) {
        if (e == 0) return 1;
        const long long half = power(base, e / 2);
        return half * half % MOD;
    }

public:
    int echoStrength(long long base, long long bounces) {
        return static_cast<int>(power(base % MOD, bounces));
    }
};
