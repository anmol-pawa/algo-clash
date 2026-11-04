/** The elaborative prompt shown in the Debrief (GDD §6.1 step 6): one cheap multiple-choice "why" question. Pure. */

export interface ElaborativePrompt {
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** One or two sentences shown after answering, whichever option was picked. */
  why: string;
}

/** Returns a list of problems with a prompt (empty when it is well formed). Used by the content test. */
export function promptIssues(p: ElaborativePrompt): string[] {
  const issues: string[] = [];
  if (!p.question.trim()) issues.push("empty question");
  if (p.options.length < 3 || p.options.length > 4) issues.push("needs 3 or 4 options");
  if (new Set(p.options.map((o) => o.trim().toLowerCase())).size !== p.options.length) issues.push("duplicate options");
  if (p.options.some((o) => !o.trim())) issues.push("empty option");
  if (!Number.isInteger(p.answer) || p.answer < 0 || p.answer >= p.options.length) issues.push("answer out of range");
  if (!p.why.trim()) issues.push("empty explanation");
  return issues;
}

export const gradePrompt = (p: ElaborativePrompt, choice: number): boolean => choice === p.answer;
