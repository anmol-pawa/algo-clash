/**
 * Own tests for Interview/Contest mode (GDD §6.5). Text format: tests are separated by a blank line;
 * the input is one LC literal per line, and the last line starts with "=>" followed by the expected output.
 */
import { parseLc } from "../judge/lc";
import type { TestCase } from "../judge/verdict";

export interface OwnTests {
  tests: TestCase[];
  /** Human-readable problems, one per rejected block. */
  errors: string[];
}

export const OWN_TESTS_PLACEHOLDER = "[1,2,3]\n3\n=> 2\n\n[]\n0\n=> -1";

export function parseOwnTests(text: string): OwnTests {
  const tests: TestCase[] = [];
  const errors: string[] = [];
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  blocks.forEach((block, i) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const last = lines[lines.length - 1] ?? "";
    if (!last.startsWith("=>")) { errors.push(`Test ${i + 1}: end with a line like "=> expected output".`); return; }
    const expected = last.slice(2).trim();
    const input = lines.slice(0, -1);
    if (input.length === 0 || expected === "") { errors.push(`Test ${i + 1}: needs an input and an expected output.`); return; }
    try { for (const l of input) parseLc(l); parseLc(expected); } catch { errors.push(`Test ${i + 1}: could not read a value (use LeetCode literals such as [1,2] or "ab").`); return; }
    tests.push({ input: input.join("\n"), expected, group: "own" });
  });
  return { tests, errors };
}
