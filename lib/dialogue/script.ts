/** Dialogue scripts and a tiny pure runner (no DOM). The UI types lines out with `visibleText`. */

export interface Choice {
  text: string;
  /** Node to jump to; omit to end the conversation. */
  next?: string;
  /** Flags set when this choice is picked. */
  set?: string[];
}
export interface DialogueNode {
  /** Speaker name shown in the name tag; omit for narration. */
  speaker?: string;
  /** Portrait id (game/sprites/character.ts), optional. */
  portrait?: string;
  /** Text pages shown one tap at a time. */
  pages: string[];
  /** Flags set when the node is shown. */
  set?: string[];
  choices?: Choice[];
  /** Next node when there are no choices; omit to end. */
  next?: string;
  /** Alternative start used when a flag is already set: first matching `when` wins (checked on start). */
  when?: string;
}
export interface DialogueScript {
  id: string;
  start: string;
  nodes: Record<string, DialogueNode>;
}

export interface DialogueState {
  script: DialogueScript;
  nodeId: string;
  page: number;
  done: boolean;
  /** Flags raised so far, merged into the caller's save flags when the conversation ends. */
  raised: string[];
}

export function validateScript(s: DialogueScript): string[] {
  const errs: string[] = [];
  if (!s.nodes[s.start]) errs.push(`start node "${s.start}" missing`);
  for (const [id, n] of Object.entries(s.nodes)) {
    if (n.pages.length === 0) errs.push(`${id}: no pages`);
    if (n.choices && n.next) errs.push(`${id}: has both choices and next`);
    if (n.choices?.length === 0) errs.push(`${id}: empty choices`);
    if (n.next && !s.nodes[n.next]) errs.push(`${id}: next "${n.next}" missing`);
    for (const c of n.choices ?? []) if (c.next && !s.nodes[c.next]) errs.push(`${id}: choice next "${c.next}" missing`);
  }
  return errs;
}

/** Begin a conversation. Nodes with `when` flags are chosen by the caller via `startNode`. */
export function startDialogue(script: DialogueScript, flags: ReadonlySet<string> = new Set(), startNode?: string): DialogueState {
  const nodeId = startNode ?? pickStart(script, flags);
  return enter({ script, nodeId, page: 0, done: false, raised: [] }, nodeId);
}

/** First node (in insertion order) whose `when` flag is set wins, else the script start. */
function pickStart(script: DialogueScript, flags: ReadonlySet<string>): string {
  for (const [id, n] of Object.entries(script.nodes)) if (n.when && flags.has(n.when)) return id;
  return script.start;
}

function enter(st: DialogueState, nodeId: string): DialogueState {
  const node = st.script.nodes[nodeId];
  return { ...st, nodeId, page: 0, raised: [...st.raised, ...(node.set ?? [])] };
}

export function currentNode(st: DialogueState): DialogueNode {
  return st.script.nodes[st.nodeId];
}
/** True on the last page of a node that is waiting for the player to pick a choice. */
export function awaitingChoice(st: DialogueState): boolean {
  const n = currentNode(st);
  return !st.done && !!n.choices && st.page === n.pages.length - 1;
}

/** Tap/Enter: next page, then next node, then done. Ignored while a choice is pending. */
export function advance(st: DialogueState): DialogueState {
  if (st.done || awaitingChoice(st)) return st;
  const n = currentNode(st);
  if (st.page < n.pages.length - 1) return { ...st, page: st.page + 1 };
  if (n.next) return enter(st, n.next);
  return { ...st, done: true };
}

export function choose(st: DialogueState, index: number): DialogueState {
  if (!awaitingChoice(st)) return st;
  const c = currentNode(st).choices![index];
  if (!c) return st;
  const withFlags = { ...st, raised: [...st.raised, ...(c.set ?? [])] };
  return c.next ? enter(withFlags, c.next) : { ...withFlags, done: true };
}

/** Typewriter: characters visible after `elapsedMs` at `cps` characters per second. */
export function visibleText(text: string, elapsedMs: number, cps = 45): string {
  if (cps <= 0) return text;
  return [...text].slice(0, Math.max(0, Math.floor((elapsedMs / 1000) * cps))).join("");
}
