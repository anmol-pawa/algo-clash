import type { DialogueScript } from "./script";

/** Original Mainville dialogue (B2 sample content; the lab/starter flow comes in B6). */
export const MAINVILLE_DIALOGUES: Record<string, DialogueScript> = {
  "iota-intro": {
    id: "iota-intro",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Prof. Iota", portrait: "iota",
        pages: ["Ah, a new trainer! I study Structlings: creatures that live inside data.", "Every one thinks in its own shape. Learn the shape and the problem solves itself."],
        choices: [
          { text: "Tell me more!", next: "more" },
          { text: "Let's begin.", set: ["iota.met"] },
        ],
      },
      more: {
        speaker: "Prof. Iota", portrait: "iota",
        pages: ["An Arrayling keeps everything in order and finds item number seven in a single step.", "You will write the code that commands them. In C++. By hand."],
        set: ["iota.met"],
      },
      again: {
        speaker: "Prof. Iota", portrait: "iota", when: "iota.met",
        pages: ["Back already? Practice makes the shapes familiar."],
      },
    },
  },
  "sign-welcome": {
    id: "sign-welcome",
    start: "s",
    nodes: { s: { pages: ["MAINVILLE. Where every journey through the data begins."] } },
  },
  "sign-atoll": {
    id: "sign-atoll",
    start: "s",
    nodes: { s: { pages: ["ARRAY ATOLL. Every sandbar has a number. The tide always comes back to index zero."] } },
  },
  "villager-grass": {
    id: "villager-grass",
    start: "v",
    nodes: { v: { speaker: "Villager", pages: ["Tall grass hides wild Structlings. Don't wander in without a partner!"] } },
  },
};
