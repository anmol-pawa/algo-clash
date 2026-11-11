import type { FunctionSpec } from "@/lib/judge/harness/driver";
import type { TestCase } from "@/lib/judge/verdict";
import { meta as pouchMeta } from "../problems/R0/pouch-sum/meta";
import { meta as stretchMeta } from "../problems/R2/exact-stretches/meta";
import { meta as basinMeta } from "../problems/R2/widest-basin/meta";
import { meta as coverMeta } from "../problems/R3/cover-strip/meta";
import { meta as peaksMeta } from "../problems/R3/pane-peaks/meta";

/** Everything the Forge UI needs to judge a scroll: the problem spec, statement, starter and (lazily loaded) hidden tests. */
export interface ScrollKit {
  statement: string;
  starter: string;
  spec: FunctionSpec;
  parSeconds: number;
  timeLimitMs: number;
  loadTests: () => Promise<TestCase[]>;
}

/** Equals content/problems/R0/pouch-sum/problem.md (tested). */
const POUCH_STATEMENT = `# Pouch Sum

A traveller carries a pouch of coins. Coin \`i\` is worth \`coins[i]\`. The toll keeper only accepts coins worth at least \`minValue\`; all smaller coins are refused. Return the total value of the accepted coins.

## Examples

- \`coins = [5, 1, 7, 3], minValue = 4\` gives \`12\` (the 5 and the 7).
- \`coins = [2000000000, 2000000000], minValue = 1\` gives \`4000000000\`.
- \`coins = [1, 2, 3], minValue = 10\` gives \`0\`.

## Constraints

- \`0 <= coins.size() <= 100000\`
- \`0 <= coins[i] <= 2000000000\`
- \`0 <= minValue <= 2000000000\`
`;

const STRETCH_STATEMENT = `# Exact Stretches

You are given a list of integers \`nums\`, which may include negatives and zeros, and a number \`target\`. Count how many **consecutive, non-empty stretches** of the list add up to exactly \`target\`. Stretches at different positions count separately even if they hold the same values.

## Examples

- \`nums = [1, 2, 3]\`, \`target = 3\` gives \`2\` (\`[1, 2]\` and \`[3]\`).
- \`nums = [1, -1, 1, -1]\`, \`target = 0\` gives \`4\`.
- \`nums = [0, 0, 0]\`, \`target = 0\` gives \`6\`.

## Constraints

- \`0 <= nums.size() <= 100000\`
- \`-1000 <= nums[i] <= 1000\`
- \`-1000000000 <= target <= 1000000000\`

The count can exceed the range of a 32-bit integer (an array of zeros with target 0 has about 5 * 10^9 stretches). Aim for O(n) time.
`;

const BASIN_STATEMENT = `# Widest Basin

Along a canal, vertical posts stand one unit apart. The post at position \`i\` has height \`heights[i]\`. Choose any two posts and stretch a tarp between them to make a basin: its **capacity** is the distance between the posts (the difference of their positions) times the height of the **shorter** of the two. Tall posts between them do not matter.

Return the largest capacity you can get. If there are fewer than two posts, the answer is \`0\`.

## Examples

- \`heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\` gives \`49\` (the posts of height 8 and 7, seven apart).
- \`heights = [1, 1]\` gives \`1\`.
- \`heights = [4, 3, 2, 1, 4]\` gives \`16\`.

## Constraints

- \`0 <= heights.size() <= 100000\`
- \`0 <= heights[i] <= 100000\`

Note that the answer can exceed the range of a 32-bit integer. Aim for O(n) time.
`;

