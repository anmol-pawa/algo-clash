import type { FunctionSpec } from "@/lib/judge/harness/driver";
import type { TestCase } from "@/lib/judge/verdict";
import { meta as pouchMeta } from "../problems/R0/pouch-sum/meta";

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
};
