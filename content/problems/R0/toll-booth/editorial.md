## Signals
A price or label that depends on which range a number falls in, with the bounds spelled out in the statement. These problems are won or lost on the boundary values, so list them before coding.

## Brute force
Write the price of all 24 hours in a table and add it once per axle. It is slow in spirit but trivially correct, which makes it a good check for the range logic.

## Key insight
There are only three prices, so the whole job is mapping an hour to a price. Because the checks run top to bottom and stop at the first match, `hour <= 5` needs no lower bound and the default `rate = 4` covers hour 6 and everything after 18 without listing it.

## Optimal
One chain of comparisons, one multiplication and one conditional addition. Time O(1), space O(1).

## C++ walkthrough
`if / else if` evaluates conditions in order and runs only the first branch that is true. `&&` binds tighter than `||`, so `(hour >= 7 && hour <= 9) || (...)` is already grouped, but the parentheses keep it readable. `rate` starts at the day price so no branch can leave it uninitialised. `switch` would also work here, but each case label is a single value, so ranges would need a block of stacked `case` labels.

## Common bugs
Using `<` where the statement says inclusive (hour 9 is rush); treating "5 or more" as `> 5`; charging the heavy-load fee per axle instead of once; reading hour 6 as night.

## Follow-ups
Add a weekend discount. Change the clock to minutes since midnight. Replace the chain with a 24-entry lookup table and discuss when each is clearer.

## Similar problems
Fizz Buzz (LeetCode 412).
