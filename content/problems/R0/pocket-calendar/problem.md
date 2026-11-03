# Pocket Calendar

Given a valid date in the Gregorian calendar, return which day of its year it is, where January 1 is day `1`.

A year is a **leap year** (February has 29 days) when it is divisible by 4, except years divisible by 100 are not leap years, unless they are also divisible by 400.

## Examples

- `year = 2023, month = 1, day = 31` gives `31`.
- `year = 2024, month = 3, day = 1` gives `61` (2024 is a leap year).
- `year = 1900, month = 12, day = 31` gives `365` (1900 is not a leap year).

## Constraints

- `1 <= year <= 9999`
- `1 <= month <= 12`
- The date is valid: `day` is between 1 and the length of that month.
