class Solution {
public:
    int digitSum(long long n) {
        // Wrong: the value is squeezed into 32 bits first, which drops the high digits of big ledgers.
        int m = static_cast<int>(n);
        if (m < 0) m = -m;
        int total = 0;
        while (m != 0) {
            total += m % 10;
            m /= 10;
        }
        return total;
    }
};
