class Solution {
public:
    int dayOfYear(int year, int month, int day) {
        // Wrong: adds the leap day from February on, but February 1-28 come before it.
        static const int daysBefore[12] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};
        int n = daysBefore[month - 1] + day;
        if (month >= 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) ++n;
        return n;
    }
};
