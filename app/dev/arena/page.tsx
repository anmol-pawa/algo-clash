"use client";

import BattleArena, { type ArenaProblem } from "@/components/BattleArena";
import { meta } from "@/content/problems/R6/crate-brackets/meta";
import allTests from "@/content/problems/R6/crate-brackets/tests.json";

// Dev-only sample: B4 replaces this with the real encounter flow.
const STATEMENT = `# Crate Brackets

A dock worker labels stacked crates with brackets: \`(\` \`)\` \`[\` \`]\` \`{\` \`}\`. A label is **balanced** when every opening bracket is closed by a bracket of the same kind, and brackets close in the reverse order they opened.

Given the label \`s\`, return \`true\` if it is balanced and \`false\` otherwise.

## Examples

- \`s = "([]{})"\` gives \`true\`.
- \`s = "([)]"\` gives \`false\`.

## Constraints

- \`0 <= s.length() <= 100000\`
- \`s\` contains only the six bracket characters.
`;

const STARTER = `class Solution {
public:
    bool isBalanced(string s) {
        return true; // TODO
    }
};
`;


const problem: ArenaProblem = {
  id: meta.id,
  title: meta.title,
  difficulty: meta.difficulty,
  statement: STATEMENT,
  starter: STARTER,
  spec: meta.spec,
  timeLimitMs: meta.timeLimitMs,
  tests: allTests as ArenaProblem["tests"],
  foeName: "Bracketeer",
  foeLevel: 4,
};

/** Battle layout playground (B3c): stage on top with statement and editor below; tabs on mobile. */
export default function DevArena() {
  return <BattleArena problem={problem} />;
}
