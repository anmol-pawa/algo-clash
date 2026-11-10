import type { DialogueScript } from "./script";

/** Original Array Atoll dialogue: sets up Tidecaller Mira's gym and the "dry tide" rule (GDD §5.5). */
export const ATOLL_DIALOGUES: Record<string, DialogueScript> = {
  "atoll-pell": {
    id: "atoll-pell",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Diver Pell",
        pages: [
          "Welcome to Array Atoll! Look at the boardwalk: every plank has a number, and the number never changes.",
          "That is why I can jump straight to plank 7. No counting from the pier. Indexing costs one step.",
        ],
        choices: [
          { text: "What lives in the seagrass?", next: "grass" },
          { text: "Thanks, Pell.", set: ["atoll.pell"] },
        ],
      },
      grass: {
        speaker: "Diver Pell",
        pages: ["Wild Structlings hide in the seagrass. Walk through it and one may rustle out to test you.", "Hold the rhythm: read the problem, name the pattern, then write the code."],
        set: ["atoll.pell"],
      },
      again: {
        speaker: "Diver Pell", when: "atoll.pell",
        pages: ["Mira keeps the tide-staff at the end of the pier. Four cells, lit one after another. Watch the order."],
      },
    },
  },
  "atoll-ru": {
    id: "atoll-ru",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Angler Ru",
        pages: [
          "The tide is out today. Mira calls it the dry tide: no maps, no sets, no stacks, no spare vectors.",
          "Your tools are two pointers that walk toward each other, and a running sum. That is all the sea gives you.",
        ],
        choices: [
          { text: "How do I beat it?", next: "tip" },
          { text: "I'll manage.", set: ["atoll.ru"] },
        ],
      },
      tip: {
        speaker: "Angler Ru",
        pages: ["Sorted data? Pointers from both ends: move the one that cannot be the answer. Counting stretches? A prefix sum turns a range into a subtraction.", "Practise those in the Academy first, then climb the pier."],
        set: ["atoll.ru"],
      },
      again: {
        speaker: "Angler Ru", when: "atoll.ru",
        pages: ["Careful with the sum. A long stretch of big numbers needs long long, or the tide wraps around."],
      },
    },
  },
};
