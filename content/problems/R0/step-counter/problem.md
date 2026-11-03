# Step Counter

Implement a class `StepCounter`, a pedometer with a ceiling.

- `StepCounter(int limit, int start)` creates a counter whose current total is `start`. It can never exceed `limit`. (`0 <= start <= limit`.)
- `int add(int amount)` adds `amount` (which may be negative) to the total, then forces the total into the range `[0, limit]`, and returns the new total.
- `int total()` returns the current total.
- `void reset()` puts the total back to the `start` given to the constructor.

Calls arrive in the usual format: a list of operation names, then a list of argument lists. The output has one entry per call, `null` for the constructor and for `void` methods.

## Examples

- Operations `["StepCounter","add","add","total"]` with arguments `[[10,3],[4],[20],[]]` give `[null,7,10,10]`.
- Operations `["StepCounter","add","reset","total"]` with arguments `[[5,2],[-9],[],[]]` give `[null,0,null,2]`.
- Operations `["StepCounter","total"]` with arguments `[[8,8],[]]` give `[null,8]`.

## Constraints

- `1 <= limit <= 1000000`
- `0 <= start <= limit`
- `-1000000 <= amount <= 1000000`
- at most `200000` calls
