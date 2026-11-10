# Mirror Check

A lighthouse keeper scratches messages onto stones and claims some of them read the same from both ends. Letters and digits are the only characters that count; spaces and punctuation are decoration, and capital letters match their lowercase twins.

Given `line`, return `true` if the characters that count, read left to right, spell the same thing as when read right to left. An empty message, or one with nothing that counts, is a mirror.

## Examples

- `line = "A man a plan a canal Panama"` gives `true`.
- `line = "race a car"` gives `false`.
- `line = " ,. "` gives `true`.

## Constraints

- `0 <= line.size() <= 100000`
- `line` contains only letters, digits, spaces and the characters `, . :`

Aim for O(n) time and O(1) extra space.
