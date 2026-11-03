class Solution {
public:
    int dayOfYear(int year, int month, int day) {
        // Walk the calendar one day at a time from January 1.
        int len[12] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        const bool leap = (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
        if (leap) len[1] = 29;
        int count = 0;
        for (int m = 1; m <= 12; ++m) {
            for (int d = 1; d <= len[m - 1]; ++d) {
                ++count;
                if (m == month && d == day) return count;
            }
        }
        return -1;
    }
};
