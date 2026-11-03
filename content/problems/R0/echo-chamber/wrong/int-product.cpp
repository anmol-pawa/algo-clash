class Solution {
    static constexpr long long MOD = 1000000007LL;
    // Wrong: the halves are multiplied as 32-bit ints, so the product overflows before % MOD.
    static int power(int base, long long e) {
        if (e == 0) return 1;
        const int half = power(base, e / 2);
        int result = half * half % MOD;
        if (e % 2 == 1) result = result * base % MOD;
        return result;
    }

public:
    int echoStrength(long long base, long long bounces) {
        return power(static_cast<int>(base % MOD), bounces);
    }
};
