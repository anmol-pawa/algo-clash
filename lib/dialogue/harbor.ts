import type { DialogueScript } from "./script";

/** Original Hashwood Harbor dialogue: sets up the Hydra's gym and the "hash flood" rule (GDD §5.5). */
export const HARBOR_DIALOGUES: Record<string, DialogueScript> = {
  "harbor-marlo": {
    id: "harbor-marlo",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Dockhand Marlo",
        pages: [
          "Welcome to Hashwood! See the lockers on the warehouse wall? A crate's name decides its locker: do a little arithmetic on the name, take the remainder, and that is the number.",
          "That is a hash table. Finding a crate costs one calculation, not a walk past every locker.",
        ],
        choices: [
          { text: "What if two crates share a locker?", next: "collide" },
          { text: "Thanks, Marlo.", set: ["harbor.marlo"] },
        ],
      },
      collide: {
        speaker: "Marlo",
        pages: [
          "Then they pile up in that locker, and you check the pile. Few piles, short piles: that is O(1) on average.",
          "But if a trickster sends crates that all land in one locker, the pile is the whole yard and every lookup is O(n). Never promise more than average.",
        ],
        set: ["harbor.marlo"],
      },
      again: {
        speaker: "Dockhand Marlo", when: "harbor.marlo",
        pages: ["Wild Structlings swim up the tide line, right where the quay meets the water. Step on the wet stones and one may surface."],
      },
    },
  },
  "harbor-tansy": {
    id: "harbor-tansy",
    start: "hello",
    nodes: {
      hello: {
        speaker: "Clerk Tansy",
        pages: [
          "The Hydra that keeps the big warehouse has many heads and one trick. She calls it the hash flood.",
          "She sends strands built so that a cheap hash gives the same number for different strands. If you trust a matching number, she wins.",
        ],
        choices: [
          { text: "How do I beat that?", next: "verify" },
          { text: "I'll be careful.", set: ["harbor.tansy"] },
        ],
      },
      verify: {
        speaker: "Tansy",
        pages: [
          "A matching hash is only a candidate. Compare the real letters before you believe it, and your answer is right even when two strands collide.",
          "For a rolling hash, slide it in O(1) per step and keep the arithmetic in long long. If you are unsure, an ordered map is slower but cannot be flooded.",
        ],
        set: ["harbor.tansy"],
      },
      again: {
        speaker: "Clerk Tansy", when: "harbor.tansy",
        pages: ["The warehouse door is at the top of the cobbles. Bring a plan for collisions."],
      },
    },
  },
};
