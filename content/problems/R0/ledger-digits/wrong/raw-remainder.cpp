class Solution {
public:
    int digitSum(long long n) {
        // Wrong: for negative n the remainders are negative, so the sum comes out negative.
        int total = 0;
        while (n != 0) {
            total += static_cast<int>(n % 10);
            n /= 10;
        }
        return total;
    }
};
