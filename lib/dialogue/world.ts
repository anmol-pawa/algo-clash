import type { DialogueScript } from "./script";
import { ATOLL_DIALOGUES } from "./atoll";
import { WOODS_DIALOGUES } from "./woods";
import { MAINVILLE_DIALOGUES } from "./mainville";

/** Every overworld dialogue script by id. */
export const WORLD_DIALOGUES: Record<string, DialogueScript> = { ...MAINVILLE_DIALOGUES, ...ATOLL_DIALOGUES, ...WOODS_DIALOGUES };
