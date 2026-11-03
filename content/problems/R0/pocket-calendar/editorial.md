## Signals
A calendar with irregular month lengths and an exception-laden rule. Fixed irregular data is best stored in a lookup table instead of an if-chain, and the leap rule is best isolated in a tiny helper.

## Brute force
Walk through the year day by day, counting, until the target month and day appear. It is easy to trust and independent of the table in the reference.

## Key insight
Precompute "days before this month" for a non-leap year, so the answer is `table[month - 1] + day` plus one for leap years after February. The leap condition is `(y % 4 == 0 && y % 100 != 0) || y % 400 == 0`; reading it as three nested exceptions is the safest way to remember it.

## Optimal
One table lookup, one helper call. Time O(1), space O(1).

## C++ walkthrough
`static const int daysBefore[12]` inside the function is a static local: it is initialised the first time the function runs and then lives for the rest of the program, so the table is not rebuilt on every call (a plain local array would be). `static bool isLeap` inside the class is a static member function: it belongs to the class, takes no hidden `this`, and can be called without an object, which fits a pure helper. A `static` free function or variable at file scope means something else again: internal linkage, visible only in that file. Array indexing is zero-based, hence `month - 1`.

## Common bugs
Only testing `year % 4`; dropping the 400 rule; adding the leap day for February dates; indexing the table with `month`; a typo in one cumulative total.

## Follow-ups
Return the date given a year and a day number. Count the days between two dates. Find the weekday of a date.

## Similar problems
Day of the Year (LeetCode 1154).
