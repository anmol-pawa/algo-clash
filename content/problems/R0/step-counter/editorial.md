## Signals
A small stateful class: private members, a constructor, and methods that keep an invariant (the total stays inside the range).

## Brute force
Keep a log of every `add` since the last `reset` and recompute the total from `start` each time, clamping after every step. O(k) per call, so O(n^2) overall. It is the checker.

## Key insight
Clamping after every addition is not the same as clamping once at the end, so the state must be the clamped total, updated incrementally. Each call is then O(1).

## Optimal
Every method is O(1), space O(1).

## C++ walkthrough
The members are `private` (a `class` defaults to private, so the public part needs the `public:` label). The constructor uses a member initialiser list, which initialises members in the order they are declared, not the order you list them, so declare `limit`, `start`, `current` and initialise them in that order. `int total() const` is `const` because it only reads; the harness calls it on a non-const object, so either form compiles, but `const` is good style. `max(0, min(current, limit))` clamps without branches. `current` is an `int`: the largest intermediate value is 1000000 + 1000000, so `int` is safe here.

## Common bugs
Writing `limit = limit;` in the constructor body (the member stays at its default). Clamping only at the top, so the total can go negative. `reset` setting the total to 0 instead of `start`. Clamping only when reading `total()`, which makes the stored value drift. Forgetting `public:`, which makes every method private and fails to compile.

## Follow-ups
Add a `setLimit` that re-clamps the total. Support `undo` of the last `add`. Make the class generic over the integer type with a template.

## Similar problems
Design Parking System (LeetCode 1603): the same "constructor plus small methods" shape.
