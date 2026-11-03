class Solution {
public:
    int echoStrength(long long base, long long bounces) {
        // Bounce one at a time. Only usable for small bounce counts.
        const long long MOD = 1000000007LL;
        long long strength = 1;
        for (long long i = 0; i < bounces; ++i) strength = strength * (base % MOD) % MOD;
        return static_cast<int>(strength);
    }
};
