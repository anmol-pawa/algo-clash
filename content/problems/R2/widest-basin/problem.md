# Widest Basin

Along a canal, vertical posts stand one unit apart. The post at position `i` has height `heights[i]`. Choose any two posts and stretch a tarp between them to make a basin: its **capacity** is the distance between the posts (the difference of their positions) times the height of the **shorter** of the two. Tall posts between them do not matter.

Return the largest capacity you can get. If there are fewer than two posts, the answer is `0`.

## Examples

- `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]` gives `49` (the posts of height 8 and 7, seven apart).
- `heights = [1, 1]` gives `1`.
- `heights = [4, 3, 2, 1, 4]` gives `16`.

## Constraints

- `0 <= heights.size() <= 100000`
- `0 <= heights[i] <= 100000`

Note that the answer can exceed the range of a 32-bit integer. Aim for O(n) time.