/** Equals content/problems/R3/cover-strip/problem.md (tested). */
const COVER_STATEMENT = `# Cover Strip

A banner is printed as a string of letters, \`tape\`. A collector needs a set of charms, given as the string \`charms\`: every letter in \`charms\` stands for one charm, so \`"aab"\` means two \`a\` charms and one \`b\` charm.

A stretch of consecutive letters of \`tape\` **covers** the charms when it holds at least as many copies of each letter as \`charms\` asks for (it may hold extra letters too).

Return the **shortest** covering stretch. If several have the same shortest length, return the one that starts **leftmost**. If no stretch covers the charms, return the empty string.

## Examples

- \`tape = "xaybzacb"\`, \`charms = "abc"\` gives \`"acb"\` (length 3; \`"bzac"\` also covers but is longer).
- \`tape = "aab"\`, \`charms = "ab"\` gives \`"ab"\`.
- \`tape = "abca"\`, \`charms = "aa"\` gives \`"abca"\` (two \`a\` are needed).
- \`tape = "xyz"\`, \`charms = "w"\` gives \`""\`.

## Constraints

- \`0 <= tape.length() <= 100000\`
- \`1 <= charms.length() <= 100000\`
- Both strings contain only English letters \`a\` to \`z\` and \`A\` to \`Z\` (upper and lower case are different letters).
`;

/** Equals content/problems/R3/pane-peaks/problem.md (tested). */
const PEAKS_STATEMENT = `# Pane Peaks

A greenhouse roof is a row of glass panes. \`heat[i]\` is the temperature reading of pane \`i\` (it can be negative on frosty days). A cleaning frame covers exactly \`width\` neighbouring panes and starts over the first \`width\` panes. It then slides one pane to the right at a time until it reaches the last pane.

For every position of the frame, record the **hottest** reading among the panes it covers. Return all these readings in order, from the leftmost frame position to the rightmost.

## Examples

- \`heat = [2, 7, 1, 5, 3]\`, \`width = 3\` gives \`[7, 7, 5]\`.
- \`heat = [4, 4, 4]\`, \`width = 2\` gives \`[4, 4]\`.
- \`heat = [-3, -8, -1]\`, \`width = 1\` gives \`[-3, -8, -1]\`.
- \`heat = [9, 1, 2]\`, \`width = 3\` gives \`[9]\`.

## Constraints

- \`1 <= heat.size() <= 100000\`
- \`1 <= width <= heat.size()\`
- \`-1000000000 <= heat[i] <= 1000000000\`
`;

export const scrollKits: Record<string, ScrollKit> = {
  accumulate: {
    statement: POUCH_STATEMENT,
    starter: `class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        // write the scroll from memory
    }
};
`,
    spec: pouchMeta.spec as FunctionSpec,
    parSeconds: pouchMeta.parSeconds,
    timeLimitMs: pouchMeta.timeLimitMs,
    // The 3 MB test file is its own chunk, fetched when a scroll is opened.
    loadTests: async () => (await import("../problems/R0/pouch-sum/tests.json")).default as TestCase[],
  },
  "prefix-hash": {
    statement: STRETCH_STATEMENT,
    starter: `class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        // write the scroll from memory
    }
};
`,
    spec: stretchMeta.spec as FunctionSpec,
    parSeconds: stretchMeta.parSeconds,
    timeLimitMs: stretchMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R2/exact-stretches/tests.json")).default as TestCase[],
  },
  "opposite-pointers": {
    statement: BASIN_STATEMENT,
    starter: `class Solution {
public:
    long long bestBasin(vector<int> heights) {
        // write the scroll from memory
    }
};
`,
    spec: basinMeta.spec as FunctionSpec,
    parSeconds: basinMeta.parSeconds,
    timeLimitMs: basinMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R2/widest-basin/tests.json")).default as TestCase[],
  },
  "variable-window": {
    statement: COVER_STATEMENT,
    starter: `class Solution {
public:
    string smallestCover(string tape, string charms) {
        // write the scroll from memory
    }
};
`,
    spec: coverMeta.spec as FunctionSpec,
    parSeconds: coverMeta.parSeconds,
    timeLimitMs: coverMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R3/cover-strip/tests.json")).default as TestCase[],
  },
  "monotonic-deque": {
    statement: PEAKS_STATEMENT,
    starter: `class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        // write the scroll from memory
    }
};
`,
    spec: peaksMeta.spec as FunctionSpec,
    parSeconds: peaksMeta.parSeconds,
    timeLimitMs: peaksMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R3/pane-peaks/tests.json")).default as TestCase[],
  },
};
