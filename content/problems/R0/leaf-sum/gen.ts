import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";
import { makeTree, treeLiteral } from "../../../../lib/content/treegen";

const t = (root: ReturnType<typeof makeTree>): string[] => [treeLiteral(root)];
const mk = (r: Rng, n: number, shape: Parameters<typeof makeTree>[2], lo = -9, hi = 9) => t(makeTree(r, n, shape, lo, hi));

export const gen: GenModule = {
  small: (r) => mk(r, r.int(0, 9), "random"),
  groups: {
    basic: [["[3,9,20,null,null,15,7]"], ["[1,2]"], ["[8]"], ["[]"], (r) => mk(r, 10, "random")],
    edge: [["[-5]"], ["[1,null,2]"], ["[0,0,0]"], ["[1,2,3,4,null,null,5]"], (r) => mk(r, 7, "complete")],
    adversarial: [(r) => mk(r, 200, "random", -1000, 1000), (r) => mk(r, 400, "zigzag", -1000, 1000), (r) => mk(r, 255, "complete", 1000, 1000)],
    perf: [(r) => mk(r, 5000, "left", -1000, 1000), (r) => mk(r, 5000, "right", -1000, 1000), (r) => mk(r, 5000, "random", -1000, 1000), (r) => mk(r, 4095, "complete", 1000, 1000)],
  },
};
