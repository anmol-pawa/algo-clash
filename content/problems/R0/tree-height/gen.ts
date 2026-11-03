import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";
import { makeTree, treeLiteral } from "../../../../lib/content/treegen";

const t = (root: ReturnType<typeof makeTree>): string[] => [treeLiteral(root)];
const mk = (r: Rng, n: number, shape: Parameters<typeof makeTree>[2]) => t(makeTree(r, n, shape, -9, 9));

export const gen: GenModule = {
  small: (r) => mk(r, r.int(0, 9), "random"),
  groups: {
    basic: [["[3,9,20,null,null,15,7]"], ["[1,null,2]"], ["[5]"], ["[]"], (r) => mk(r, 10, "random")],
    edge: [["[1,2]"], ["[1,2,3]"], ["[1,2,null,3,null,4]"], (r) => mk(r, 7, "complete")],
    adversarial: [(r) => mk(r, 200, "random"), (r) => mk(r, 300, "zigzag"), (r) => mk(r, 255, "complete")],
    perf: [(r) => mk(r, 5000, "left"), (r) => mk(r, 5000, "right"), (r) => mk(r, 5000, "random"), (r) => mk(r, 5000, "zigzag")],
  },
};
