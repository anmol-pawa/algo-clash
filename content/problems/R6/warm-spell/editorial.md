## Signals
"For each element, how far to the next larger one" is the textbook next-greater-element query. Whenever each item must be matched with the nearest later item that beats it, think of a stack of items that are still unmatched.

## Brute force
For every day, scan forward until a warmer day appears. Fine for short forecasts, but a long cooling streak (`n, n-1, ..., 1`) makes every scan run to the end: O(n²) time, too slow for 100,000 days.

## Key insight
Days that are still waiting always form a non-increasing run of temperatures. If a waiting day were colder than the one above it, the upper day would already have settled it. So when a new day arrives, only the top of the stack can be settled first, then the next one, and so on until a day at least as warm is found. That day (and everything beneath it) keeps waiting.

## Optimal
Keep a stack of indices. For each day `d`, while the stack is non-empty and `forecast[top] < forecast[d]`, set `wait[top] = d - top` and pop. Then push `d`. Anything left on the stack at the end keeps its default wait of 0. Each index is pushed once and popped at most once, so time is O(n); the stack costs O(n) space in the worst case (a cooling streak).

## C++ walkthrough
Store indices, not temperatures: the gap needs the index, and the temperature is one lookup away. A `vector<int>` with `back()`, `push_back` and `pop_back` is a faster stack than `std::stack` for this. The comparison must be strict (`<`), because an equal temperature is not warmer. Initialise `wait` with zeros so the leftovers need no extra pass.

## Common bugs
Using `<=` so equal days settle each other; replacing the `while` with an `if` so only one waiting day is settled per new day; storing the day number instead of the gap `d - top`.

## Follow-ups
Walk from the right instead and store the answer by jumping through earlier answers (no stack). Make the array circular so the search wraps around. Ask for the next warmer day's temperature rather than the gap.

## Similar problems
Daily Temperatures (LeetCode 739) is this problem; Next Greater Element II (LeetCode 503) is the circular follow-up.
