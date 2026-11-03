## Nudge
Look at how many queries there are and how big the shelf list is. What does it cost if every query touches every shelf, or even just copies every shelf?
## Approach
The shelves are sorted, so each query is a binary search for the first shelf that is not lower than the query. The position of that shelf is the answer.
## Key insight
`std::lower_bound` returns the first element that is not less than the value, so its distance from `begin()` is exactly the count of strictly lower shelves. Take big containers as `const vector<int>&`: passing by value copies 10^5 ints per call, which times out when it happens 10^5 times.
