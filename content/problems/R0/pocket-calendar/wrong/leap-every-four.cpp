class Solution {
public:
    int dayOfYear(int year, int month, int day) {
        // Wrong: ignores the century rule, so 1900 and 2100 count as leap years.
        static const int daysBefore[12] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};
        int n = daysBefore[month - 1] + day;
        if (month > 2 && year % 4 == 0) ++n;
        return n;
    }
};
