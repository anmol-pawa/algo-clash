## Nudge
A stack reverses the order of what you pour into it. What happens to the order if you pour the contents of one stack into a second stack?

## Approach
Keep an `inbox` for new customers and an `outbox` for serving. `enqueue` pushes onto the inbox. When you need the front and the outbox is empty, pour the whole inbox into the outbox (this reverses it, so the oldest ends on top). Serve from the outbox top.

## Key insight
Only pour when the outbox is **empty**. Pouring while it still holds customers would put newer people ahead of older ones. Each customer is moved at most once, so the pours cost O(1) amortised per operation.
