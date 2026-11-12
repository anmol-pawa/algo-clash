## Nudge
Every command talks about the *latest* scores, and `C` throws the latest one away. What structure gives you cheap access to the newest entries and cheap removal of the newest?

## Approach
Keep the tape in a vector used as a stack. `C` pops. `D` and `H` push a value computed from `back()`. `+` reads the top two (read them before you push) and pushes their sum. A number is parsed and pushed. At the end add up what is left.

## Key insight
Because each command only touches the top of the tape, a stack gives O(1) per command. Use C++ `/ 2` for `H` (it truncates toward zero, as the statement says) and sum into a `long long`.
