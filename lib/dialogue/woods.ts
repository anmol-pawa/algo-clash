import type { DialogueScript } from "./script";

/** Original Window Woods dialogue: sets up the Pane Warden's gym and the "shrinking pane" rule (GDD §5.5). */
export const WOODS_DIALOGUES: Record<string, DialogueScript> = {
  "woods-juniper": {
    id: "woods-juniper",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Ranger Juniper",
        pages: [
          "See those glass panes between the pines? Each one shows a stretch of forest, and the stretch slides as you walk.",
          "A sliding window is that: two ends, one stretch. Grow the right end to take in more, shrink the left end when the stretch breaks a rule.",
        ],
        choices: [
          { text: "How do I code it?", next: "code" },
          { text: "Thanks, Juniper.", set: ["woods.juniper"] },
        ],
      },
      code: {
        speaker: "Ranger Juniper",
        pages: [
          "Each element enters once and leaves once, so the whole walk is O(n), even with a loop inside a loop.",
          "Decide when to record the answer: after you shrink for longest-stretch problems, and while it is valid for shortest-stretch ones.",
        ],
        set: ["woods.juniper"],
      },
      again: {
        speaker: "Ranger Juniper", when: "woods.juniper",
        pages: ["Ferns hide wild Structlings. Step in slowly and keep both ends of your window in view."],
      },
    },
  },
  "woods-bram": {
    id: "woods-bram",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Hiker Bram",
        pages: [
          "Sorrel, the Pane Warden, has no patience. She calls it the shrinking pane: the first time your slow code runs out of time, her limit gets cut in half.",
          "So do not start with brute force on her big round. Rescanning every window is O(n times k), and that is what trips it.",
        ],
        choices: [
          { text: "What is the fast way?", next: "deque" },
          { text: "I'll be quick.", set: ["woods.bram"] },
        ],
      },
      deque: {
        speaker: "Bram",
        pages: [
          "For the biggest value in every window, keep a deque of indices whose values only go down. The front is always the winner.",
          "And if values can be negative, a plain shrinking window breaks. Use prefix sums and a deque instead, and keep sums in long long.",
        ],
        set: ["woods.bram"],
      },
      again: {
        speaker: "Hiker Bram", when: "woods.bram",
        pages: ["The clearing is north, past the bridge. Mind the stream; the planks are the only way over."],
      },
    },
  },
};
