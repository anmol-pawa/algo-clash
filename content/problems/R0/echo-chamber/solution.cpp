class Solution {
    static constexpr long long MOD = 1000000007LL;

    // Invariant: returns base^e mod MOD, using about log2(e) nested calls (at most 60 here).
    static long long power(long long base, long long e) {
        if (e == 0) return 1;  // base case: the empty product
        const long long half = power(base, e / 2);
        long long result = half * half % MOD;  // both factors are < MOD, so the product fits in 64 bits
        if (e % 2 == 1) result = result * base % MOD;
        return result;
    }

public:
    int echoStrength(long long base, long long bounces) {
        return static_cast<int>(power(base % MOD, bounces));
    }
};
