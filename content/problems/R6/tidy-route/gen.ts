import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const rep = (t: string, n: number) => t.repeat(n);
const NAMES = ["a", "b", "ab", "x", "usr", "...", ".a", "a.", "..a", "...."];
/** Random route out of names, dots, double dots and slash runs. */
function route(r: Rng, tokens: number, pUp: number): string {
  let s = "/";
  for (let i = 0; i < tokens; i++) {
    const x = r.next();
    s += x < pUp ? ".." : x < pUp + 0.1 ? "." : r.pick(NAMES);
    s += r.next() < 0.2 ? "//" : "/";
  }
  return r.next() < 0.5 && s.length > 1 ? s.slice(0, -1) : s;
}

export const gen: GenModule = {
  small: (r) => [q(route(r, r.int(0, 7), r.pick([0.2, 0.4])))],
  groups: {
    basic: [
      [q("/a/./b/../c/")],
      [q("/../..")],
      [q("//x///y")],
      [q("/a/.../b/..")],
      (r) => [q(route(r, 10, 0.3))],
      [q("/home//user/./docs/../pics/")],
    ],
    edge: [
      [q("/")],
      [q("//")],
      [q("/.")],
      [q("/..")],
      [q("/a")],
      [q("/a/")],
      [q("/a/..")],
      [q("/.../")],
      [q("/..a/.b/c.")],
      [q("/a/b/c/../../..")],
      [q("/a/b/c/../../../..")],
    ],
    adversarial: [
      [q("/" + rep("a/", 400) + rep("../", 401))],
      [q(rep("/..", 500) + "/z")],
      [q(rep("//./", 300) + "k")],
      (r) => [q(route(r, 500, 0.45))],
      (r) => [q(route(r, 500, 0.25))],
      [q(rep("/a/..", 300))],
    ],
    perf: [
      [q(rep("/a", 25000) + rep("/..", 16000))],
      [q(rep("/ab/..", 16000))],
      [q(rep("/a", 30000))],
      (r) => [q(route(r, 20000, 0.4))],
      (r) => [q(route(r, 20000, 0.3))],
      [q(rep("/.", 33000))],
    ],
  },
};
