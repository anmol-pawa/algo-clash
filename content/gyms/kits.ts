import type { DriverSpec } from "@/lib/judge/harness/driver";
import type { TestCase } from "@/lib/judge/verdict";
import { meta as squashMeta } from "../problems/R0/run-squash/meta";
import { meta as stepMeta } from "../problems/R0/step-counter/meta";

/** What the gym UI needs to run a coding battle on a problem package (tests load lazily as their own chunk). */
export interface GymKit {
  title: string;
  difficulty: string;
  foeName: string;
  foeLevel: number;
  statement: string;
  starter: string;
  spec: DriverSpec;
  timeLimitMs: number;
  loadTests: () => Promise<TestCase[]>;
}

/** Equals content/problems/R0/run-squash/problem.md (tested). */
const SQUASH_STATEMENT = `# Run Squash

A conveyor belt carries labelled crates. Whenever several crates in a row carry the same label, the inspector keeps only the first crate of that run. Crates with equal labels that are separated by a different label are both kept.

Given the labels \`nums\` in belt order, return the labels that remain, in the same order.

## Examples

- \`nums = [4, 4, 7, 7, 7, 4]\` gives \`[4, 7, 4]\`.
- \`nums = [1, 2, 3]\` gives \`[1, 2, 3]\`.
- \`nums = [9, 9, 9, 9]\` gives \`[9]\`.
- \`nums = []\` gives \`[]\`.

## Constraints

- \`0 <= nums.size() <= 300000\`
- \`-1000000000 <= nums[i] <= 1000000000\`
- \`nums\` is **not** sorted
`;

/** Equals content/problems/R0/step-counter/problem.md (tested). */
const STEP_STATEMENT = `# Step Counter

Implement a class \`StepCounter\`, a pedometer with a ceiling.

- \`StepCounter(int limit, int start)\` creates a counter whose current total is \`start\`. It can never exceed \`limit\`. (\`0 <= start <= limit\`.)
- \`int add(int amount)\` adds \`amount\` (which may be negative) to the total, then forces the total into the range \`[0, limit]\`, and returns the new total.
- \`int total()\` returns the current total.
- \`void reset()\` puts the total back to the \`start\` given to the constructor.

Calls arrive in the usual format: a list of operation names, then a list of argument lists. The output has one entry per call, \`null\` for the constructor and for \`void\` methods.

## Examples

- Operations \`["StepCounter","add","add","total"]\` with arguments \`[[10,3],[4],[20],[]]\` give \`[null,7,10,10]\`.
- Operations \`["StepCounter","add","reset","total"]\` with arguments \`[[5,2],[-9],[],[]]\` give \`[null,0,null,2]\`.
- Operations \`["StepCounter","total"]\` with arguments \`[[8,8],[]]\` give \`[null,8]\`.

## Constraints

- \`1 <= limit <= 1000000\`
- \`0 <= start <= limit\`
- \`-1000000 <= amount <= 1000000\`
- at most \`200000\` calls
`;

export const gymKits: Record<string, GymKit> = {
  "run-squash": {
    title: squashMeta.title, difficulty: squashMeta.difficulty, foeName: "Warden Brace", foeLevel: 8,
    statement: SQUASH_STATEMENT,
    starter: `class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        // TODO
    }
};
`,
    spec: squashMeta.spec, timeLimitMs: squashMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R0/run-squash/tests.json")).default as TestCase[],
  },
  "step-counter": {
    title: stepMeta.title, difficulty: stepMeta.difficulty, foeName: "Warden Brace", foeLevel: 10,
    statement: STEP_STATEMENT,
    starter: `class StepCounter {
public:
    StepCounter(int limit, int start) {
        // TODO
    }
    int add(int amount) {
        // TODO
    }
    int total() const {
        // TODO
    }
    void reset() {
        // TODO
    }
};
`,
    spec: stepMeta.spec, timeLimitMs: stepMeta.timeLimitMs,
    loadTests: async () => (await import("../problems/R0/step-counter/tests.json")).default as TestCase[],
  },
};
