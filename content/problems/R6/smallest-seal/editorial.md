## Signals
"Delete exactly k elements so the remaining sequence is as small (or large) as possible, order preserved." A bigger value before a smaller one is the thing to get rid of: that is a monotonic stack with a budget.

## Brute force
Try every subset of `n - k` digits to keep, strip leading zeros, and compare as numbers (shorter is smaller, then lexicographic). Correct, but there are C(n, k) subsets: exponential. A smarter brute force deletes, k times, the first digit that is larger than its right neighbour: O(n · k), still 10^10 steps for n = 100000 and k = 50000.

## Key insight
Compare two candidates of equal length digit by digit from the left: the first difference decides. So at each position we want the smallest digit we can afford. If the previous kept digit is larger than the incoming one, removing it makes the number strictly smaller at that position no matter what follows, so it is optimal to spend a scratch on it.

## Optimal
Keep a string `kept` as a stack. For each digit `d`: while `k > 0` and `kept.back() > d`, pop and decrement `k`; then push `d`. After the scan the stack is non-decreasing among the digits that survived, so the biggest digits are at the end: drop `k` more characters from the end. Strip leading zeros and return `"0"` if empty. Every digit is pushed once and popped at most once: O(n) time, O(n) space.

## C++ walkthrough
A `std::string` works as the stack (`push_back`, `pop_back`, `back`). Compare `char`s directly since '0'..'9' are ordered. Removing the leftover `k` with `resize` is safe because `k <= kept.size()` always holds. Use `find_first_not_of('0')` to find the first non-zero digit; `npos` means all zeros (or empty), so return `"0"`. Do the zero-stripping after the removals, never before.

## Common bugs
Forgetting to apply leftover removals (an increasing code such as `12345`); keeping leading zeros; returning an empty string instead of `"0"`; popping with `>=` is harmless, but popping when `kept.back() < d` makes the largest number instead; scratching the `k` biggest digits ignoring position (order matters more than size).

## Follow-ups
Make the *largest* number. Keep exactly `m` digits to make the lexicographically smallest subsequence of a string of letters. Remove duplicates so that each letter appears once and the result is smallest (stack plus last-occurrence info).

## Similar problems
Remove K Digits (LeetCode 402) is this problem. Daily Temperatures (LeetCode 739) uses the same monotonic stack with a different question.
