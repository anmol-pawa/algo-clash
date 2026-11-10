import type { DialogueScript } from "./script";

/** Array Atoll dialogue (D1f-4). Original text. */
export const ATOLL_DIALOGUES: Record<string, DialogueScript> = {
  "ferryman-tally": {
    id: "ferryman-tally",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Ferryman Tally", portrait: "villager",
        pages: [
          "Welcome to Array Atoll! Every plank on this pier has a number, and I can find any one of them without counting.",
          "Tidecaller Mira runs the gym at the end of the boardwalk. Her tide goes out on game day: no maps, sets, stacks or queues allowed.",
        ],
        choices: [
          { text: "How do I beat that?", next: "tip" },
          { text: "Thanks!", set: ["tally.met"] },
        ],
      },
      tip: {
        speaker: "Ferryman Tally", portrait: "villager",
        pages: ["Two pointers walk in from both ends. Prefix sums remember what you have already passed. Neither needs a map."],
        set: ["tally.met"],
      },
      again: {
        speaker: "Ferryman Tally", portrait: "villager", when: "tally.met",
        pages: ["Mind the seagrass: wild Structlings hide in it. The tide waits for no one!"],
      },
    },
  },
};
