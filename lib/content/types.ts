/** Problem package format (GDD §8.1). */
import type { DriverSpec } from "../judge/harness/driver";

export type Difficulty = "E" | "M" | "H";
export type TestGroup = "basic" | "edge" | "adversarial" | "perf";
export const TEST_GROUPS: readonly TestGroup[] = ["basic", "edge", "adversarial", "perf"];

export interface SimilarPointer {
  name: string;
  lcNumber?: number;
  /** Only when verified. */
  url?: string;
}

export interface ProblemMeta {
  /** Unique, kebab-case; also the folder name. */
  id: string;
  /** Region id (R0–R23). */
  region: string;
  /** Original, themed title. */
  title: string;
  difficulty: Difficulty;
  /** Pattern ids from `content/patterns.ts`; the first is the primary pattern. */
  patterns: string[];
  /** Phrases in the statement that point to the pattern. */
  signals: string[];
  /** Problem ids that should be solved first. */
  prerequisites: string[];
  parSeconds: number;
  /** Per-test wall time for the judge (native reference runs well inside it). */
  timeLimitMs: number;
  /** Relative weight of each hidden test group in the score. */
  testWeights: Record<TestGroup, number>;
  similar: SimilarPointer[];
  /** Compare outputs with this absolute/relative tolerance instead of exactly (floating-point answers). */
  floatTol?: number;
  /** Signature for the generated driver. */
  spec: DriverSpec;
}

export interface HiddenTest {
  input: string;
  expected: string;
  group: TestGroup;
}
