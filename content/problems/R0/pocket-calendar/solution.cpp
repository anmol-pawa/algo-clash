class Solution {
    // static member function: no object state needed, so it does not get a `this`.
    static bool isLeap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

public:
    int dayOfYear(int year, int month, int day) {
        // static local: built once, not on every call. Days in the year before each month starts (non-leap).
        static const int daysBefore[12] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};
        int n = daysBefore[month - 1] + day;
        if (month > 2 && isLeap(year)) ++n;  // the extra day exists only after February 29
        return n;
    }
};
