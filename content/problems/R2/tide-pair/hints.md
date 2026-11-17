## Nudge
When you stand on hour j, which single value would complete the pair? Could you have remembered it earlier?

## Approach
Scan the hours left to right. For each reading ask: has the number `target - reading` been seen at an earlier hour? Keep a map from value to the earliest hour that held it.

## Key insight
Look the complement up **before** you store the current reading, so an hour never pairs with itself. Store each value only the first time (`emplace`) so equal readings report the smallest `i`. The first hour `j` that finds a partner is, by construction, the earliest finishing pair.
