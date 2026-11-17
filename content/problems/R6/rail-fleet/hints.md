## Nudge
Forget the slowing down for a moment: how long would each train take to reach the depot if the track were empty? Then think about which trains can ever be held up.

## Approach
Sort the trains by starting position, front of the line first. A train ahead of you can only hold you up, never speed you up, so you join its convoy exactly when your own empty-track time is no later than the time of the convoy ahead. Otherwise you start a new convoy.

## Key insight
Compare arrival times without division: train A takes `dA / sA`, train B takes `dB / sB` with `d = depot - start`; compare `dA * sB` against `dB * sA` in `long long`, since the products reach 10^15. Only the most recent convoy ahead matters, so a single running "slowest so far" is enough.
