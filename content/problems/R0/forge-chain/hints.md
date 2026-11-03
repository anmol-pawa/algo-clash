## Nudge
You need to append at the end of the list many times. What pointer would make each append O(1)?
## Approach
Make a dummy node on the stack and a pointer `tail` to it. For each value, do `tail->next = new ListNode(value); tail = tail->next;`. At the end return `dummy.next`.
## Key insight
Starting from a dummy node means the first append needs no special case, and an empty array naturally returns `dummy.next`, which is still `nullptr`. Building from the back (prepending) also works, but then you must walk the array in reverse.
