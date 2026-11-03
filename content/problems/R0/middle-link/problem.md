# Middle Link

Given the head of a singly linked list, return the node in the middle, which is the node at index `n / 2` (counting from 0, integer division). For an even length that is the second of the two middle nodes. The answer is the node itself, so the result is the list that starts there. For an empty list return `nullptr`.

## Examples

- `head = [1,2,3,4,5]` gives `[3,4,5]`.
- `head = [1,2,3,4]` gives `[3,4]`.
- `head = [9]` gives `[9]`.
- `head = []` gives `[]`.

## Constraints

- `0 <=` number of nodes `<= 100000`
- `-1000 <= val <= 1000`
