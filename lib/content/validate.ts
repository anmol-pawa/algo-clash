/** Pure validators for problem packages (ARCH §2.4 step 5). Each returns a list of problems; empty means valid. */
import { PATTERN_IDS } from "../../content/patterns";
import { TEST_GROUPS, type HiddenTest, type ProblemMeta } from "./types";

/** Editorial section headings, in order (GDD §8.3). */
export const EDITORIAL_SECTIONS = [
  "Signals",
  "Brute force",
  "Key insight",
  "Optimal",
  "C++ walkthrough",
  "Common bugs",
  "Follow-ups",
  "Similar problems",
] as const;

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const REGION = /^R(\d|1\d|2[0-3])$/;

export function validateMeta(meta: ProblemMeta, knownIds: ReadonlySet<string>): string[] {
  const errs: string[] = [];
  if (!KEBAB.test(meta.id)) errs.push(`id "${meta.id}" must be kebab-case`);
  if (!REGION.test(meta.region)) errs.push(`region "${meta.region}" must be R0–R23`);
  if (!meta.title.trim()) errs.push("title is empty");
  if (!["E", "M", "H"].includes(meta.difficulty)) errs.push(`difficulty "${meta.difficulty}" must be E, M or H`);
  if (meta.patterns.length === 0) errs.push("needs at least one pattern");
  for (const p of meta.patterns) if (!PATTERN_IDS.has(p)) errs.push(`unknown pattern "${p}"`);
  if (new Set(meta.patterns).size !== meta.patterns.length) errs.push("duplicate pattern");
  if (meta.signals.length === 0) errs.push("needs at least one signal");
  for (const q of meta.prerequisites) {
    if (q === meta.id) errs.push("a problem cannot require itself");
    else if (!knownIds.has(q)) errs.push(`unknown prerequisite "${q}"`);
  }
  if (!(meta.parSeconds > 0)) errs.push("parSeconds must be set");
  if (!(meta.timeLimitMs > 0)) errs.push("timeLimitMs must be set");
  const total = TEST_GROUPS.reduce((s, g) => s + (meta.testWeights[g] ?? 0), 0);
  if (TEST_GROUPS.some((g) => !(meta.testWeights[g] >= 0)) || Math.abs(total - 1) > 1e-9) errs.push("testWeights must be non-negative and sum to 1");
  for (const s of meta.similar) {
    if (!s.name.trim()) errs.push("similar pointer needs a name");
    if (s.url !== undefined && !/^https:\/\//.test(s.url)) errs.push(`similar url "${s.url}" must be https`);
  }
  return errs;
}

/** Checks all editorial headings exist as `## <name>`, in order, each with body text. */
export function validateEditorial(md: string): string[] {
  const errs: string[] = [];
  const heads = [...md.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => ({ name: m[1], at: m.index ?? 0, end: (m.index ?? 0) + m[0].length }));
  let last = -1;
  for (const want of EDITORIAL_SECTIONS) {
    const i = heads.findIndex((h) => h.name === want);
    if (i < 0) {
      errs.push(`editorial is missing "## ${want}"`);
      continue;
    }
    if (i < last) errs.push(`editorial section "${want}" is out of order`);
    last = Math.max(last, i);
    const body = md.slice(heads[i].end, heads[i + 1]?.at ?? md.length).trim();
    if (body.length < 20) errs.push(`editorial section "${want}" is empty`);
  }
  const optimal = /##\s+Optimal([\s\S]*?)(?=^##\s|$(?![\r\n]))/m.exec(md)?.[1] ?? "";
  if (!/O\(/.test(optimal)) errs.push('"Optimal" must state time and space complexity as O(...)');
  return errs;
}

/** Hints are a 3-rung ladder: `## Nudge`, `## Approach`, `## Key insight`. */
export function validateHints(md: string): string[] {
  const errs: string[] = [];
  const names = [...md.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);
  const want = ["Nudge", "Approach", "Key insight"];
  if (names.join("|") !== want.join("|")) errs.push(`hints must have exactly the rungs ${want.join(", ")} in order (found: ${names.join(", ") || "none"})`);
  for (const w of want) {
    const body = new RegExp(`^##\\s+${w}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, "m").exec(md)?.[1] ?? "";
    if (body.trim().length < 10) errs.push(`hint rung "${w}" is empty`);
  }
  return errs;
}

/** Statement needs a title line, Examples and Constraints. */
export function validateStatement(md: string): string[] {
  const errs: string[] = [];
  if (!/^#\s+\S/m.test(md)) errs.push("statement needs a `# Title` line");
  if (!/^##\s+Examples?\s*$/m.test(md)) errs.push("statement needs `## Examples`");
  if (!/^##\s+Constraints\s*$/m.test(md)) errs.push("statement needs `## Constraints`");
  return errs;
}

/** Hidden tests: every group present (perf optional only if its weight is 0), no duplicates, non-empty. */
export function validateTests(tests: HiddenTest[], meta: Pick<ProblemMeta, "testWeights">): string[] {
  const errs: string[] = [];
  for (const g of TEST_GROUPS) {
    const n = tests.filter((t) => t.group === g).length;
    if (n === 0 && meta.testWeights[g] > 0) errs.push(`no tests in group "${g}" but its weight is ${meta.testWeights[g]}`);
    if (n > 0 && meta.testWeights[g] === 0) errs.push(`group "${g}" has tests but weight 0`);
  }
  const seen = new Set<string>();
  tests.forEach((t, i) => {
    if (!t.input.trim() || !t.expected.trim()) errs.push(`test ${i} has empty input or expected`);
    if (seen.has(t.input)) errs.push(`test ${i} duplicates an earlier input`);
    seen.add(t.input);
  });
  return errs;
}

/** Prerequisite graph must be acyclic. Returns one cycle's ids, or null. */
export function findPrerequisiteCycle(metas: Pick<ProblemMeta, "id" | "prerequisites">[]): string[] | null {
  const by = new Map(metas.map((m) => [m.id, m.prerequisites]));
  const state = new Map<string, 1 | 2>();
  const path: string[] = [];
  const visit = (id: string): string[] | null => {
    if (state.get(id) === 2) return null;
    if (state.get(id) === 1) return [...path.slice(path.indexOf(id)), id];
    state.set(id, 1);
    path.push(id);
    for (const q of by.get(id) ?? []) {
      const c = visit(q);
      if (c) return c;
    }
    path.pop();
    state.set(id, 2);
    return null;
  };
  for (const id of by.keys()) {
    const c = visit(id);
    if (c) return c;
  }
  return null;
}
