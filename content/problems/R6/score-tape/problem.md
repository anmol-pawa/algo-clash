# Score Tape

A quiz machine records a **score tape**. It starts empty and processes `commands` in order. Each command is one of:

- an integer such as `"7"` or `"-3"`: append that score to the tape.
- `"+"`: append the **sum of the last two** scores on the tape.
- `"D"`: append **double the last** score.
- `"H"`: append **half the last** score, rounded toward zero (`H` of `7` is `3`, of `-7` is `-3`).
- `"C"`: **cancel** (remove) the last score on the tape.

Return the sum of all scores left on the tape at the end, or `0` if the tape is empty.

## Examples

- `commands = ["5", "2", "C", "D", "+"]` gives `30` (the tape goes `[5]`, `[5,2]`, `[5]`, `[5,10]`, `[5,10,15]`).
- `commands = ["8", "H", "H", "+"]` gives `14` (the tape becomes `[8,4,2,6]`).
- `commands = ["-4", "D", "C", "C"]` gives `0`.

## Constraints

- `0 <= commands.length <= 100000`.
- Commands are always valid: `"+"` needs at least two scores on the tape, and `"D"`, `"H"` and `"C"` need at least one.
- Every score that ever lands on the tape has absolute value at most `1000000000`, so scores fit in `int`; the final sum may not.
