/**
 * Interview/Contest "write your own tests" gate and edge-case-class coverage (GDD §6.5).
 * Pure: no DOM. Classes are detected from the input text with generic features, and a problem's applicable
 * classes are derived from its own hidden edge/adversarial/perf tests, never typed by hand.
 */
import type { TestCase } from "../judge/verdict";

export const EDGE_CLASSES = ["empty", "single", "zero", "negative", "duplicate", "large"] as const;
export type EdgeClass = (typeof EDGE_CLASSES)[number];

export const EDGE_LABELS: Record<EdgeClass, string> = {
  empty: "Empty input",
  single: "Single element",
  zero: "Zero",
  negative: "Negative values",
  duplicate: "Duplicates",
  large: "Overflow-size values",
};

/** Values at or above this do not fit a 32-bit int comfortably (the classic `long long` trap). */
export const LARGE_THRESHOLD = 1_000_000_000;

/** Minimum own tests (that your own code passes) before Submit unlocks. */
export const MIN_OWN_TESTS = 2;
export const MAX_OWN_TESTS = 8;

const LIST = /\[([^\[\]]*)\]/g;

function numbersIn(s: string): number[] {
  return (s.match(/-?\d+/g) ?? []).map((t) => Number(t));
}

/** Which edge classes a test input exercises. Order follows `EDGE_CLASSES`. */
export function inputClasses(input: string): EdgeClass[] {
  const found = new Set<EdgeClass>();
  const nums = numbersIn(input);
  if (input.trim() === "" || /\[\s*\]|""/.test(input)) found.add("empty");
  for (const m of input.matchAll(LIST)) {
    const items = m[1].trim() === "" ? [] : m[1].split(",");
    if (items.length === 1) found.add("single");
    const keys = items.map((t) => t.trim());
    if (keys.length > 1 && new Set(keys).size < keys.length) found.add("duplicate");
  }
  if (nums.some((n) => n === 0)) found.add("zero");
  if (nums.some((n) => n < 0)) found.add("negative");
  if (nums.some((n) => Math.abs(n) >= LARGE_THRESHOLD)) found.add("large");
  return EDGE_CLASSES.filter((c) => found.has(c));
}

/** Classes worth testing for a problem: those its own non-basic hidden tests exercise. */
export function applicableClasses(hidden: readonly TestCase[]): EdgeClass[] {
  const found = new Set<EdgeClass>();
  for (const t of hidden) if (t.group !== "basic") for (const c of inputClasses(t.input)) found.add(c);
  return EDGE_CLASSES.filter((c) => found.has(c));
}

export interface Coverage {
  covered: EdgeClass[];
  missed: EdgeClass[];
  /** 0..1; 1 when the problem has no applicable class. */
  ratio: number;
}

export function coverage(own: readonly Pick<TestCase, "input">[], applicable: readonly EdgeClass[]): Coverage {
  const hit = new Set<EdgeClass>();
  for (const t of own) for (const c of inputClasses(t.input)) hit.add(c);
  const covered = applicable.filter((c) => hit.has(c));
  const missed = applicable.filter((c) => !hit.has(c));
  return { covered, missed, ratio: applicable.length === 0 ? 1 : covered.length / applicable.length };
}

export interface OwnTest extends TestCase {
  /** Set once the test has been judged against the player's own code. */
  passed?: boolean;
}

/** A draft test is usable when both sides are non-blank. Returns the problem, or null when fine. */
export function ownTestIssue(t: Pick<TestCase, "input" | "expected">): string | null {
  if (t.input.trim() === "") return "Write the input first.";
  if (t.expected.trim() === "") return "Write the expected output.";
  return null;
}

export interface GateState {
  unlocked: boolean;
  passing: number;
  need: number;
  message: string;
}

/** Submit unlocks after `MIN_OWN_TESTS` well-formed tests that your own code passes. Modes without the gate are always open. */
export function ownTestsGate(required: boolean, tests: readonly OwnTest[]): GateState {
  const passing = tests.filter((t) => t.passed === true && ownTestIssue(t) === null).length;
  if (!required) return { unlocked: true, passing, need: 0, message: "" };
  const unlocked = passing >= MIN_OWN_TESTS;
  return {
    unlocked, passing, need: MIN_OWN_TESTS,
    message: unlocked ? "Own tests passed. Submit is unlocked." : `Write and pass ${MIN_OWN_TESTS} of your own tests to unlock Submit (${passing}/${MIN_OWN_TESTS}).`,
  };
}

/** The WA diff (input, expected, got) is hidden in Interview and Contest: you must reproduce it with your own test. */
export const hidesDiff = (ownTests: boolean): boolean => ownTests;
