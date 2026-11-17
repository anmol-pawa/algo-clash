import type { Frame, Mark, Trace } from "./types";

export type ContainerKind = "stack" | "queue";

/**
 * Stack or queue animator. Each input number is one operation: 0 means pop (stack) or dequeue (queue),
 * any other number is pushed. Popping an empty container is reported, not hidden (it is undefined behaviour
 * on std::stack and std::queue). result = the contents at the end, bottom-to-top or front-to-back.
 */
export function traceContainer(kind: ContainerKind, ops: readonly number[]): Trace {
  const items: number[] = [];
  const frames: Frame[] = [];
  const isStack = kind === "stack";
  const ends = isStack ? "bottom to top" : "front to back";
  const pointersFor = (): { label: string; index: number }[] =>
    !items.length ? [] : isStack ? [{ label: "top", index: items.length - 1 }] : [{ label: "front", index: 0 }, ...(items.length > 1 ? [{ label: "back", index: items.length - 1 }] : [])];
  const keyMarks = (): Mark[] => (items.length ? [{ index: isStack ? items.length - 1 : 0, kind: "key" }] : []);
  const snap = (note: string, marks: Mark[] = keyMarks()): void => {
    frames.push({ array: [...items], marks, pointers: pointersFor(), note, state: { size: items.length, order: ends, [isStack ? "top" : "front"]: items.length ? items[isStack ? items.length - 1 : 0] : "empty" } });
  };
  if (!ops.length) {
    snap("No operations. Type numbers: 0 removes, anything else is added.");
    return { frames, result: [] };
  }
  for (const op of ops) {
    if (op !== 0) {
      items.push(op);
      snap(isStack ? `push(${op}): it lands on top. The previous top is now covered and cannot come out first.` : `push(${op}): it joins the back of the line, behind everyone already waiting.`, [{ index: items.length - 1, kind: "found" }]);
    } else if (!items.length) {
      snap(isStack ? "pop() on an empty stack: nothing to remove. On std::stack this is undefined behaviour, so always check empty() first." : "pop() on an empty queue: nothing to remove. On std::queue this is undefined behaviour, so always check empty() first.", []);
    } else if (isStack) {
      const gone = items.pop()!;
      snap(`pop(): the top (${gone}) leaves. Last in, first out: it was the newest.`);
    } else {
      const gone = items.shift()!;
      snap(`pop(): the front (${gone}) leaves. First in, first out: it waited longest.`);
    }
  }
  frames.push({
    array: [...items], marks: [], pointers: pointersFor(),
    note: `Done. Every push and pop touched only one end, so each cost O(1). ${isStack ? "std::stack" : "std::queue"} deliberately hides the rest of the container.`,
    state: { size: items.length, order: ends },
  });
  return { frames, result: [...items] };
}

/**
 * Monotonic stack, "wait for a greater value": for each i, how many steps until a strictly greater value
 * (0 when none). The stack holds indices still waiting, with values never increasing from bottom to top.
 */
export function traceNextGreater(values: readonly number[]): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const wait: number[] = new Array(a.length).fill(0);
  const resolved = new Set<number>();
  const stack: number[] = [];
  const show = (s: number[]) => (s.length ? `[${s.map((i) => `${a[i]}@${i}`).join(", ")}]` : "[]");
  const base = (): Pick<Frame, "array" | "state"> => ({ array: [...a], state: { stack: show(stack), wait: `[${wait.join(", ")}]` } });
  const stackMarks = (): Mark[] => stack.map((index) => ({ index, kind: "key" as const }));
  const doneMarks = (): Mark[] => [...resolved].map((index) => ({ index, kind: "sorted" as const }));
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input.", state: { stack: "[]", wait: "[]" } });
    return { frames, result: [] };
  }
  for (let i = 0; i < a.length; i++) {
    let popped = 0;
    while (stack.length && a[stack[stack.length - 1]] < a[i]) {
      const j = stack.pop()!;
      wait[j] = i - j;
      resolved.add(j);
      popped++;
      frames.push({
        ...base(), marks: [...doneMarks(), ...stackMarks(), { index: i, kind: "compare" }, { index: j, kind: "found" }], pointers: [{ label: "i", index: i }],
        note: `${a[i]} is greater than ${a[j]} (index ${j}), so index ${j} has found its answer: ${i} - ${j} = ${wait[j]}. Pop it.`,
      });
    }
    stack.push(i);
    frames.push({
      ...base(), marks: [...doneMarks(), ...stackMarks(), { index: i, kind: "compare" }], pointers: [{ label: "i", index: i }],
      note: popped
        ? `Push index ${i} (value ${a[i]}) after ${popped} pop${popped > 1 ? "s" : ""}. What remains below it is at least ${a[i]}, so the stack still never increases going up.`
        : `Nothing on the stack is smaller than ${a[i]}, so no one is resolved. Push index ${i}; it waits too.`,
    });
  }
  frames.push({
    ...base(), marks: doneMarks(), pointers: [],
    note: `Done. ${stack.length ? `Indices still on the stack (${stack.join(", ")}) never saw a greater value, so their answer stays 0. ` : ""}Each index was pushed once and popped at most once: O(n) total, even though a single step can pop many.`,
  });
  return { frames, result: wait };
}
