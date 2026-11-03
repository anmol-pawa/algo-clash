## Nudge
If you knew how many days came before the first day of each month, what would the day number be? What changes in a leap year?
## Approach
Keep a table of the days that pass before each month starts in a normal year. Add the day of the month. In a leap year, add one more day if the date is after February.
## Key insight
The leap rule has three layers: divisible by 4, but not by 100, unless by 400. The extra day only exists from March onward, so February dates are unchanged. A `static const` array is built once and shared by all calls.
