class Solution {
public:
    int digitSum(long long n) {
        int total = 0;
        while (n != 0) {
            const int digit = static_cast<int>(n % 10);  // negative n gives a negative remainder
            total += digit < 0 ? -digit : digit;
            n /= 10;  // truncates toward zero, so the loop ends at 0 for either sign
        }
        return total;
    }
};
