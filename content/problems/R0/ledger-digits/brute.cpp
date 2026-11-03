class Solution {
public:
    int digitSum(long long n) {
        // Go through the decimal text and add every digit character.
        int total = 0;
        for (const char c : to_string(n)) {
            if (c >= '0' && c <= '9') total += c - '0';
        }
        return total;
    }
};
