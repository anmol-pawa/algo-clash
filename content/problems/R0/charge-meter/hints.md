## Nudge
You must stop as soon as the charge reaches the limit. Which loop statements let you skip an item, and which let you leave the loop?
## Approach
Walk the readings by index. If a reading is negative, skip it. Otherwise add it to a running charge and check whether the charge has reached the limit.
## Key insight
Use `continue` for the noise case and `return i` the moment `charge >= limit`. The charge can reach 10^14, so it must be a `long long`, and "at least" means `>=`. Return the index, not the count of ticks.
