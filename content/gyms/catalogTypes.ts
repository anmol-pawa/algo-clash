import type { ProblemMeta } from "@/lib/content/types";
import type { TestCase } from "@/lib/judge/verdict";

/** Optional elaborative prompt (`prompt.json`, GDD §6.1 step 6): one question after a win, answered by picking an option. */
export interface ElaborativePrompt {
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
}

/** One bundled problem package as the battle UI needs it (tests load lazily as their own chunk). */
export interface CatalogProblem {
  meta: ProblemMeta;
  statement: string;
  /** `editorial.md` in house style (GDD §8.3). */
  editorial: string;
  /** The reference `solution.cpp`. */
  reference: string;
  prompt?: ElaborativePrompt;
  loadTests: () => Promise<TestCase[]>;
}
