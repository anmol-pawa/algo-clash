# Clear the Deck

A deck of numbered cards lies in a row. The dealer throws away every card showing the number `target`. The other cards keep their relative order.

Return the remaining deck.

## Examples

- `deck = [3, 1, 3, 3, 2], target = 3` gives `[1, 2]`.
- `deck = [5, 6], target = 9` gives `[5, 6]`.
- `deck = [4, 4, 4], target = 4` gives `[]`.

## Constraints

- `0 <= deck.size() <= 200000`
- `-1000000000 <= deck[i], target <= 1000000000`
