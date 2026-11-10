## Nudge
When you stand on coin `j`, which single value would complete a match with an earlier coin? Can you ask "how many earlier coins have that value?" in O(1)?

## Approach
Keep a hash map from value to how many times it has appeared so far. For each coin, add the count of `target - value` to the answer, then record the coin.

## Key insight
Look up before you insert, so a coin never pairs with itself. The answer can reach about 5 billion (all values equal), so accumulate in `long long`.
