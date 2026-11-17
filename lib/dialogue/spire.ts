import type { DialogueScript } from "./script";

/** Original Stackspire dialogue: sets up the Sentinel's gym and the "Iron stack" rule (GDD §5.5). */
export const SPIRE_DIALOGUES: Record<string, DialogueScript> = {
  "spire-orrin": {
    id: "spire-orrin",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Mason Orrin",
        pages: [
          "Welcome to the Spire. Every stone here sits on the one before it, and I may only take the top slab down. Last in, first out: that is a stack.",
          "Push a slab, pop a slab, peek at the top: all O(1). Nothing in the middle is reachable until the ones above it are gone.",
        ],
        choices: [
          { text: "What is it good for?", next: "uses" },
          { text: "Thanks, Orrin.", set: ["spire.orrin"] },
        ],
      },
      uses: {
        speaker: "Orrin",
        pages: [
          "Brackets that must close in reverse order. Undo history. And the monotonic stack: keep only the slabs that can still matter, and each slab is pushed once and popped once, so the whole sweep is O(n).",
          "Before you pop, check the stack is not empty. Calling top() on an empty stack is undefined behaviour, and the Sentinel loves to test it.",
        ],
        set: ["spire.orrin"],
      },
      again: {
        speaker: "Mason Orrin", when: "spire.orrin",
        pages: ["Rune pads in the courtyard wake wild Structlings when you step on them. Mind your footing."],
      },
    },
  },
  "spire-pell": {
    id: "spire-pell",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Archivist Pell",
        pages: [
          "The Sentinel guards the tower with one rule: the Iron stack. In his gate trial no function may call itself, not directly, not through a friend, not through a lambda.",
          "A deep pile of brackets would overflow the call stack. He wants to see you carry the pending work yourself.",
        ],
        choices: [
          { text: "How do I do that?", next: "explicit" },
          { text: "I'll manage.", set: ["spire.pell"] },
        ],
      },
      explicit: {
        speaker: "Pell",
        pages: [
          "Make a std::stack of the things you would have remembered in each recursive call: an operator, a running total, the text you parked before a bracket.",
          "Loop until the stack is empty. The memory is the same O(depth), but it lives on the heap and never overflows. Use long long for the totals.",
        ],
        set: ["spire.pell"],
      },
      again: {
        speaker: "Archivist Pell", when: "spire.pell",
        pages: ["The tower door is at the top of the avenue. Bring an explicit stack, not a recursive function."],
      },
    },
  },
};
