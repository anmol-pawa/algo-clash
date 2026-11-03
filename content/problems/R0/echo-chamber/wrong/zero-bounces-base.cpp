class Solution {
    static constexpr long long MOD = 1000000007LL;
    static long long power(long long base, long long e) {
        if (e == 0) return 1;
        const long long half = power(base, e / 2);
        long long result = half * half % MOD;
        if (e % 2 == 1) result = result * base % MOD;
        return result;
    }

public:
    int echoStrength(long long base, long long bounces) {
        // Wrong: a zero base is answered with 0 even when there are no bounces (the answer is 1).
        if (base == 0) return 0;
        return static_cast<int>(power(base % MOD, bounces));
    }
};
