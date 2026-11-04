import type { ProblemMeta } from "@/lib/content/types";
import type { TestCase } from "@/lib/judge/verdict";

/** One bundled problem package as the battle UI needs it (tests load lazily as their own chunk). */
export interface CatalogProblem {
  meta: ProblemMeta;
  statement: string;
  loadTests: () => Promise<TestCase[]>;
}
