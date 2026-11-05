import type { ProblemMeta } from "@/lib/content/types";
import type { TestCase } from "@/lib/judge/verdict";
import type { ElaborativePrompt } from "@/lib/journal/prompt";

/** One bundled problem package as the battle UI needs it (tests load lazily as their own chunk). */
export interface CatalogProblem {
  meta: ProblemMeta;
  statement: string;
  /** House-style editorial (GDD §8.3), shown in the Debrief after a win. */
  editorial: string;
  /** The reference `solution.cpp`, for the journal diff. */
  reference: string;
  /** The 3-rung hint ladder (`hints.md`), parsed by `lib/items/hints`. */
  hints?: string;
  /** Optional `prompt.json`: the elaborative question. */
  prompt?: ElaborativePrompt;
  loadTests: () => Promise<TestCase[]>;
}
