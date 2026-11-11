## Nudge
There are about n blocks of length k. Copying each one into a string and hashing it costs O(k) per block. Can you get the next block's identity from the previous block's in O(1)?

## Approach
Only four letters means two bits per letter, so a block of up to 30 letters fits in a 60-bit integer. Slide: shift the key left by 2, add the new letter's code, mask off the bits that fell out of the window. Count each key in a hash map (or remember which keys were seen once), and record a block when its count reaches 2.

## Key insight
The encoding is exact (no collisions), so equal keys mean equal blocks. Use `long long` (or `unsigned long long`): 2k bits is up to 60, which overflows `int`. Build the answer from the keys you recorded, or from the substring at the first repeat, then sort.
