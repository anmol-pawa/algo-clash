/** Branching dialogue scripts with portraits and flags. Pure logic. */

export type Condition = { flag: string; is?: boolean };
export interface Choice {
  text: string;
  goto: string;
  setFlags?: string[];
}
export interface DialogueNode {
  speaker?: string;
  /** Portrait id (e.g. "iota"), drawn beside the box. */
  portrait?: string;
  text: string;
  /** Flags set when this node is shown. */
  setFlags?: string[];
  /** Branch on flags: first matching condition wins, evaluated when leaving. */
  branches?: Array<{ when: Condition; goto: string }>;
  choices?: Choice[];
  next?: string;
}
export interface DialogueScript {
  id: string;
  start: string;
  nodes: Record<string, DialogueNode>;
}
export type Flags = ReadonlySet<string>;

export const holds = (c: Condition, flags: Flags): boolean => flags.has(c.flag) === (c.is ?? true);

export function validateScript(s: DialogueScript): string[] {
  const errs: string[] = [];
  if (!(s.start in s.nodes)) errs.push(`start '${s.start}' missing`);
  for (const [id, n] of Object.entries(s.nodes)) {
    const targets = [
      ...(n.next ? [n.next] : []),
      ...(n.branches ?? []).map((b) => b.goto),
      ...(n.choices ?? []).map((c) => c.goto),
    ];
    for (const t of targets) if (!(t in s.nodes)) errs.push(`${id}: goto '${t}' missing`);
    if (n.choices && n.choices.length === 0) errs.push(`${id}: empty choices`);
    if (n.choices && (n.next || n.branches)) errs.push(`${id}: choices cannot combine with next/branches`);
  }
  return errs;
}

export interface DialogueState {
  script: DialogueScript;
  node: string;
  flags: Flags;
  done: boolean;
}

function enter(script: DialogueScript, node: string, flags: Flags): DialogueState {
  const n = script.nodes[node];
  const f = new Set(flags);
  for (const x of n.setFlags ?? []) f.add(x);
  return { script, node, flags: f, done: false };
}
export const startDialogue = (script: DialogueScript, flags: Flags): DialogueState =>
  enter(script, script.start, flags);
export const currentNode = (s: DialogueState): DialogueNode => s.script.nodes[s.node];

/** Advance past a non-choice node. Throws on a node that still needs a choice. */
export function advance(s: DialogueState): DialogueState {
  const n = currentNode(s);
  if (n.choices) throw new Error("choose() required");
  const hit = (n.branches ?? []).find((b) => holds(b.when, s.flags));
  const to = hit?.goto ?? n.next;
  return to ? enter(s.script, to, s.flags) : { ...s, done: true };
}
export function choose(s: DialogueState, index: number): DialogueState {
  const c = currentNode(s).choices?.[index];
  if (!c) throw new Error("no such choice");
  const f = new Set(s.flags);
  for (const x of c.setFlags ?? []) f.add(x);
  return enter(s.script, c.goto, f);
}

/** Typewriter helper: characters visible after `elapsedMs` at `cps` characters per second. */
export const visibleChars = (text: string, elapsedMs: number, cps = 45): number =>
  Math.min(text.length, Math.max(0, Math.floor((elapsedMs / 1000) * cps)));
