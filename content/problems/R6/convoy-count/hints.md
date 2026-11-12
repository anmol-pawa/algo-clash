## Nudge
If a truck drove alone, when would it reach the depot? Which trucks can possibly affect it: the ones in front of it or the ones behind it?

## Approach
Sort the trucks by starting mile, front to back. Walk through them keeping the arrival time of the convoy currently in front. A truck whose own lone arrival time is strictly later than that convoy's time can never catch it: it starts a new convoy. Otherwise it merges and adopts the convoy's time (so nothing changes).

## Key insight
A truck is held up only by what is ahead of it, and a convoy arrives when its slowest-to-arrive leader does. So the answer is the number of trucks whose lone arrival time is strictly greater than every truck's ahead of them; a running maximum in front-to-back order is enough. Compare times as fractions by cross-multiplying in `long long` to avoid rounding.
