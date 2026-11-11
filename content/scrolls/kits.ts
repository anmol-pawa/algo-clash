import type { FunctionSpec } from "@/lib/judge/harness/driver";
import type { TestCase } from "@/lib/judge/verdict";
import { meta as pouchMeta } from "../problems/R0/pouch-sum/meta";
import { meta as stretchMeta } from "../problems/R2/exact-stretches/meta";
import { meta as basinMeta } from "../problems/R2/widest-basin/meta";
import { meta as peaksMeta } from "../problems/R3/pane-peaks/meta";
import { meta as tidyMeta } from "../problems/R3/tidy-tape/meta";
import { meta as echoMeta } from "../problems/R4/echo-strand/meta";
import { meta as verseMeta } from "../problems/R4/verse-match/meta";

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

const TIDY_STATEMENT = `# Tidy Tape

A label printer prints one lowercase letter per tick onto a long tape, given as the string \`tape\`. A stretch of consecutive letters is **tidy** if no letter appears more than \`m\` times inside it.

Return the length of the longest tidy stretch. (With \`m = 1\` this asks for the longest stretch of all-different letters.)

## Examples

- \`tape = "abcabcbb"\`, \`m = 1\` gives \`3\` (\`"abc"\`).
- \`tape = "aabaabaa"\`, \`m = 2\` gives \`4\` (\`"baab"\`; every stretch of 5 holds at least three \`a\`).
- \`tape = "zzzz"\`, \`m = 10\` gives \`4\`.

## Constraints

- \`0 <= tape.length() <= 100000\`
- \`tape\` contains only \`a\` to \`z\`.
- \`1 <= m <= 100000\`
`;

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

const VERSE_STATEMENT = `# Verse Match

A poet marks the rhyme of a poem with a **pattern**: one lowercase letter per line, where equal letters mean "these lines are the same word" and different letters mean "different words". A poem **fits** a pattern when letters and words pair up perfectly: the same letter always stands for the same word, and two different letters never stand for the same word.

You are given a \`pattern\` and a list of \`words\`. They may have different lengths. Return the length of the **longest prefix** (counting the first \`L\` letters against the first \`L\` words) that still fits. The empty prefix always fits.

## Examples

- \`pattern = "abba"\`, \`words = ["sun","moon","moon","sun"]\` gives \`4\`.
- \`pattern = "abba"\`, \`words = ["sun","moon","moon","star"]\` gives \`3\` (\`a\` would have to be both \`sun\` and \`star\`).
- \`pattern = "abc"\`, \`words = ["x","x"]\` gives \`1\` (\`a\` and \`b\` would both be \`x\`, and only two words exist).
- \`pattern = ""\`, \`words = ["a"]\` gives \`0\`.

## Constraints

- \`0 <= pattern.length() <= 100000\`, \`0 <= words.size() <= 100000\`
- Each word has \`1\` to \`10\` lowercase letters; the pattern has only lowercase letters.
- The total number of word characters is at most \`1000000\`.
`;

const ECHO_STATEMENT = `# Echo Strand

A lab records a strand as a string of the four letters \`A\`, \`C\`, \`G\` and \`T\`. An **echo** is a block of exactly \`k\` consecutive letters that occurs at **two or more different starting positions** (the occurrences may overlap).

Return every distinct echo exactly once, sorted in ascending alphabetical (lexicographic) order.

## Example

\`\`\`
strand = "ACGACGAC", k = 3
blocks:  ACG(0)  CGA(1)  GAC(2)  ACG(3)  CGA(4)  GAC(5)
echoes:  ["ACG", "CGA", "GAC"]

strand = "AAAAAA", k = 2   ->  ["AA"]     (starts 0..4, overlapping)
strand = "ACGT",   k = 2   ->  []
\`\`\`

## Constraints

- \`0 <= strand.length() <= 100000\`; every letter is \`A\`, \`C\`, \`G\` or \`T\`.
- \`1 <= k <= 30\`.
- If \`k > strand.length()\` there are no blocks and the answer is empty.
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
    statement: TIDY_STATEMENT,
    starter: `class Solution {
public:
    int longestTidy(string tape, int m) {
        // write the scroll from memory
    }
};
`,
    spec: tidyMeta.spec as FunctionSpec,
    parSeconds: tidyMeta.parSeconds,
    timeLimitMs: tidyMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R3/tidy-tape/tests.json")).default as TestCase[],
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
  "two-way-map": {
    statement: VERSE_STATEMENT,
    starter: `class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        // write the scroll from memory
    }
};
`,
    spec: verseMeta.spec as FunctionSpec,
    parSeconds: verseMeta.parSeconds,
    timeLimitMs: verseMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R4/verse-match/tests.json")).default as TestCase[],
  },
  "rolling-key": {
    statement: ECHO_STATEMENT,
    starter: `class Solution {
public:
    vector<string> echoes(string strand, int k) {
        // write the scroll from memory
    }
};
`,
    spec: echoMeta.spec as FunctionSpec,
    parSeconds: echoMeta.parSeconds,
    timeLimitMs: echoMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R4/echo-strand/tests.json")).default as TestCase[],
  },
};
