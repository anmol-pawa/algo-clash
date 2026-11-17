import type { DialogueScript } from "./script";

/** Original Stackspire dialogue: sets up the Sentinel's gym and the "Iron stack" rule (GDD §5.5). */
export const SPIRE_DIALOGUES: Record<string, DialogueScript> = {
  "spire-ossian": {
    id: "spire-ossian",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Sentry Ossian",
        pages: [
          "Mind the slabs. The last one laid is the first one lifted: that is a stack, and this whole spire is built that way.",
          "Push puts a slab on top, pop lifts the top slab, and you never touch the ones beneath. Each takes O(1).",
        ],
        choices: [
          { text: "Where is a stack useful?", next: "uses" },
          { text: "Thanks, Ossian.", set: ["spire.ossian"] },
        ],
      },
      uses: {
        speaker: "Ossian",
        pages: [
          "Brackets, for one: push each opener, and every closer must match the top. Anything left over at the end, or a closer on an empty stack, means the text is broken.",
          "Also anything that says 'the nearest bigger one to my right'. Keep a stack of waiting items and let each new arrival pop the ones it beats. Every item enters once and leaves once, so the whole sweep is O(n).",
        ],
        set: ["spire.ossian"],
      },
      again: {
        speaker: "Sentry Ossian", when: "spire.ossian",
        pages: ["The runes on the flagstones hum when a Structling is near. Step on one and see who answers."],
      },
    },
  },
  "spire-wren": {
    id: "spire-wren",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Scribe Wren",
        pages: [
          "The Sentinel at the top of the avenue keeps one iron rule: no function may call itself. She calls it the Iron stack.",
          "Recursion is a stack too, one the compiler keeps for you. A deep enough tower of calls overflows it, and the Sentinel loves to build nesting a hundred thousand levels deep.",
        ],
        choices: [
          { text: "So what do I do instead?", next: "explicit" },
          { text: "I'll bring my own stack.", set: ["spire.wren"] },
        ],
      },
      explicit: {
        speaker: "Wren",
        pages: [
          "Move the pending work into a std::vector or std::stack of your own. It lives on the heap, so it can grow as deep as memory allows.",
          "For brackets in an expression, keep one stack of numbers and one of operators, and settle higher-precedence work before you push a weaker operator. Use long long for the totals.",
        ],
        set: ["spire.wren"],
      },
      again: {
        speaker: "Scribe Wren", when: "spire.wren",
        pages: ["The tower door is at the top of the avenue. Leave the recursion at the gate."],
      },
    },
  },
};
